import "server-only";

import "server-only";
import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "../_orm/db"
import { eventInvites, eventMembers, events } from "../_orm/schema";

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