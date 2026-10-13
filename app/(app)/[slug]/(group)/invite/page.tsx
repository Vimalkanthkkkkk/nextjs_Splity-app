import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/app/_orm/db";
import { eventMembers } from "@/app/_orm/schema";
import ActionForm from "@/app/_components/ActionForm";
import CopyButton from "@/app/_components/CopyButton";
import { ensureMembers, getActiveInvite, getOwnerAccess, inviteUrl } from "@/app/_components/utils";
import { createInviteAction, revokeInviteAction, resetMemberAction, sendInviteEmailAction } from "./actions";
import Navigation from "@/app/_components/Navigation";
import Actions from "@/app/_components/Actions";
import BackButton from "@/app/_components/Backbutton";

type Props = { params: Promise<{ slug: string }> };

const card = "bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] p-4 flex flex-col gap-3 text-black";
const smallBtn = "rounded-sm bg-gray-300 px-3 py-1 text-sm text-black disabled:opacity-50";

export default async function InvitePage({ params }: Props) {
  const { slug } = await params;
  const eventId = Number(slug);

  const access = await getOwnerAccess(eventId);
  if (!access) redirect(`/${slug}`);
  const { event } = access;

  await ensureMembers(event.id, event.participants);
  const invite = await getActiveInvite(event.id);
  const members = (
    await db.query.eventMembers.findMany({
      where: eq(eventMembers.eventId, event.id),
      orderBy: asc(eventMembers.name),
    })
  ).filter((m) => event.participants.includes(m.name));

  const link = invite ? inviteUrl(invite.token) : null;

  return (
    <>
      <Navigation route={`/${slug}`}>
        <Actions eventName={event.event} slug={slug} />
      </Navigation>

      <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-6 shrink">
        <BackButton route={`/${slug}`} />

        <div className={card}>
          <h2 className="font-semibold">Invite link</h2>
          {link ? (
            <>
              <div className="flex gap-2">
                <input readOnly value={link} className="flex-1 p-2 border border-gray-600 rounded-sm h-9 bg-gray-100" />
                <CopyButton text={link} />
              </div>
              <p className="text-xs text-gray-500">
                Anyone with this link can pick a name that hasn't been taken. It expires after 30 days.
              </p>
              <div className="flex gap-2">
                <ActionForm action={createInviteAction} submitLabel="Make a new link" submitButtonColorString={smallBtn}>
                  <input type="hidden" name="event_id" value={event.id} />
                </ActionForm>
                <ActionForm action={revokeInviteAction} submitLabel="Revoke link" submitButtonColorString={smallBtn}>
                  <input type="hidden" name="event_id" value={event.id} />
                </ActionForm>
              </div>
            </>
          ) : (
            <ActionForm
              action={createInviteAction}
              submitLabel="Create invite link"
              submitButtonColorString="rounded-md bg-cyan-200 px-4 py-2 text-black disabled:opacity-50"
            >
              <input type="hidden" name="event_id" value={event.id} />
            </ActionForm>
          )}
        </div>

        {link && (
          <div className={card}>
            <h2 className="font-semibold">Send by email</h2>
            <ActionForm
              action={sendInviteEmailAction}
              submitLabel="Send"
              savingString="Sending..."
              className="flex gap-2"
              submitButtonColorString={smallBtn}
            >
              <input type="hidden" name="event_id" value={event.id} />
              <input name="email" type="email" required placeholder="friend@example.com"
                     className="flex-1 p-2 border border-gray-600 rounded-sm h-9" />
            </ActionForm>
          </div>
        )}

        <div className={card}>
          <h2 className="font-semibold">Participants</h2>
          <div className="flex flex-col gap-2">
            {members.map((m : any) => (
                <div key={m.id} className="flex items-center justify-between bg-gray-100 rounded-sm p-3">
                    <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-gray-500">
                        {m.isOwner ? "You (organiser)" : m.sessionTokenHash ? "Joined" : "Not joined yet"}
                    </div>
                    </div>

                    {!m.isOwner && m.sessionTokenHash && (
                    <ActionForm 
                        action={resetMemberAction} 
                        submitLabel="Reset" 
                        submitButtonColorString={smallBtn}
                    >
                        <input type="hidden" name="event_id" value={event.id} />
                        <input type="hidden" name="member_id" value={m.id} />
                    </ActionForm>
                    )}
                </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Reset frees a name so its owner can pick it again. Your own name can't be reset.
          </p>
        </div>
      </div>
    </>
  );
}