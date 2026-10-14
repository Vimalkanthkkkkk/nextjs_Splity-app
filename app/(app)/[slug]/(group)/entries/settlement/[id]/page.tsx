import Actions from "@/app/_components/Actions";
import { currencySymbols } from "@/app/_components/CurrencySymbols";
import { getSettlement } from "@/app/_orm/Queries";
import { notFound, redirect } from "next/navigation";
import Navigation from "@/app/_components/Navigation";
import BackButton from "@/app/_components/Backbutton";
import { requireEventAccess } from "@/app/_components/utils";
import ActionForm from "@/app/_components/ActionForm";
import { undoSettlementAction } from "@/app/_orm/Settlement";

interface PageProps {
  params: Promise<{
    slug: string;
    id: string;
  }>;
}



export default async function SettlementUndoPage({params}: PageProps){
    const { slug, id } = await params;
    const eventId = Number(slug);
    const settlementId = Number(id);
    if (!Number.isInteger(eventId) || !Number.isInteger(settlementId)) notFound();
    const access = await requireEventAccess(eventId);
    const s = await getSettlement(eventId , settlementId);
    if (!s) notFound();
    if (s.undoneAt) redirect(`/${eventId}/entries`);   

    const me = access.member?.name ?? null;
    const canUndo = access.role === "owner" || me === s.fromName || me === s.toName;
    const currency = access.event.currency;
    const currencyCode = currency as keyof typeof currencySymbols;
    const currencySymbol = currencySymbols[currencyCode];
    const date = `${s.createdAt.getDate()}/${s.createdAt.getMonth()}/${s.createdAt.getFullYear()}`
    return(
        <>
            <Navigation route={`/${slug}`}>
                <Actions eventName={access.event.event} slug={slug}  />
            </Navigation>
            <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-10 shrink">
                <BackButton route={`/${slug}`} />
                <div className="bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] flex flex-col w-full h-fit self-center">
                    <div className="flex flex-1 gap-10 flex-col text-black justify-between p-4">
                        <div className="flex flex-1 w-full justify-between text-black">
                            <span className="mr-auto text-2xl">Settlement</span>
                            <span className="text-2xl" >{currencySymbol}{s.amount}</span>
                        </div>
                        <span> <span className="text-gray-500">{s.fromName}</span> settled with <span className="text-gray-500">{s.toName}</span> on {date} </span>
                        {
                            canUndo
                            ?
                            <div className="flex flex-row justify-between w-full" >
                                <div className="w-10"></div>
                                <ActionForm
                                    action={undoSettlementAction}
                                    submitLabel="Undo"
                                    savingString="Undoing..."
                                    successMessage="Settlement deleted"
                                    submitButtonColorString="bg-gray-200"
                                >
                                    <input type="hidden" name="event_id" value={eventId} />
                                    <input type="hidden" name="settlement_id" value={s.id} />
                                </ActionForm>
                            </div>
                            :
                            <></>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}