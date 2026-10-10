"use server";

import { db } from "@/app/_orm/db";
import { users, events , idempotencyKeys } from "@/app/_orm/schema";
import { eq } from "drizzle-orm";
import { ActionResult } from "../_types/ActionType";
import { createOwnerRows, setOwnerCookie } from "@/app/_components/utils"

const clean = (v: FormDataEntryValue | null) =>
  (v?.toString() ?? "").replace(/\s+/g, " ").trim();

export async function createEventAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const idempotencyKey = formData.get("idempotencyKey")?.toString();
  if (!idempotencyKey) return { ok: false, error: "Missing idempotency key" };

  const eventName = clean(formData.get("eventName"));
  const currency = clean(formData.get("currency"));
  const yourName = clean(formData.get("you"));
  const yourEmail = clean(formData.get("email")).toLowerCase();
  const person2 = clean(formData.get("Person2"));
  const additionalParticipants = formData.getAll("additionalParticipants").map(clean);

  if (!eventName) return { ok: false, error: "Enter an event name" };
  if (!yourName) return { ok: false, error: "Enter your name" };
  if (!person2) return { ok: false, error: "Enter at least one other participant" };

  const allParticipants = [yourName, person2, ...additionalParticipants].filter(Boolean);

  const seen = new Set<string>();
  for (const name of allParticipants) {
    const key = name.toLowerCase();
    if (seen.has(key)) {
      return { ok: false, error: `"${name}" is used more than once. Each name must be different.` };
    }
    seen.add(key);
  }

  try {
    const result = await db.transaction(async (tx) => {
      const [idempotency] = await tx
        .insert(idempotencyKeys)
        .values({ key: idempotencyKey, operation: "create_event" })
        .onConflictDoNothing({ target: idempotencyKeys.key })
        .returning();

      if (!idempotency) {
        const existing = await tx.query.idempotencyKeys.findFirst({
          where: eq(idempotencyKeys.key, idempotencyKey),
        });
        return { duplicate: true as const, eventId: existing?.resourceId ?? null };
      }

      const [creator] = await tx
        .insert(users)
        .values({
          username: yourName,
          email: yourEmail || null,
          profilePicture: null,
        })
        .returning();

      const [newEvent] = await tx
        .insert(events)
        .values({
          event: eventName,
          whoCreated: creator.id,
          participants: allParticipants,
          currency,
        })
        .returning();

      const ownerToken = await createOwnerRows(tx, newEvent, creator);

      await tx
        .update(idempotencyKeys)
        .set({ resourceId: newEvent.id })
        .where(eq(idempotencyKeys.id, idempotency.id));

      return { duplicate: false as const, eventId: newEvent.id, ownerToken };
    });

    if (!result.eventId) {
      return { ok: false, error: "Your request is still being processed. Please wait a moment." };
    }

    if (!result.duplicate) {
      await setOwnerCookie(result.eventId, result.ownerToken);
    }

    return { ok: true, message: "Event created", redirectTo: `/${result.eventId}` };
  } catch (error) {
    console.error("createEventAction failed:", error);
    return { ok: false, error: "Couldn't create the event. Please try again." };
  }
}