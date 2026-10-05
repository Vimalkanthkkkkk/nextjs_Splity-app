"use server";

import { db } from "@/app/_orm/db";
import {  events , idempotencyKeys ,payments } from "@/app/_orm/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function createEventAction(formData: FormData) {
    const idempotencyKey = formData.get("idempotencyKey")?.toString();
    if (!idempotencyKey) {
      throw new Error("Missing idempotency key");
    }
    const type = formData.get("type") as "expense" | "transfer" | "income";
    const eventID = Number(formData.get("event_id"));

    if (!Number.isInteger(eventID)) {
        throw new Error("Invalid event ID");
    }

    const howMuch = Number( formData.get("amount"));

    if (!Number.isFinite(howMuch) || howMuch <= 0) {
        throw new Error("Invalid amount");
    }

    const whenString = formData.get("date") as string;
    const when = whenString
        ? new Date(`${whenString}T00:00:00`)
        : new Date();

    const attachmentFile = formData.get("attach");
    let attachmentBuffer: Buffer | null = null;

    if (attachmentFile instanceof File && attachmentFile.size > 0) {
        attachmentBuffer = Buffer.from(await attachmentFile.arrayBuffer());
    }

    const result = await db.transaction(async (tx) => {
        const [claiming] = await tx.insert(idempotencyKeys).values(
            {
                key: idempotencyKey,
                operation: "create_expenses", 
            }
        ).onConflictDoNothing({
            target : idempotencyKeys.key
        }).returning();

        if(!claiming){
            const existing = await tx.query.idempotencyKeys.findFirst({
              where: eq(idempotencyKeys.key, idempotencyKey),
            });
            return {
              duplicate: true,
              id: existing?.resourceId,
            };
        }

        const who = formData.get("participant") as string;
        const whatFor = formData.get("what") as string;
        const category = formData.get("category") as string;
        const notes = formData.get("notes") as string;
        const split_type = formData.get("splitType") as string;
        
        let split_method: string | undefined;
        let whom: string | undefined;
        let json : Record<string, number> = {};

        const participant = await tx.query.events.findFirst({
            where : eq(events.id , eventID) ,
            columns : {
                participants : true ,
                whoCreated : true 
            }
        });

        if (!participant) {
            throw new Error("Event not found");
        }


        const creatorID = participant?.whoCreated;

        if(type !== "transfer"){
            split_method = formData.get("split-method") as string;
        }
        if(type === "transfer"){
            whom = formData.get("whom") as string;
            if (!whom || !participant.participants.includes(whom)) {
                throw new Error("Invalid transfer participant");
            }
            const split_diff = {[whom] : howMuch};
            const [payment] = await tx
                .insert(payments)
                .values({
                    eventId : eventID ,
                    type : "transfer" ,
                    who : creatorID , 
                    whospayment : who,
                    whatFor : whatFor , 
                    howMuch : howMuch ,
                    category : category ,
                    when : when , 
                    notes : notes , 
                    attachment : attachmentBuffer , 
                    isSplitEqually : false ,
                    splitDifferent : split_diff
                }).returning();

            await tx
                .update(idempotencyKeys)
                .set({
                resourceId: payment.id ,
                })
                .where(
                eq(idempotencyKeys.id, claiming.id)
                );
            return {
              duplicate: false,
              id: eventID,
            };

        }

        const total_members = participant?.participants.length ?? 0;

        if (total_members === 0) {
            throw new Error("Event has no participants");
        }

        const amount = howMuch/total_members;

        if(split_method === "Eql"){
            participant?.participants.forEach((p) => {
                json[p] = amount
            });
        }else{
            if(split_type === "equally"){
                participant?.participants.forEach((p) => {
                    const field = formData.get(`equally-${p}`) as string
                    if( field !== null ){
                        json[p] = amount;
                    }
                })
            }else if(split_type === "amount"){
                participant?.participants.forEach((p) => {
                    const field = formData.get(`${p}-amount`) as string
                    if(field !== null){
                        json[p] = amount
                    }
                })
            }else if(split_type === "shares"){
                participant?.participants.forEach((p) => {
                    const field = formData.get(`${p}-share`) as string
                    if(field !== null){
                        json[p] = amount
                    }
                })
            }else if(split_type === "percent"){
                participant?.participants.forEach((p) => {
                    const field = formData.get(`percent-${p}`) as string
                    if(field !== null){
                        json[p] = amount
                    }
                })
            }
        }

        const values: typeof payments.$inferInsert = {
            eventId: eventID,
            type: type,
            who: creatorID,
            whospayment: who,
            whatFor: whatFor,
            howMuch: howMuch,
            category: category,
            when: when,
            notes: notes,
            attachment: attachmentBuffer,
            isSplitEqually: false,
            splitDifferent: json,
        };

        const [payment] = await tx.insert(payments).values(values).returning();
    
        await tx.update(idempotencyKeys)
            .set({
              resourceId: payment.id ,
            }).where(
              eq(idempotencyKeys.id, claiming.id)
            );
            
        return payment;
    })

    redirect(`/${result?.id}`);
}