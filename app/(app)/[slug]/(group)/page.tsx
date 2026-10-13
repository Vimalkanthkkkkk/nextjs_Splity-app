import Actions from "@/app/_components/Actions";
import { getComments, getEvent } from "@/app/_orm/Queries";
import { Props } from "@/app/_types/Props";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navigation from "@/app/_components/Navigation";
import ActionForm from "@/app/_components/ActionForm";
import { getEventBalances } from "@/app/_components/balance";
import { requireEventAccess } from "@/app/_components/utils";
import { markSettlementAction } from "@/app/_orm/Settlement";
import { addCommentAction } from "@/app/_components/utils";
import { currencySymbols } from "@/app/_components/CurrencySymbols";

export default async function EventsMainPage({params}: Props){
    const { slug } = await params;
    const eventId = Number(slug);
    const access = await requireEventAccess(eventId);   
    const event = await getEvent(eventId);

    if (!event) redirect("/");
    const eventComments = await getComments(eventId);
    const me = access.member?.name ?? null;
    const currencyCode = event.currency as keyof typeof currencySymbols;
    const currencySymbol = currencySymbols[currencyCode] ;
    const data = await getEventBalances(event.id, event.participants);
    const fmt = (cents: number) => `${currencySymbol} ${(cents / 100).toFixed(2)}`;
    const myNet = me ? data.net[me] ?? 0 : 0;
    
    return(
        <>        
            <Navigation route={`/`} >
                <Actions eventName={event.event} slug={slug}  />
            </Navigation>
            <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-4 shrink">
                {
                    event.eventImage ?
                    <div className="w-full rounded-4xl h-50 self-center relative ">
                        <Image width={0} height={0} sizes="100vw" style={{ width: "100%", height: '100%' , borderRadius: 20 , objectFit: "fill" }} className="items-start" preload loading="eager" src="/split.jpeg" alt="Splity logo" />
                    </div> 
                    :
                    <></>
                }
                <div className="content-center pl-2 w-full h-10 self-center">
                    <span className="text-black">Hi {me ?? event.creator.username}</span>
                </div>
                <Link href={`${slug}/invite`} className="bg-gray-400 wrap-anywhere rounded-sm border-2 text-black w-full p-2 self-center content-center pl-2">
                    Invite your friends to participate in this Event
                </Link>
                <div className="bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)]  gap-2 flex flex-col w-full h-fit self-center p-4">
                    <div className="flex flex-1 text-black items-center justify-between">
                        <span>Overview</span>
                        <span>{data.expenseCount} Expenses</span>
                    </div>
                    <span className="text-black">For families or couples who share their balance, set up default shares.</span>
                    <hr className="w-full bg-gray-950 h-0.5"/>  
                    <div className="text-black">
                        <div className="flex flex-1 items-center justify-between">
                            <span>This event cost the group:</span>
                            <span>{fmt(data.groupCost)}</span>
                        </div>
                        <div className="flex flex-1 items-center justify-between">
                            <span>It cost you:</span>
                            <span>{fmt(me ? data.owed[me] ?? 0 : 0)}</span>
                        </div>
                        <div className="flex flex-1 items-center justify-between">
                            <span>You've paid:</span>
                            <span>{fmt(me ? data.paid[me] ?? 0 : 0)}</span>
                        </div>
                        <div className="flex flex-1 items-center justify-between">
                            <span>{myNet < 0 ? "You owe:" : "You are owed:"}</span>
                            <span>{fmt(Math.abs(myNet))}</span>
                        </div>
                    </div>
                    <div className="text-black flex flex-1 flex-row self-end">
                        <Link href={`/${slug}/entries`} className="mr-2 p-1 rounded-sm bg-gray-200">View Expenses</Link>
                        <Link href={`/${slug}/new/entries/expense`} className="bg-gray-400 rounded-sm p-1">Add Expenses</Link>
                        <Link href={`/${slug}/new/entries`} className="flex">
                            <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" 
                                className="h-8 w-8" preserveAspectRatio="xMidYMid meet" fill="#000000">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                                <g id="SVGRepo_tracerCarrier"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <g id="SVGRepo_iconCarrier">
                                    <path fill="#CCD6DD" d="M32 36l-2-2l-2 2l-2-2l-2 2l-2-2l-2 2l-2-2l-2 2l-2-2l-2 2l-2-2l-2 2l-2-2l-2 2V0l2 2l1.958-2L10 2l2.042-2L14 2l2.042-2L18 2l2.083-2L22 2l2.125-2L26 2l1.958-2L30 2l2-2z">
                                    </path>
                                    <path fill="#99AAB5" d="M19 17H9c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm8 0h-4c-.55 0-1-.45-1-1s.45-1 1-1h4c.55 0 1 .45 1 1s-.45 1-1 1zm-8 4H9c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm8 0h-4c-.55 0-1-.45-1-1s.45-1 1-1h4c.55 0 1 .45 1 1s-.45 1-1 1zm0 6H9c-.55 0-1-.45-1-1s.45-1 1-1h18c.55 0 1 .45 1 1s-.45 1-1 1zm0 4h-4c-.55 0-1-.45-1-1s.45-1 1-1h4c.55 0 1 .45 1 1s-.45 1-1 1z">
                                    </path>
                                    <circle fill="#99AAB5" cx="18" cy="8" r="4"></circle>
                                </g>
                            </svg>
                        </Link>
                    </div>
                </div>
                <div className="bg-white shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] text-black rounded-sm gap-2 flex flex-col w-full h-fit self-center p-4">
                    <div className="flex flex-1 items-center justify-between">
                        <span>How to settle all debts</span>
                        <span>?</span>
                    </div>

                    {data.transfers.length === 0 ? (
                        <span className="text-sm text-gray-600">
                            {
                                data.expenseCount === 0 ? 
                                "No expenses yet." : 
                                "All settled up. Nobody owes anything."
                            }
                        </span>
                    ) : (
                        <div className="flex flex-col gap-2">
                        {data.transfers.map((t) => {
                            const canMark = access.role === "owner" || me === t.from || me === t.to;
                            return (
                            <div
                                key={`${t.from}-${t.to}`}
                                className="flex flex-wrap items-center justify-between gap-2 bg-gray-100 rounded-sm p-3"
                            >
                                <span>
                                <b>{t.from}</b> pays <b>{t.to}</b>
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{fmt(t.cents)}</span>
                                    {canMark && (
                                        <ActionForm
                                        action={markSettlementAction}
                                        submitLabel="Mark this settlement"
                                        savingString="Saving..."
                                        successMessage="Settlement marked"
                                        className="flex"
                                        submitButtonColorString="bg-gray-300"
                                        >
                                            <input type="hidden" name="event_id" value={event.id} />
                                            <input type="hidden" name="from" value={t.from} />
                                            <input type="hidden" name="to" value={t.to} />
                                            <input type="hidden" name="cents" value={t.cents} />
                                        </ActionForm>
                                    )}
                                </div>
                            </div>
                            );
                        })}
                        </div>
                    )}
                </div>
                <div className="bg-white shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] text-black rounded-sm gap-2 flex flex-1 flex-col w-full h-fit self-center p-4">
                    <div className="flex flex-1 items-center justify-between">
                        <span className="">Who has seen this Event?</span>
                    </div>
                    {
                        event.participants.map( (p , idx)  => {
                            return (
                                <span key={idx} >{p}</span>
                            )
                        })
                    }
                    <button type="submit" className="p-1 w-fit self-end rounded-sm bg-gray-200">View Expenses</button>
                </div>
                <div className="bg-white shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] text-black rounded-sm gap-3 flex flex-col w-full h-fit self-center p-4">
                    <h1 className="font-medium">Comments</h1>

                    <ActionForm
                        action={addCommentAction}
                        successMessage="Comment posted"
                        submitLabel="Send"
                        savingString="Sending..."
                        className="flex flex-col gap-2"
                        submitButtonColorString="bg-gray-200"
                    >
                        <input type="hidden" name="event_id" value={event.id} />
                        <label htmlFor="comment" className="sr-only">Write a comment</label>
                        <textarea
                        id="comment"
                        name="comment"
                        required
                        rows={3}
                        maxLength={1000}
                        placeholder="Write a comment..."
                        className="border rounded-sm p-2"
                        />
                    </ActionForm>

                    {eventComments.length === 0 ? (
                        <p className="text-sm text-gray-500">No comments yet.</p>
                    ) : (
                        <ul className="flex flex-col gap-2">
                        {eventComments.map((c) => (
                            <li key={c.id} className="bg-gray-100 rounded-sm p-3">
                            <div className="flex items-baseline justify-between gap-2">
                                <span className="text-sm font-semibold">
                                {c.authorName}
                                {c.authorName === me && " (you)"}
                                </span>
                                <time dateTime={c.createdAt.toISOString()} className="text-xs text-gray-500">
                                {c.createdAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                                </time>
                            </div>
                            <p className="mt-1 text-sm whitespace-pre-wrap wrap-break-word">{c.comment}</p>
                            </li>
                        ))}
                        </ul>
                    )}
                    </div>
            </div>
        </>
    );
}