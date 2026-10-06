import Actions from "@/app/_components/Actions";
import { getEvent } from "@/app/_orm/Queries";
import { Props } from "@/app/_types/Props";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navigation from "@/app/_components/Navigation";

export default async function EventsMainPage({params}: Props){
    const { slug } = await params;
    const event = await getEvent(Number(slug));
    if(!event){
        redirect("/");
    }
    
    return(
        <>        
            <Navigation route={`/`} >
                <Actions eventName={event.event} slug={slug}  />
            </Navigation>
            <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-4 shrink">
                <div className="w-full rounded-4xl h-50 self-center relative ">
                    <Image width={0} height={0} sizes="100vw" style={{ width: "100%", height: '100%' , borderRadius: 20 , objectFit: "fill" }} className="items-start" preload loading="eager" src="/split.jpeg" alt="Splity logo" />
                </div>
                <div className="content-center pl-2 w-full h-10 self-center">
                    <span className="text-black">Hi {event.creator.username}</span>
                </div>
                <div className="bg-gray-400 wrap-anywhere rounded-sm border-2 text-black w-full p-2 self-center content-center pl-2">
                    Invite your friends to participate in this Event
                </div>
                <div className="bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)]  gap-2 flex flex-col w-full h-fit self-center p-4">
                    <div className="flex flex-1 text-black items-center justify-between">
                        <span>Overview</span>
                        <span>0 Expenses</span>
                    </div>
                    <span className="text-black">For families or couples who share their balance, set up default shares.</span>
                    <hr className="w-full bg-gray-950 h-0.5"/>  
                    <div className="text-black">
                        <div className="flex flex-1 items-center justify-between">
                            <span>This event cost the group:</span>
                            <span>0</span>
                        </div>
                        <div className="flex flex-1  items-center justify-between">
                            <span>It cost you:</span>
                            <span>0</span>
                        </div>
                        <div className="flex flex-1  items-center justify-between">
                            <span>You've paid:</span>
                            <span>0</span>
                        </div>
                        <div className="flex flex-1 items-center justify-between">
                            <span>You are owed:</span>
                            <span>0</span>
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
                            <span className="">How to settle all debts</span>
                            <span className="">?</span>
                        </div>
                    <span>To see how the settlements are calculated, export this Kitty as Excel file.</span>
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
                <div className="bg-white shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] text-black rounded-sm gap-2 flex flex-col w-full h-fit self-center p-4">
                    <h1 className="">Comments</h1>
                    <textarea name="comments" id="comments" className="border rounded-sm"></textarea>
                    <button type="submit" className="pl-2 pr-2 p-1 w-fit self-end rounded-sm bg-gray-200">Send</button>
                </div>
            </div>
        </>
    );
}