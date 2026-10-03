"use server";

import { db } from "@/app/_orm/db";
import { users, events } from "@/app/_orm/tables";
import { redirect } from "next/navigation";

export async function createEventAction(formData: FormData) {
  const eventName = formData.get("eventName") as string;
  const currency  = formData.get("currency") as string;
  const yourName  = formData.get("you") as string;
  const yourEmail = formData.get("email") as string;
  const person2   = formData.get("Person2") as string;
  const additionalParticipants = formData.getAll("additionalParticipants") as string[];

  const imageFile = formData.get("eventImage") as File;
  let imageBuffer: Buffer | null = null;
  if (imageFile && imageFile.size > 0) {
    const arrayBuffer = await imageFile.arrayBuffer();
    imageBuffer = Buffer.from(arrayBuffer);
  }

  const [creator] = await db.insert(users).values({
    username: yourName ,
    email: yourEmail , 
    profilePicture: null,
  }).returning();

  const allParticipants = [
    yourName,
    person2,
    ...additionalParticipants
  ].filter(Boolean); 

  const [newEvent] = await db.insert(events).values({
    event: eventName,
    whoCreated: creator.id,
    participants: allParticipants,
    eventImage: imageBuffer,
    currency: currency,
  }).returning();

  redirect(`/${newEvent.id}/entries`);
}