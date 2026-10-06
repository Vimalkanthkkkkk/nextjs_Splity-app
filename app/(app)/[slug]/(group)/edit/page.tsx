import Actions from "@/app/_components/Actions";
import Attachment from "@/app/_components/Attachment";
import CurrencySelect from "@/app/_components/CurrencySelect";
import { getEvent } from "@/app/_orm/Queries";
import { redirect } from "next/navigation";
import Navigation from "@/app/_components/Navigation";
import { Props } from "@/app/_types/Props";
import BackButton from "@/app/_components/Backbutton";
import EditlayoutPage from "./Editpage";

export default async function EditEvent( {params} : Props){
    const {slug} = await params;
    const event = await getEvent(Number(slug));
    if(!event){
            redirect(`/${slug}`)
    }
    function bufferToDataUrl(buffer: Buffer, mimeType: string) {
        return `data:${mimeType};base64,${buffer.toString("base64")}`;
    }
    const src = event?.eventImage ? bufferToDataUrl(event.eventImage, "image/jpeg") :null;

    return(
        <>
            <Navigation route={`/${slug}`}>
                <Actions eventName={event.event} slug={slug}  />
            </Navigation>
            <EditlayoutPage slug={slug}>
                <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-4 shrink">
                    <BackButton route={`/${slug}`} />
                    <form className="bg-white text-black rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)]  gap-2 flex flex-col w-full h-fit self-center p-4">
                        <span>Edit Event</span>
                        <div className="content-center w-full self-center">
                            <label htmlFor="eventName" className="text-black block">Event Name</label>
                            <input type="text" name="eventName" id="eventName" value={event.event}
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
                        <button type="submit" className="text-black pl-2 pr-2 p-1 w-fit mt-6 rounded-sm bg-cyan-200">Send</button>
                    </form>
                </div>
            </EditlayoutPage>
        </>
    );
}