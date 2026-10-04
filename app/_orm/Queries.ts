"use server"
import { db } from "@/app/_orm/db";
import { eq } from "drizzle-orm";
import { events  } from "./schema";

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


export async function getAllparticipants(eventID : number){
  const participants = await db.query.events.findFirst({
    where : eq(events.id , eventID),
    columns : {
      participants: true
    }
  })
  return participants;
}