import ActionForm from "@/app/_components/ActionForm";
import Actions from "@/app/_components/Actions";
import BackButton from "@/app/_components/Backbutton";
import Navigation from "@/app/_components/Navigation";
import { DeleteEventAction } from "@/app/_orm/DeleteEvent";
import { getEvent } from "@/app/_orm/Queries";
import { Props } from "@/app/_types/Props";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DeleteEvent( {params} : Props){
    const {slug} = await params;
    const event = await getEvent(Number(slug));
    if(!event){
        redirect(`/${slug}/edit`)
    }
    return(
        <>
            <Navigation route={`/${slug}`}>
                <Actions eventName={event.event} slug={slug}  />
            </Navigation>
            <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-4 shrink">
                <BackButton route={`/${slug}/edit`} />
                <ActionForm
                    action={DeleteEventAction}
                    submitButtonColorString="bg-amber-500"
                    submitLabel="Delete Forever"
                    useIdempotencyKey
                    savingString="Deleting..."
                    className="bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)]  gap-2 flex flex-col w-full h-fit self-center p-4"
                >
                    <input type="hidden" name="event_id" value={slug}/>
                    <input type="text" name="delete_event" readOnly hidden value={"true"} />
                    <input type="hidden" name="old_event_name" value={event.event}/>
                    <div className="flex flex-1 flex-col text-black gap-6 justify-between">
                        <span className="text-2xl">Permanently delete Kitty {event.event}</span>
                        <span>
                            Are you sure you want to delete this Event and all its data? There is absolutely no way of undoing this action!
                        </span>
                    </div>
                    <div className="flex flex-1 gap-4 text-black">
                        <Link href={`/${slug}/edit`} className="pl-2 pr-2 p-1 w-fit mt-6 rounded-sm bg-gray-500">Cancel</Link>
                    </div>
                </ActionForm>
            </div>
        </>
    );
}