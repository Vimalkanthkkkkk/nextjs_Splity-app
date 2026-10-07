export type ActionResult =
  | { ok: true; redirectTo?: string; message?: string }
  | { ok: false; error: string };