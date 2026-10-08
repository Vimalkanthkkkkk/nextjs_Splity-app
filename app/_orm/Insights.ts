import { eq, sql } from "drizzle-orm";
import { db } from "@/app/_orm/db";
import { payments } from "@/app/_orm/schema";
import { users } from "@/app/_orm/schema";

export async function getSummary(eventID: number) {
  const summary = await db
    .select({
      totalSpent: sql<number>`
        COALESCE(
          SUM(
            CASE
              WHEN ${payments.type} = 'expense'
              THEN ${payments.howMuch}
              ELSE 0
            END
          ),
          0
        )
      `,

      totalIncome: sql<number>`
        COALESCE(
          SUM(
            CASE
              WHEN ${payments.type} = 'income'
              THEN ${payments.howMuch}
              ELSE 0
            END
          ),
          0
        )
      `,

      expenseCount: sql<number>`
        COUNT(*) FILTER (
          WHERE ${payments.type} = 'expense'
        )
      `,

      averageExpense: sql<number>`
        COALESCE(
          AVG(
            CASE
              WHEN ${payments.type} = 'expense'
              THEN ${payments.howMuch}
            END
          ),
          0
        )
      `,

      largestExpense: sql<number>`
        COALESCE(
          MAX(
            CASE
              WHEN ${payments.type} = 'expense'
              THEN ${payments.howMuch}
            END
          ),
          0
        )`,
    })
    .from(payments)
    .where(eq(payments.eventId, eventID));

  return summary[0];
}

export async function getSpendingByCategory(eventID: number) {
  return db
    .select({
      category: payments.category,

      amount: sql<number>`
        SUM(${payments.howMuch})
      `,
    })
    .from(payments)
    .where(
      sql`
        ${payments.eventId} = ${eventID}
        AND ${payments.type} = 'expense'
      `
    )
    .groupBy(payments.category)
    .orderBy(sql`SUM(${payments.howMuch}) DESC`);
}

export async function getSpendingByPerson(eventID: number) {
  return db
    .select({
      userId: users.id,
      username: users.username,
      amount: sql<number>`
        SUM(${payments.howMuch})
      `,
    }).from(payments)
    .innerJoin(
      users,
      eq(payments.who, users.id)
    )
    .where(
      sql`
        ${payments.eventId} = ${eventID}
        AND ${payments.type} = 'expense'
      `
    )
    .groupBy(
      users.id,
      users.username
    )
    .orderBy(
      sql`SUM(${payments.howMuch}) DESC`
    );
}

export async function getSpendingOverTime(eventID: number) {
  return db
    .select({
      date: sql<string>`
        DATE(${payments.when})
      `,

      amount: sql<number>`
        SUM(${payments.howMuch})
      `,
    })
    .from(payments)
    .where(
      sql`
        ${payments.eventId} = ${eventID}
        AND ${payments.type} = 'expense'
      `
    )
    .groupBy(
      sql`DATE(${payments.when})`
    )
    .orderBy(
      sql`DATE(${payments.when})`
    );
}
