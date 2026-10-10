"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/app/_orm/db";
import { eventInvites, eventMembers } from "@/app/_orm/schema";
import type { ActionResult } from "@/app/_types/ActionType";
import { sendEmail , escapeHtml } from "@/app/_components/utils";
import {
  ensureMembers, getActiveInvite, getOwnerAccess, hashToken,
  inviteUrl, newToken, setMemberCookie,
} from "@/app/_components/utils"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOT_OWNER: ActionResult = { ok: false, error: "Only the event creator can do that" };

export async function createInviteAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const eventId = Number(formData.get("event_id"));
  const access = await getOwnerAccess(eventId);
  if (!access) return NOT_OWNER;

  await ensureMembers(eventId, access.event.participants);

  await db.transaction(async (tx) => {
    await tx
      .update(eventInvites)
      .set({ revokedAt: new Date() })
      .where(and(eq(eventInvites.eventId, eventId), isNull(eventInvites.revokedAt)));

    await tx.insert(eventInvites).values({
      eventId,
      token: newToken(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });
  });

  revalidatePath(`/${eventId}/invite`);
  return { ok: true, message: "New invite link created" };
}

export async function revokeInviteAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const eventId = Number(formData.get("event_id"));
  if (!(await getOwnerAccess(eventId))) return NOT_OWNER;

  await db
    .update(eventInvites)
    .set({ revokedAt: new Date() })
    .where(and(eq(eventInvites.eventId, eventId), isNull(eventInvites.revokedAt)));

  revalidatePath(`/${eventId}/invite`);
  return { ok: true, message: "Invite link revoked" };
}

export async function resetMemberAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const eventId = Number(formData.get("event_id"));
  const memberId = Number(formData.get("member_id"));
  if (!(await getOwnerAccess(eventId))) return NOT_OWNER;

  await db
    .update(eventMembers)
    .set({ sessionTokenHash: null, claimedAt: null, email: null })
    .where(
        and(
            eq(eventMembers.id, memberId),
            eq(eventMembers.eventId, eventId),
            eq(eventMembers.isOwner, false)
        )
    )

  revalidatePath(`/${eventId}/invite`);
  return { ok: true, message: "Name released. They can pick it again from the invite link." };
}

export async function sendInviteEmailAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const eventId = Number(formData.get("event_id"));
  const to = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const access = await getOwnerAccess(eventId);
  if (!access) return NOT_OWNER;
  if (!EMAIL_RE.test(to)) return { ok: false, error: "Enter a valid email" };

  const invite = await getActiveInvite(eventId);
  if (!invite) return { ok: false, error: "Create an invite link first" };

  try {
    await sendEmail({
      to,
      subject: `You're invited to "${access.event.event}"`,
      html: `
        <p>You've been invited to <b>${escapeHtml(access.event.event)}</b>.</p>
        <p><a href="${inviteUrl(invite.token)}">Open the invite</a> and pick your name.</p>`,
    });
  } catch (err) {
    console.error("invite email failed:", err);
    return { ok: false, error: "Couldn't send the email. Try again later." };
  }
  return { ok: true, message: `Invite sent to ${to}` };
}