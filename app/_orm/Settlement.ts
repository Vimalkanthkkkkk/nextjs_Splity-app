import { revalidatePath } from "next/cache";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "./db";
import { history, payments, settlements } from "@/app/_orm/schema";
import type { ActionResult } from "@/app/_types/ActionType"
import { getEventBalances } from "@/app/_components/balance"
import { getEventAccess } from "@/app/_components/utils";

class UserError extends Error {}

export async function markSettlementAction( _prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  "use server";
  const eventId = Number(formData.get("event_id"));
  const from = formData.get("from")?.toString() ?? "";
  const to = formData.get("to")?.toString() ?? "";
  const cents = Number(formData.get("cents"));

  if (!Number.isInteger(eventId) || !from || !to || !Number.isInteger(cents) || cents <= 0) {
    return { ok: false, error: "Invalid settlement" };
  }

  const access = await getEventAccess(eventId);
  if (!access) return { ok: false, error: "You don't have access to this event" };

  const me = access.member?.name;
  if (access.role !== "owner" && me !== from && me !== to) {
    return { ok: false, error: "Only the two people involved, or the organiser, can mark this" };
  }

  try {
    await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(${eventId}::bigint)`);
      const { transfers } = await getEventBalances(eventId, access.event.participants, tx);
      const match = transfers.find((t) => t.from === from && t.to === to && t.cents === cents);
      if (!match) throw new UserError("These balances just changed. Refresh the page and try again.");

      const actor = me ?? "Organiser";

      const [s] = await tx
        .insert(settlements)
        .values({
          eventId,
          fromName: from,
          toName: to,
          amount: cents / 100,
          markedBy: actor,
        })
        .returning();

      await tx.insert(history).values({
        eventID: eventId,
        action: "Settlement added",
        settlementId: s.id,
        actorName : actor
      });

    });
  } catch (error) {
    if (error instanceof UserError) return { ok: false, error: error.message };
    console.error("markSettlementAction failed:", error);
    return { ok: false, error: "Couldn't mark the settlement. Please try again." };
  }

  revalidatePath(`/${eventId}`);
  return { ok: true, message: "Settlement marked" };
}


export async function undoSettlementAction( _prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  "use server";
  const eventId = Number(formData.get("event_id"));
  const settlementId = Number(formData.get("settlement_id"));
  if (!Number.isInteger(eventId) || !Number.isInteger(settlementId)) {
    return { ok: false, error: "Invalid settlement" };
  }

  const access = await getEventAccess(eventId);
  if (!access) return { ok: false, error: "You don't have access to this event" };
  const me = access.member?.name ?? null;

  try {
    await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(${eventId}::bigint)`);
      const existing = await tx.query.settlements.findFirst({
        where: and(eq(settlements.id, settlementId), eq(settlements.eventId, eventId)),
      });
      if (!existing) throw new UserError("Settlement not found");
      if (existing.undoneAt) throw new UserError("This settlement was already undone");
      const allowed = access.role === "owner" || me === existing.fromName || me === existing.toName;
      if (!allowed) throw new UserError("Only the two people involved, or the organiser, can undo this");
      const actor = me ?? "Organiser";
      await tx
        .update(settlements)
        .set({ undoneAt: new Date(), undoneBy : actor })
        .where(and(eq(settlements.id, settlementId), isNull(settlements.undoneAt)));

      await tx.insert(history).values({
        eventID: eventId,
        action: "Settlement deleted",
        settlementId,
        actorName: actor,
      });
    });
  } catch (error) {
    if (error instanceof UserError) return { ok: false, error: error.message };
    console.error("undoSettlementAction failed:", error);
    return { ok: false, error: "Couldn't undo the settlement. Please try again." };
  }

  revalidatePath(`/${eventId}`);
  revalidatePath(`/${eventId}/entries`);
  revalidatePath(`/${eventId}/history`);
  return { ok: true, message: "Settlement deleted", redirectTo: `/${eventId}` };
}