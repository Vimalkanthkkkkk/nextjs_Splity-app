import Attachment from "@/app/_components/Attachment";
import CurrencySelect from "@/app/_components/CurrencySelect";
import { getEvent } from "@/app/_orm/Queries";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type editProps ={
    params : Promise<{slug: string}>;
}

export default async function EditEvent( {params} : editProps){
    const {slug} = await params;
    const event = await getEvent(Number(slug));

    function bufferToDataUrl(buffer: Buffer, mimeType: string) {
        return `data:${mimeType};base64,${buffer.toString("base64")}`;
    }
    const src = event?.eventImage ? bufferToDataUrl(event.eventImage, "image/jpeg") :null;

    return(
        <div className="flex pb-2 flex-1 gap-2 flex-col shrink w-auto h-auto justify-between bg-white overflow-y-scroll">
            <nav role="navigation" className="w-full bg-gray-600">
                <div className="w-full max-w-3xl items-center justify-between mx-auto px-2 flex">
                    <Link href={'/'} className="flex items-center">
                        <Image
                            width={0} height={0}
                            style={{ width: '50px', height: '50px' }}
                            className=" col-start-2 col-end-3"
                            preload
                            loading="eager"
                            src="/noun_bill_5997839_@700.png"
                            alt="Splity logo"
                        />
                    </Link>
                    <div className="relative inline-block text-left group">
                        <button 
                            type="button" 
                            className="duration-400 inline-flex items-center justify-between px-4 py-2 text-white rounded-md cursor-pointer transition-colors focus:outline-none"
                        >
                            {event?.event}
                            <span className="ml-2 text-xs transition-transform duration-300 pointer-events-none group-focus-within:rotate-180">▼</span>
                        </button>
                        <ul className="absolute z-10 -right-12 mt-2 w-48 p-2
                                origin-top-right rounded-md bg-white border border-slate-200 
                                shadow-lg ring-1 ring-black/5 opacity-0 invisible 
                                scale-95 transition-all duration-200 pointer-events-none 
                                group-focus-within:opacity-100 [&_button]:rounded-sm
                                group-focus-within:invisible-none group-focus-within:scale-100 
                                group-focus-within:pointer-events-auto">
                            <li className="w-full">
                                <Link href={`/${slug}/edit`} className="w-full text-left px-4 pr-24 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                                    Edit Event
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${slug}/invite`} className="w-full text-left px-4 pr-18 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                                    Invite to Event
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${slug}/manage`} className="w-full text-left px-4 pr-11 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                                    Manage Participant
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${slug}/insight`} className="w-full text-left px-4 pr-28 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                                    insights
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${slug}`} className="w-full text-left px-4 pr-12 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                                    Export as Excel file
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${slug}/history`} className="w-full text-left px-4 pr-21 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                                    Show history
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div style={{ width: '50px' }} />
                </div>
            </nav>
            <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-4 shrink">
                <div className="content-center pl-2 w-full h-10 self-center">
                    <Link href={`/${slug}`} className="">
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
                <form className="bg-white text-black rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)]  gap-2 flex flex-col w-full h-fit self-center p-4">
                    <span>Edit Event</span>
                    <div className="content-center w-full self-center">
                        <label htmlFor="eventName" className="text-black block">Event Name</label>
                        <input type="text" name="eventName" id="eventName" value={event?.event}
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
                    <span>Home Currency</span>
                    <select name="currency" id="currency"
                        className=" *:bg-gray-400 focus:*:bg-gray-700 hover:bg-gray-500
                            mb-2 text-center duration-400 items-center
                            px-2 w-max max-h-max wrap-anywhere bg-gray-300 text-black rounded-sm
                            [appearance:base-select] [&_::picker(select)]:[appearance:base-select]
                        ">
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="AED">AED</option>
                        <option value="GBP">GBP</option>
                        <option value="AFN">AFN</option>
                        <option value="BDT">BDT</option>
                        <option value="CAD">CAD</option>
                        <option value="IDR">IDR</option>
                        <option value="PKR">PKR</option>
                        <option value="PHP">PHP</option>
                        <option value="QAR">QAR</option>
                    </select>
                    <button type="submit" className="text-black pl-2 pr-2 p-1 w-fit mt-6 rounded-sm bg-cyan-200">Send</button>
                </form>
            </div>
            <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-4 shrink">
                <div className="bg-white text-black rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)]  gap-2 flex flex-col w-full h-fit self-center p-4">
                    <span>DANGER ZONE - Delete Event</span>
                    <span>There is no way of retrieving a deleted Event!</span>
                    <Link href={`/${slug}/delete`} className="pl-2 pr-2 p-1 w-fit rounded-sm bg-gray-500">Delete Event</Link>
                </div>
            </div>
        </div>
    );
}