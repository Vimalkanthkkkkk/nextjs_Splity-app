import Actions from "@/app/_components/Actions";
import Navigation from "@/app/_components/Navigation";
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
                <div className="content-center pl-2 w-full h-10 self-center">
                    <Link href={`/${slug}/edit`} className="">
                        <svg 
                            fill="#000000" height="13px" width="20px" 
                            version="1.1" id="Capa_1" className="inline"
                            xmlns="http://www.w3.org/2000/svg" 
                            xmlnsXlink="http://www.w3.org/1999/xlink" 
                            viewBox="0 0 475 590" xmlSpace="preserve"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier"> 
                                <g>
                                    <path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225 c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"></path> 
                                </g> 
                            </g>
                        </svg>
                        <span className="text-black text-center">Back</span>
                    </Link>
                </div>
                <form action={''} className="bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)]  gap-2 flex flex-col w-full h-fit self-center p-4">
                    <input type="text" name="delete_event" readOnly hidden value={"true"} />
                    <div className="flex flex-1 flex-col text-black gap-6 justify-between">
                        <span className="text-2xl">Permanently delete Kitty {event.event}</span>
                        <span>
                            Are you sure you want to delete this Event and all its data? There is absolutely no way of undoing this action!
                        </span>
                    </div>
                    <div className="flex flex-1 gap-4 text-black">
                        <button type="submit" className="text-white pl-2 pr-2 p-1 w-fit mt-6 rounded-sm bg-amber-500">Delete Forever</button>
                        <Link href={`/${slug}/edit`} className="pl-2 pr-2 p-1 w-fit mt-6 rounded-sm bg-gray-500">Cancel</Link>
                    </div>
                </form>
            </div>
        </>
    );
}