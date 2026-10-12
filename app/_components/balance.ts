import { eq } from "drizzle-orm";
import { db } from "../_orm/db";
import { payments, settlements } from "@/app/_orm/schema";

type Executor = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];
type PaymentRow = typeof payments.$inferSelect;

export type Transfer = { from: string; to: string; cents: number };

const toCents = (n: number) => Math.round(n * 100);

function splitEvenly(totalCents: number, names: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  if (names.length === 0) return out;
  const base = Math.floor(totalCents / names.length);
  let rest = totalCents - base * names.length;
  for (const n of names) {
    out[n] = base + (rest > 0 ? 1 : 0);
    if (rest > 0) rest--;
  }
  return out;
}

function sharesOf(p: PaymentRow, participants: string[]): Record<string, number> {
  const total = toCents(p.howMuch);
  const stored = p.splitDifferent;
  let shares: Record<string, number> = {};

  if (stored && Object.keys(stored).length > 0) {
    for (const [name, raw] of Object.entries(stored)) {
      const v = raw as unknown as number | { amt?: number }; 
      shares[name] = toCents(typeof v === "number" ? v : v?.amt ?? 0);
    }
  } else {
    shares = splitEvenly(total, participants);
  }

  const names = Object.keys(shares);
  const diff = total - names.reduce((s, n) => s + shares[n], 0);
  if (names.length > 0 && diff !== 0) shares[names[0]] += diff;
  return shares;
}


export function minimizeTransfers(net: Record<string, number>): Transfer[] {
  const creditors: { name: string; cents: number }[] = [];
  const debtors: { name: string; cents: number }[] = [];

  for (const [name, cents] of Object.entries(net)) {
    if (cents > 0) creditors.push({ name, cents });
    else if (cents < 0) debtors.push({ name, cents: -cents });
  }
  const bySize = (a: { name: string; cents: number }, b: { name: string; cents: number }) =>
    b.cents - a.cents || a.name.localeCompare(b.name);
  creditors.sort(bySize);
  debtors.sort(bySize);

  const transfers: Transfer[] = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const cents = Math.min(debtors[i].cents, creditors[j].cents);
    transfers.push({ from: debtors[i].name, to: creditors[j].name, cents });
    debtors[i].cents -= cents;
    creditors[j].cents -= cents;
    if (debtors[i].cents === 0) i++;
    if (creditors[j].cents === 0) j++;
  }
  return transfers;
}

export async function getEventBalances(eventId: number, participants: string[], executor: Executor = db) {
  const rows = await executor.select().from(payments).where(eq(payments.eventId, eventId));
  const settled = await executor.select().from(settlements).where(eq(settlements.eventId, eventId));

  const net: Record<string, number> = {};   
  const paid: Record<string, number> = {};  
  const owed: Record<string, number> = {};  
  let groupCost = 0;
  let expenseCount = 0;

  const add = (m: Record<string, number>, k: string, c: number) => { m[k] = (m[k] ?? 0) + c; };

  for (const p of rows) {
    const total = toCents(p.howMuch);
    const shares = sharesOf(p, participants);
    const sign = p.type === "income" ? -1 : 1;

    add(net, p.whospayment, sign * total);
    for (const [name, c] of Object.entries(shares)) add(net, name, -sign * c);

    if (p.type === "expense") {
      expenseCount++;
      groupCost += total;
      add(paid, p.whospayment, total);
      for (const [name, c] of Object.entries(shares)) add(owed, name, c);
    }
  }

  for (const s of settled) {
    add(net, s.fromName, toCents(s.amount));
    add(net, s.toName, -toCents(s.amount));
  }

  return { net, paid, owed, groupCost, expenseCount, transfers: minimizeTransfers(net) };
}