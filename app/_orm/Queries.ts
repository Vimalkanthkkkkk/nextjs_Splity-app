"use server"
import { db } from "@/app/_orm/db";
import { and, desc, eq, gt, lt, or } from "drizzle-orm";
import { events, history, payments  } from "./schema";
import { getSpendingByCategory, getSpendingByPerson, getSpendingOverTime, getSummary } from "./Insights";

export async function getAllEvent() {
  const result = await db.query.events.findMany();
  return result;
}

export async function getEvent(id:number) {
  const event = await db.query.events.findFirst({
    where : eq(events.id , id), 
    with : {
      creator : {
        columns :{
          username : true
        }
      },
    }
  })
  return event;
}

export async function getAllpayments(id:number){
  const Allpayments = await db.query.payments.findMany({
    where : eq(payments.eventId , id) ,
    with : {
      event : {
        columns : {
          event : true ,
          currency : true
        }
      }
    }
  })

  return Allpayments;
}

export async function getpayment(id:number){
  const payment = await db.query.payments.findFirst({
    where : eq(payments.id , id) ,
    with : {
      event : {
        columns : {
          event : true,
          currency : true,
          participants : true
        }
      }
    }
  })

  return payment;
}

export async function getAllparticipants(eventID : number){
  const participants = await db.query.events.findFirst({
    where : eq(events.id , eventID),
    columns : {
      participants: true,
      event : true
    },
  })
  return participants;
}

const HISTORY_LIMIT = 10;


export async function getHistory(
  eventID: number,
  cursor?: Cursor,
  direction: HistoryDirection = "next"
) {
  if (!cursor) {
    const rows = await db.query.history.findMany({
      where: eq(history.eventID, eventID),
      with: {
        event: true,
        payment: true,
      },
      orderBy: [
        desc(history.createdAt),
        desc(history.id),
      ],
      limit: HISTORY_LIMIT + 1,
    });
    const hasNextPage = rows.length > HISTORY_LIMIT;
    const data = hasNextPage
      ? rows.slice(0, HISTORY_LIMIT)
      : rows;
    const last = data[data.length - 1];
    return {
      data,
      hasPreviousPage: false,
      hasNextPage,
      previousCursor: null,
      nextCursor:
        hasNextPage && last
          ? {
              createdAt: last.createdAt,
              id: last.id,
            }
          : null,
    };
  }
  if (direction === "next") {
    const rows = await db.query.history.findMany({
      where: and(
        eq(history.eventID, eventID),
        or(
          lt(history.createdAt, cursor.createdAt),
          and(
            eq(history.createdAt, cursor.createdAt),
            lt(history.id, cursor.id)
          )
        )
      ),
      with: {
        event: true,
        payment: true,
      },
      orderBy: [
        desc(history.createdAt),
        desc(history.id),
      ],
      limit: HISTORY_LIMIT + 1,
    });

    const hasNextPage = rows.length > HISTORY_LIMIT;
    const data = hasNextPage
      ? rows.slice(0, HISTORY_LIMIT)
      : rows;
    const last = data[data.length - 1];
    return {
      data,
      hasPreviousPage: true,
      hasNextPage,
      previousCursor: data[0]
        ? {
            createdAt: data[0].createdAt,
            id: data[0].id,
          }
        : null,
      nextCursor:
        hasNextPage && last
          ? {
              createdAt: last.createdAt,
              id: last.id,
            }
          : null,
    };
  }

  const rows = await db.query.history.findMany({
    where: and(
      eq(history.eventID, eventID),
      or(
        gt(history.createdAt, cursor.createdAt),
        and(
          eq(history.createdAt, cursor.createdAt),
          gt(history.id, cursor.id)
        )
      )
    ),
    with: {
      event: true,
      payment: true,
    },
    orderBy: [
      history.createdAt,
      history.id,
    ],
    limit: HISTORY_LIMIT + 1,
  });

  const hasPreviousPage = rows.length > HISTORY_LIMIT;
  const data = hasPreviousPage
    ? rows.slice(0, HISTORY_LIMIT)
    : rows;
  data.reverse();
  const first = data[0];
  const last = data[data.length - 1];
  return {
    data,
    hasPreviousPage,
    hasNextPage: true,
    previousCursor:
      hasPreviousPage && first
        ? {
            createdAt: first.createdAt,
            id: first.id,
          }
        : null,
    nextCursor: last
      ? {
          createdAt: last.createdAt,
          id: last.id,
        }
      : null,
  };
}


export async function getEventInsights(eventID: number) {
  const [
    summary,
    categories,
    people,
    timeline,
  ] = await Promise.all([
    getSummary(eventID),
    getSpendingByCategory(eventID),
    getSpendingByPerson(eventID),
    getSpendingOverTime(eventID),
  ]);

  return {
    summary,
    categories,
    people,
    timeline,
  };
}