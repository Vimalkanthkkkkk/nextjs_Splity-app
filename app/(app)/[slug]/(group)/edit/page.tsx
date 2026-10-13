import Actions from "@/app/_components/Actions";
import Attachment from "@/app/_components/Attachment";
import CurrencySelect from "@/app/_components/CurrencySelect";
import { getEvent } from "@/app/_orm/Queries";
import { redirect } from "next/navigation";
import ActionForm from "@/app/_components/ActionForm";
import Navigation from "@/app/_components/Navigation";
import { Props } from "@/app/_types/Props";
import BackButton from "@/app/_components/Backbutton";
import EditlayoutPage from "./Editpage";
import { EventEditAction } from "@/app/_orm/EditEvent";

export default async function EditEvent( {params} : Props){
    const {slug} = await params;
    const event = await getEvent(Number(slug));
    
    //if(!event){
      //  redirect(`/${slug}`)
    //}
    function bufferToDataUrl(buffer: Buffer, mimeType: string) {
        return `data:${mimeType};base64,${buffer.toString("base64")}`;
    }
    const src = event?.eventImage ? bufferToDataUrl(event.eventImage, "image/jpeg") :null;

    return(
        <>
            <Navigation route={`/${slug}`}>
                <Actions eventName={/*event.event*/"gg"} slug={slug}  />
            </Navigation>
            <EditlayoutPage slug={slug}>
                <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-4 shrink">
                    <BackButton route={`/${slug}`} />
                    <ActionForm
                        action={EventEditAction}
                        submitLabel="Save"
                        useIdempotencyKey
                        savingString="Saving..."
                        submitButtonColorString="bg-cyan-200"
                        className="bg-white text-black 
                            rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)]  
                            gap-2 flex flex-col w-full h-fit self-center p-4"
                    >
                        <input
                            type="hidden"
                            name="event_id"
                            value={slug}
                        />
                        <input
                            type="hidden"
                            name="old_event_name"
                            value={"slug"}//event.event 
                        />
                        <span>Edit Event</span>
                        <div className="content-center w-full self-center">
                            <label htmlFor="eventName" className="text-black block">Event Name</label>
                            <input max={2} min={3} type="text" name="eventName" id="eventName" defaultValue={/*event!.event*/"gg"}
                                className="
                                    text-black
                                    p-2 w-full max-w-lg h-8 border
                                    border-gray-600 rounded-sm
                                "
                            />
                        </div>
                        <span>Event image</span>
                        <Attachment src={src} />
                        <CurrencySelect/>
                    </ActionForm>
                </div>
            </EditlayoutPage>
        </>
    );
}