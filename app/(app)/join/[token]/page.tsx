"use server"

import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/app/_orm/db";
import { events , eventMembers} from "@/app/_orm/schema";
import ActionForm from "@/app/_components/ActionForm";
import { claimMemberAction , requestRecoveryAction} from "@/app/_components/utils";
import { ensureMembers , getCurrentMember, getValidInvite} from "@/app/_components/utils";


export default async function JoinPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const invite = await getValidInvite(token);
  if (!invite) {
    return (
      <div className="w-full max-w-md mx-auto p-6 text-black">
        <h1 className="text-lg font-semibold mb-2">This invite link isn't valid</h1>
        <p className="text-sm text-gray-600">
          It may have expired or been replaced. Ask the person who invited you for a new one.
        </p>
      </div>
    );
  }

  const event = await db.query.events.findFirst({ where: eq(events.id, invite.eventId) });
  if (!event) notFound();

  if (await getCurrentMember(event.id)) redirect(`/${event.id}`);

  await ensureMembers(event.id, event.participants);
  const members = await db.query.eventMembers.findMany({
    where: eq(eventMembers.eventId, event.id),
  });
  
  const free = members.filter(
    (m) => !m.sessionTokenHash && !m.isOwner && event.participants.includes(m.name)
  );

  return (
    <div className="h-full w-full bg-linear-to-b from-[#ffffff] to-[#e9e7e7]  mx-auto p-4 flex flex-1 flex-col gap-6 text-black">
      <div className="bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] p-4 mx-auto flex flex-col gap-4">
        <h1 className="text-lg font-semibold">Join "{event.event}"</h1>

        {free.length === 0 ? (
          <p className="text-sm text-gray-600">
            Every name is already taken. If you're one of them, use the recovery form below, or
            ask the organiser to reset your name.
          </p>
        ) : (
          <ActionForm
            action={claimMemberAction}
            submitLabel="Join event"
            savingString="Joining..."
            className="flex flex-col gap-3"
            submitButtonColorString="bg-cyan-200"
            needCancelButton
            cancelString="Back"
          >
            <input type="hidden" name="token" value={token} />
            <p className="text-sm text-gray-600">Who are you?</p>
            <div className="flex flex-col gap-2">
              {free.map((m) => (
                <label key={m.id} className="flex items-center gap-2 bg-gray-100 rounded-sm p-3 cursor-pointer">
                  <input type="radio" name="member_id" value={m.id} required />
                  {m.name}
                </label>
              ))}
            </div>
            <label htmlFor="email" className="text-sm text-gray-600">
              Email (optional, lets you get back in if you switch phones)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="p-2 border border-gray-600 rounded-sm h-9"
            />
          </ActionForm>
        )}
      </div>

      <div className="bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] p-4 mx-auto flex flex-col gap-3">
        <h2 className="font-medium">Already joined before?</h2>
        <p className="text-sm text-gray-600">
          Enter the email you used and we'll send you a sign-in link.
        </p>
        <ActionForm
          action={requestRecoveryAction}
          submitLabel="Send link"
          savingString="Sending..."
          className="flex flex-col gap-3"
          submitButtonColorString=" bg-gray-300 "
        >
          <input type="hidden" name="token" value={token} />
          <input name="email" type="email" required className="p-2 border border-gray-600 rounded-sm h-9" />
        </ActionForm>
      </div>
    </div>
  );
}