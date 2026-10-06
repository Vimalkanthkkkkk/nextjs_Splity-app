import Actions from "@/app/_components/Actions";
import { Props } from "@/app/_types/Props";
import Image from "next/image";
import Navigation from "@/app/_components/Navigation";
import BackButton from "@/app/_components/Backbutton";


export default async function InvitePage({params} : Props){
    const {slug} = await params;
    return(
        <>
            <Navigation route={`/${slug}`}>
                <Actions eventName={event.event} slug={slug}  />
            </Navigation>
            <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-14 shrink">
                <BackButton route={`/${slug}`} />
                <div className="bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)]  gap-2 flex flex-col w-full h-fit self-center p-4">
                    <div className="flex flex-1 text-black items-center justify-between">
                        <span>Invite your friends to participate in this Event</span>
                    </div>
                    <span className="text-black mt-4">Everyone with this link can modify the Kitty and add expenses.</span>
                    <div className="text-black flex flex-1 flex-row">
                        <div className="bg-gray-300 rounded-tl-sm rounded-bl-sm content-center p-1">
                            <Image width={0} height={0} style={{ width: "30px", height: '14px' , borderRadius: 20 , objectFit: "contain" }} className="self-center" preload loading="eager" src="/link.png" alt="Splity logo" />
                        </div>
                        <input type="text" name="eventName" id="eventName"
                            className="
                                text-black focus:outline-0
                                p-2 max-w-full w-full h-8 border
                                border-gray-300
                            "
                        />
                        <button type="submit" className="p-1 bg-gray-300">
                            <Image width={0} height={0} style={{ width: "30px", height: '14px' , borderRadius: 20 , objectFit: "contain" }} className="self-center" preload loading="eager" src="/file.png" alt="Splity logo" />
                        </button>
                        <button type="submit" className="bg-gray-300 p-1">
                            <Image width={0} height={0} style={{ width: "30px", height: '14px' , borderRadius: 20 , objectFit: "contain" }} className="self-center" preload loading="eager" src="/email.png" alt="Splity logo" />
                        </button>
                        <button type="submit" className="p-1 bg-green-400">
                            <Image width={0} height={0} style={{ width: "30px", height: '14px' , borderRadius: 20 , objectFit: "contain" }} className="self-center" preload loading="eager" src="/whatsapp.png" alt="Splity logo" />
                        </button>
                        <button type="submit" className="bg-blue-600 p-1 rounded-tr-sm rounded-br-sm">
                            <Image width={0} height={0} style={{ width: "30px", height: '14px' , borderRadius: 20 , objectFit: "contain" }} className="self-center" preload loading="eager" src="/fb.png" alt="Splity logo" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}