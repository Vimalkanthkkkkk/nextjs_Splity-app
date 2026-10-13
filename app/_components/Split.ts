export type SplitMode = "equally" | "amount" | "shares" | "percent";
export type SplitEntry = { amt: number; share?: number; percent?: number };

const toCents = (n: number) => Math.round(n * 100);

export function allocate(total: number, weights: Record<string, number>): Record<string, number> {
  const names = Object.keys(weights);
  const sum = names.reduce((s, n) => s + weights[n], 0);
  const raw = names.map((n) => ({ n, v: (weights[n] / sum) * total }));

  const out: Record<string, number> = {};
  let used = 0;
  for (const r of raw) {
    out[r.n] = Math.floor(r.v);
    used += out[r.n];
  }
  const byRemainder = [...raw].sort(
    (a, b) => b.v - Math.floor(b.v) - (a.v - Math.floor(a.v)) || a.n.localeCompare(b.n)
  );
  for (let i = 0; i < total - used; i++) out[byRemainder[i].n] += 1;
  return out;
}

export function computeSplit(opts: { 
    total: number; 
    participants: string[]; 
    mode: SplitMode; 
    inputs: Record<string, number>; 
}): { ok: true; split: Record<string, SplitEntry> } | { ok: false; error: string } {
  const { participants, mode, inputs } = opts;
  const totalCents = toCents(opts.total);
  const picked = participants.filter((p) => Number.isFinite(inputs[p]) && inputs[p] > 0);

  if (picked.length === 0) return { ok: false, error: "Choose at least one person to split with" };
  const split: Record<string, SplitEntry> = {};

  if (mode === "amount") {
    const sum = picked.reduce((s, p) => s + toCents(inputs[p]), 0);
    if (sum !== totalCents) {
      return {
        ok: false,
        error: `The amounts add up to ${(sum / 100).toFixed(2)}, but the total is ${(totalCents / 100).toFixed(2)}`,
      };
    }
    for (const p of picked) split[p] = { amt: toCents(inputs[p]) / 100 };
    return { ok: true, split };
  }

  if (mode === "percent") {
    const sum = picked.reduce((s, p) => s + inputs[p], 0);
    if (Math.abs(sum - 100) > 0.01) {
      return { ok: false, error: `The percentages add up to ${sum}, they must add up to 100` };
    }
  }

  const weights = Object.fromEntries(picked.map((p) => [p, mode === "equally" ? 1 : inputs[p]]));
  const cents = allocate(totalCents, weights);

  for (const p of picked) {
    split[p] = {
      amt: cents[p] / 100,
      ...(mode === "shares" ? { share: inputs[p] } : {}),
      ...(mode === "percent" ? { percent: inputs[p] } : {}),
    };
  }
  return { ok: true, split };
}

export function readSplitInputs(formData: FormData, participants: string[], mode: SplitMode) {
  const inputs: Record<string, number> = {};
  for (const p of participants) {
    if (mode === "equally") {
      inputs[p] = formData.get(`equally-${p}`) !== null ? 1 : 0;
      continue;
    }
    const key = mode === "amount" ? `${p}-amount` : mode === "shares" ? `${p}-share` : `percent-${p}`;
    const n = Number(formData.get(key));
    inputs[p] = Number.isFinite(n) ? n : 0;
  }
  return inputs;
}