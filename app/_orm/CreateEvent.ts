"use server";

import { db } from "@/app/_orm/db";
import { users, events , idempotencyKeys } from "@/app/_orm/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ActionResult } from "../_types/ActionType";
import { hashToken, newToken, setOwnerCookie } from "@/app/_components/utils"

export async function createEventAction(_prev : ActionResult | null , formData: FormData): Promise<ActionResult> {
    const idempotencyKey =  formData.get("idempotencyKey")?.toString();
    if (!idempotencyKey) {
      throw new Error("Missing idempotency key");
    }
    const result = await db.transaction(async (tx) => {
        const [idempotency] = await tx.insert(idempotencyKeys)
            .values({
              key: idempotencyKey,
              operation: "create_event",
            })
            .onConflictDoNothing({
              target: idempotencyKeys.key,
            })
            .returning();
        if (!idempotency) {
            const existing = await tx.query.idempotencyKeys.findFirst({
              where: eq(idempotencyKeys.key, idempotencyKey),
            });

            return {
              duplicate: true,
              id: existing?.resourceId ?? "",
            };
        }

        const eventName = formData.get("eventName") as string;
        const currency = formData.get("currency") as string;
        const yourName = formData.get("you") as string;
        const yourEmail = formData.get("email") as string;
        const person2 = formData.get("Person2") as string;
        const additionalParticipants = formData.getAll("additionalParticipants") as string[];

        const [creator] = await tx
            .insert(users)
            .values({
              username: yourName,
              email: yourEmail || null,
              profilePicture: null,
            })
            .returning();

        const allParticipants = [
            yourName,
            person2,
            ...additionalParticipants,
        ].filter(Boolean);

        const ownerToken = newToken();

        const [newEvent] = await tx
            .insert(events)
            .values({
                event: eventName,
                whoCreated: creator.id,
                participants: allParticipants,
                currency,
                ownerTokenHash : ownerToken
            })
            .returning();

        await setOwnerCookie(newEvent.id, ownerToken);

        await tx
            .update(idempotencyKeys)
            .set({
              resourceId: newEvent.id,
            })
            .where(
              eq(idempotencyKeys.id, idempotency.id)
            );

        return newEvent;
    });

    if (!result.id) {
        throw new Error("Idempotency record has no resource ID");
    }

    redirect(`/${result.id}`);
}