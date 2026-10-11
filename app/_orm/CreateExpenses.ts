"use server";

import { db } from "@/app/_orm/db";
import { history , idempotencyKeys , payments } from "@/app/_orm/schema";
import { eq } from "drizzle-orm";
import { ActionResult } from "../_types/ActionType";
import { getEventAccess } from "@/app/_components/utils";
import { computeSplit, type SplitEntry, type SplitMode } from "@/app/_components/Split";

const TYPES = ["expense", "transfer", "income"] as const;
type PaymentType = (typeof TYPES)[number];

const SPLIT_LABEL = {
  equally: "Equally",
  percent: "percentages",
  amount: "amounts",
  shares: "shares",
} as const;

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

const clean = (v: FormDataEntryValue | null) => (v?.toString() ?? "").trim();

function readInputs(formData: FormData, participants: string[], mode: SplitMode) {
  const inputs: Record<string, number> = {};
  for (const p of participants) {
    let value = 0;
    if (mode === "equally") {
      value = formData.get(`equally-${p}`) !== null ? 1 : 0;
    } else if (mode === "amount") {
      value = Number(formData.get(`${p}-amount`) || 0);
    } else if (mode === "shares") {
      value = formData.get(`share-${p}`) !== null ? Number(formData.get(`${p}-share`) || 0) : 0;
    } else {
      value = formData.get(`share-${p}`) !== null ? Number(formData.get(`percent-${p}`) || 0) : 0;
    }
    inputs[p] = Number.isFinite(value) && value > 0 ? value : 0;
  }
  return inputs;
}

export async function createExpenseAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const idempotencyKey = clean(formData.get("idempotencyKey"));
  if (!idempotencyKey) return { ok: false, error: "Please retry one more time" };

  const type = clean(formData.get("type")) as PaymentType;
  if (!TYPES.includes(type)) return { ok: false, error: "Invalid type" };

  const eventID = Number(formData.get("event_id"));
  if (!Number.isInteger(eventID)) return { ok: false, error: "Please retry one more time" };

  const access = await getEventAccess(eventID);
  if (!access) return { ok: false, error: "You don't have access to this event" };
  const { event } = access;

  const rawAmount = Number(formData.get("amount"));
  if (!Number.isFinite(rawAmount) || rawAmount <= 0) return { ok: false, error: "Invalid amount" };
  const howMuch = Math.round(rawAmount * 100) / 100;
  if (howMuch <= 0) return { ok: false, error: "Invalid amount" };
  if (howMuch > 99_999_999.99) return { ok: false, error: "That amount is too large" };

  const who = clean(formData.get("participant"));
  if (!event.participants.includes(who)) return { ok: false, error: "Choose who paid" };

  const whatFor = clean(formData.get("what"));
  if (!whatFor) return { ok: false, error: "Enter what this was for" };

  const category = clean(formData.get("category")) || null;
  const notes = clean(formData.get("notes")) || null;

  const whenString = clean(formData.get("date"));
  const when = whenString ? new Date(`${whenString}T00:00:00`) : new Date();
  if (Number.isNaN(when.getTime())) return { ok: false, error: "Invalid date" };

  const attachmentFile = formData.get("attach");
  let attachmentBuffer: Buffer | null = null;
  if (attachmentFile instanceof File && attachmentFile.size > 0) {
    if (attachmentFile.size > MAX_ATTACHMENT_BYTES) {
      return { ok: false, error: "The attachment must be smaller than 5 MB" };
    }
    attachmentBuffer = Buffer.from(await attachmentFile.arrayBuffer());
  }

  let splitDifferent: Record<string, SplitEntry>;
  let splitMethod: (typeof SPLIT_LABEL)[SplitMode] | undefined;
  let isSplitEqually = false;

  if (type === "transfer") {
    const whom = clean(formData.get("whom"));
    if (!whom || !event.participants.includes(whom)) {
      return { ok: false, error: "Invalid participant" };
    }
    if (whom === who) return { ok: false, error: "You can't transfer money to the same person" };
    splitDifferent = { [whom]: { amt: howMuch } };
  } else {
    const isEql = clean(formData.get("split-method")) === "Eql";
    const mode = (isEql ? "equally" : clean(formData.get("splitType"))) as SplitMode;
    if (!Object.hasOwn(SPLIT_LABEL, mode)) {
      return { ok: false, error: "Choose how to split this" };
    }

    const inputs = isEql
      ? Object.fromEntries(event.participants.map((p) => [p, 1])) 
      : readInputs(formData, event.participants, mode);

    const result = computeSplit({ total: howMuch, participants: event.participants, mode, inputs });
    if (!result.ok) return { ok: false, error: result.error };

    splitDifferent = result.split;
    splitMethod = SPLIT_LABEL[mode];
    isSplitEqually = mode === "equally";
  }

  try {
    return await db.transaction(async (tx): Promise<ActionResult> => {
      const [claiming] = await tx
        .insert(idempotencyKeys)
        .values({ key: idempotencyKey, operation: "create_expenses" })
        .onConflictDoNothing({ target: idempotencyKeys.key })
        .returning();

      if (!claiming) {
        const existing = await tx.query.idempotencyKeys.findFirst({
          where: eq(idempotencyKeys.key, idempotencyKey),
        });
        return {
          ok: true,
          message: `Created ${type}`,
          redirectTo: existing?.resourceId
            ? `/${eventID}/entries/${existing.resourceId}`
            : `/${eventID}/entries`,
        };
      }

      const values: typeof payments.$inferInsert = {
        eventId: eventID,
        type,
        who: event.whoCreated,
        whospayment: who,
        whatFor,
        howMuch,
        category,
        when,
        notes,
        attachment: attachmentBuffer,
        isSplitEqually,
        splitMethod, 
        splitDifferent,
      };

      const [payment] = await tx.insert(payments).values(values).returning();

      await tx
        .update(idempotencyKeys)
        .set({ resourceId: payment.id })
        .where(eq(idempotencyKeys.id, claiming.id));

      await tx.insert(history).values({
        eventID,
        paymentID: payment.id,
        action: "created",
      });

      return {
        ok: true,
        message: `Created ${type}`,
        redirectTo: `/${eventID}/entries/${payment.id}`,
      };
    });
  } catch (error) {
    console.error("createExpenseAction failed:", error);
    return { ok: false, error: "Couldn't save this. Please try again." };
  }
}