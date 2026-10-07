"use server";

import { db } from "@/app/_orm/db";
import { events , history, idempotencyKeys } from "@/app/_orm/schema";
import { eq } from "drizzle-orm";
import { ActionResult } from "../_types/ActionType";

export async function EventEditAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
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
            const eventName = formData.get("old_event_name") as string;
            return {
                ok: true,
                message: `Updated ${eventName}`
            };
        }

        const removeAttachment = formData.get("removeAttachment") as string;
        let isAttachremoved : boolean = false;
        if(removeAttachment === "true"){
            isAttachremoved = true;
        }   

        const attachment = formData.get("attach");
        let attachmentBuffer: Buffer | null = null;
        if (attachment instanceof File && attachment.size > 0) {
            attachmentBuffer = Buffer.from(await attachment.arrayBuffer());
        }

        const NeweventName = formData.get("eventName") as string;
        const currency     = formData.get("currency") as string;

        await tx.update(events)
            .set({
                event : NeweventName ,
                currency : currency ,
                eventImage : isAttachremoved ? null : attachmentBuffer
            }).where(eq(events.id , eventID));

        await tx.update(idempotencyKeys)
            .set({
                resourceId : eventID,
            }).where(eq(idempotencyKeys.id , idempotency.id));
        
        await tx.insert(history).values({
            eventID : eventID ,
            action : "updated" ,
        })

        return {
            ok: true,
            message: `Updated ${NeweventName}`,
            redirectTo : `/${eventID}`
        };
    });

    return result;
}