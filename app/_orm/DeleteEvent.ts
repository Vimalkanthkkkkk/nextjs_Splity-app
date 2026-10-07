"use server";

import { db } from "@/app/_orm/db";
import { history, events , idempotencyKeys } from "@/app/_orm/schema";
import { eq } from "drizzle-orm";
import { ActionResult } from "../_types/ActionType";

export async function DeleteEventAction(_prev : ActionResult | null , formData: FormData): Promise<ActionResult> {
    const idempotencyKey =  formData.get("idempotencyKey")?.toString();
    if (!idempotencyKey) {
        return {
            ok: false,
            error : "Please retry one more time"
        };
    }

    const eventID = Number(formData.get("event_id"));
    if (!Number.isInteger(eventID)) {
        return {
            ok : false ,
            error : "Please retry one more time"
        };
    }

    const result: ActionResult = await db.transaction(async (tx): Promise<ActionResult> => {
        const [idempotency] = await tx.insert(idempotencyKeys)
            .values({
              key: idempotencyKey,
              operation: "edit_event",
            })
            .onConflictDoNothing({
              target: idempotencyKeys.key,
            })
            .returning();
        if (!idempotency) {
            return {
                ok: true,
            };
        }

        const Delete_event = formData.get("delete_event") as string;
        if(Delete_event === "true"){
            const eventName = formData.get("old_event_name") as string;
            await tx.delete(events).where(eq(events.id , eventID));
            await tx.update(idempotencyKeys).set({resourceId : eventID}).where(eq(idempotencyKeys.id , idempotency.id))
            await tx.insert(history).values({
                eventID : eventID,
                action : "deleted"
            })
            return {
                ok: true,
                message: `Deleted the ${eventName}`,
                redirectTo : `/${eventID}`
            };
        };

        return {
            ok : true
        }

    });
    return result;
}