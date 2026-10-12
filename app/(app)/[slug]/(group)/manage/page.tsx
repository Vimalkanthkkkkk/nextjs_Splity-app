import Actions from "@/app/_components/Actions";
import { Props } from "@/app/_types/Props";
import Navigation from "@/app/_components/Navigation";
import BackButton from "@/app/_components/Backbutton";
import { getEvent } from "@/app/_orm/Queries";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ManageParticipantsPage({params} : Props){
    const {slug} = await params;
    const event = await getEvent(Number(slug));
    if(!event){
        redirect(`/${slug}`)
    }
    
    return(
        <>
            <Navigation route={`/${slug}`}>
                <Actions eventName={event.event} slug={slug}  />
            </Navigation>
            <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-10 shrink">
                <BackButton route={`/${slug}`} />
                <div className="bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] flex flex-col w-full h-fit self-center">
                    <div className="flex flex-1 text-black items-center p-4 justify-between">
                        <span>Manage participant</span>
                        <Link href={''} className="pl-2 pr-2 p-1 w-fit rounded-sm bg-gray-200">+ Add participant</Link>
                    </div>
                    <ul className="list-none ">
                        <li className="">
                            <div className="grid grid-cols-12 items-center text-black p-4">
                                <span className="col-span-4">Names</span>
                                <span className="col-span-6 text-center">Shares</span>
                                <div  className="col-span-2" style={{ width: '1px' }} />
                            </div>
                        </li>

                        {
                            event.participants.map((p , idx)=>{
                                return(
                                    <li key={idx}>
                                        <div className="grid grid-cols-12 items-center border-t border-gray-200 text-black p-4">
                                            <span className="col-span-4">{p}</span>
                                            <span className="col-span-6 text-center">1</span>
                                            <button type="submit" className="mr-2 p-1 rounded-sm wrap-anywhere col-span-2 bg-gray-200">Edit</button>
                                        </div>
                                    </li>
                                );
                            })
                        }
                        
                    </ul>                    
                </div>
            </div>
        </>
    );
}