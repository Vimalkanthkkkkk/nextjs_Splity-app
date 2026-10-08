"use server"
import { db } from "@/app/_orm/db";
import { eq } from "drizzle-orm";
import { events, payments  } from "./schema";

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

