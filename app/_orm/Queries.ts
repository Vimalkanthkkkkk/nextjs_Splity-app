import { db } from "@/app/_orm/db";

export async function getAllEvent() {
  const result = await db.query.events.findMany();
  return result;
}
