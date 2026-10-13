import "server-only";

import "server-only";
import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, desc, eq, gt, isNotNull, isNull } from "drizzle-orm";
import { db } from "../_orm/db"
import { eventInvites, eventMembers, events, recoveryTokens } from "../_orm/schema";
import { ActionResult } from "../_types/ActionType";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

const ONE_YEAR = 60 * 60 * 24 * 365;

export const newToken = () => randomBytes(32).toString("base64url");
export const hashToken = (t: string) => createHash("sha256").update(t).digest("hex");

export const inviteUrl = (token: string) => `${process.env.NEXT_PUBLIC_APP_URL}/join/${token}`;

const cookieName = (eventId: number) => `member_${eventId}`; 

const ownerCookieName = (eventId: number) => `owner_${eventId}`;

type Executor = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

export async function setOwnerCookie(eventId: number, token: string) {
  const store = await cookies();
  store.set(ownerCookieName(eventId), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
  });
}

export async function setMemberCookie(eventId: number, token: string) {
  const store = await cookies();
  store.set(cookieName(eventId), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
  });
}

export async function createOwnerRows( tx: Executor, event: { id: number; participants: string[] }, creator: { id: number; username: string }) {
  const ownerToken = newToken();
  await ensureMembers(event.id, event.participants, tx);
  const [ownerMember] = await tx
    .update(eventMembers)
    .set({ isOwner: true, userId: creator.id, claimedAt: new Date() })
    .where(and(eq(eventMembers.eventId, event.id), eq(eventMembers.name, creator.username)))
    .returning();
  if (!ownerMember) throw new Error("The creator's name must be one of the participants");
  await tx
    .update(events)
    .set({ ownerTokenHash: hashToken(ownerToken) })
    .where(eq(events.id, event.id));
  return ownerToken; 
}

export async function getCurrentMember(eventId: number) {
  const store = await cookies();
  const token = store.get(cookieName(eventId))?.value;
  if (!token) return null;
  const member = await db.query.eventMembers.findFirst({
    where: and(
      eq(eventMembers.eventId, eventId),
      eq(eventMembers.sessionTokenHash, hashToken(token))
    ),
  });
  return member ?? null;
}

export async function ensureMembers(eventId: number, names: string[], executor: Executor = db) {
  if (names.length === 0) return;
  await executor
    .insert(eventMembers)
    .values(names.map((name) => ({ eventId, name })))
    .onConflictDoNothing({ target: [eventMembers.eventId, eventMembers.name] });
}

export async function getEventAccess(eventId: number) {
  if (!Number.isInteger(eventId)) return null;
  const event = await db.query.events.findFirst({ where: eq(events.id, eventId) });
  if (!event) return null;

  const store = await cookies();
  const ownerToken = store.get(ownerCookieName(eventId))?.value;
  if (ownerToken && event.ownerTokenHash && event.ownerTokenHash === hashToken(ownerToken)) {
    const member = await db.query.eventMembers.findFirst({
      where: and(
        eq(eventMembers.eventId, eventId),
        eq(eventMembers.userId, event.whoCreated)
      ),
    });
    return { role: "owner" as const, event, member: member ?? null };
  }

  const member = await getCurrentMember(eventId);
  if (member) return { role: "member" as const, event, member };
  return null;
}

export async function getOwnerAccess(eventId: number) {
  const access = await getEventAccess(eventId);
  return access?.role === "owner" ? access : null;
}

export async function requireEventAccess(eventId: number) {
  const access = await getEventAccess(eventId);
  if (!access) redirect("/no-access");
  return access;
}

export async function getValidInvite(token: string) {
  if (!token) return null;
  const invite = await db.query.eventInvites.findFirst({
    where: and(eq(eventInvites.token, token), isNull(eventInvites.revokedAt)),
  });
  if (!invite) return null;
  if (invite.expiresAt && invite.expiresAt < new Date()) return null;
  return invite;
}

export async function getActiveInvite(eventId: number) {
  const invite = await db.query.eventInvites.findFirst({
    where: and(eq(eventInvites.eventId, eventId), isNull(eventInvites.revokedAt)),
    orderBy: desc(eventInvites.createdAt),
  });
  if (!invite) return null;
  if (invite.expiresAt && invite.expiresAt < new Date()) return null;
  return invite;
}

export function encodeHistoryCursor(cursor: {
  createdAt: Date;
  id: number;
}) {
  return Buffer.from(
    JSON.stringify({
      createdAt: cursor.createdAt.toISOString(),
      id: cursor.id,
    })
  ).toString("base64url");
}

export function decodeHistoryCursor(value: string) {
  const parsed = JSON.parse(
    Buffer.from(value, "base64url").toString()
  );

  return {
    createdAt: new Date(parsed.createdAt),
    id: Number(parsed.id),
  };
}


const resend = new Resend(process.env.RESEND_API_KEY);

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function sendEmail(opts: { to: string; subject: string; html: string }) {
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
  if (error) throw new Error(error.message);
}


const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function claimMemberAction( _prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const token = formData.get("token")?.toString() ?? "";
  const memberId = Number(formData.get("member_id"));
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";

  if (!Number.isInteger(memberId)) return { ok: false, error: "Pick your name first" };
  if (email && !EMAIL_RE.test(email)) return { ok: false, error: "That email doesn't look right" };

  const invite = await getValidInvite(token);
  if (!invite) return { ok: false, error: "This invite link is no longer valid" };

  const sessionToken = newToken();
  const [claimed] = await db
    .update(eventMembers)
    .set({
      sessionTokenHash: hashToken(sessionToken),
      claimedAt: new Date(),
      email: email || null,
    })
    .where(
      and(
        eq(eventMembers.id, memberId),
        eq(eventMembers.eventId, invite.eventId),
        isNull(eventMembers.sessionTokenHash),
        eq(eventMembers.isOwner, false)
      )
    ).returning();

  if (!claimed) {
    revalidatePath(`/join/${token}`);
    return { ok: false, error: "That name was just taken. Pick another." };
  }

  await setMemberCookie(invite.eventId, sessionToken);
  return { ok: true, message: `Welcome, ${claimed.name}`, redirectTo: `/${invite.eventId}` };
}

export async function requestRecoveryAction( _prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const token = formData.get("token")?.toString() ?? "";
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";

  if (!EMAIL_RE.test(email)) return { ok: false, error: "Enter a valid email" };
  const invite = await getValidInvite(token);
  if (!invite) return { ok: false, error: "This invite link is no longer valid" };

  const generic: ActionResult = {
    ok: true,
    message: "If that email belongs to a participant, a sign-in link is on its way.",
  };

  const member = await db.query.eventMembers.findFirst({
    where: and(
      eq(eventMembers.eventId, invite.eventId),
      eq(eventMembers.email, email),
      isNotNull(eventMembers.sessionTokenHash)
    ),
  });
  if (!member) return generic;

  const recent = await db.query.recoveryTokens.findFirst({
    where: and(
      eq(recoveryTokens.memberId, member.id),
      gt(recoveryTokens.createdAt, new Date(Date.now() - 60_000))
    ),
  });
  if (recent) return generic;

  const event = await db.query.events.findFirst({ where: eq(events.id, invite.eventId) });
  if (!event) return generic;

  const raw = newToken();
  await db.insert(recoveryTokens).values({
    memberId: member.id,
    tokenHash: hashToken(raw),
    expiresAt: new Date(Date.now() + 30 * 60_000),
  });

  const link = `${process.env.NEXT_PUBLIC_APP_URL}/recover/${raw}`;
  try {
    await sendEmail({
      to: email,
      subject: `Your sign-in link for ${event.event}`,
      html: `
        <p>Hi ${escapeHtml(member.name)},</p>
        <p><a href="${link}">Continue to ${escapeHtml(event.event)}</a></p>
        <p>This link works once and expires in 30 minutes. If you didn't ask for it, ignore this email.</p>`,
    });
  } catch (err) {
    console.error("recovery email failed:", err);
  }
  return generic;
}

export async function completeRecoveryAction( _prev: ActionResult | null,formData: FormData ): Promise<ActionResult> {
  const raw = formData.get("token")?.toString() ?? "";
  if (!raw) return { ok: false, error: "Invalid link" };

  const [used] = await db
    .update(recoveryTokens)
    .set({ usedAt: new Date() })
    .where(
      and(
        eq(recoveryTokens.tokenHash, hashToken(raw)),
        isNull(recoveryTokens.usedAt),
        gt(recoveryTokens.expiresAt, new Date())
      )
    )
    .returning();
  if (!used) return { ok: false, error: "This link has expired or was already used" };

  const sessionToken = newToken();
  const [member] = await db
    .update(eventMembers)
    .set({ sessionTokenHash: hashToken(sessionToken) }) 
    .where(eq(eventMembers.id, used.memberId))
    .returning();
  if (!member) return { ok: false, error: "Participant not found" };

  await setMemberCookie(member.eventId, sessionToken);
  return { ok: true, message: `Welcome back, ${member.name}`, redirectTo: `/${member.eventId}` };
}


