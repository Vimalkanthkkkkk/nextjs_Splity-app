import Image from "next/image";
import Link from "next/link";

export default async function EventsMainPage({params}: {params: Promise<{ slug: string }>}){
    const { slug } = await params;
    
    return(
        <div className="flex pb-2 flex-1 gap-2 flex-col shrink w-auto h-auto justify-between bg-white overflow-y-scroll">
            <nav role="navigation" className="w-full bg-gray-600">
                <div className="w-full max-w-3xl items-center justify-between mx-auto px-2 flex">
                    <div className="flex items-center">
                        <Image
                            width={0} height={0}
                            style={{ width: '50px', height: '50px' }}
                            className=" col-start-2 col-end-3"
                            preload
                            loading="eager"
                            src="/noun_bill_5997839_@700.png"
                            alt="Splity logo"
                        />
                    </div>
                    <div className="relative inline-block text-left group">
                        <button 
                            type="button" 
                            className="duration-400 inline-flex items-center justify-between px-4 py-2 text-white rounded-md cursor-pointer transition-colors focus:outline-none"
                        >
                            {slug}
                            <span className="ml-2 text-xs transition-transform duration-300 pointer-events-none group-focus-within:rotate-180">▼</span>
                        </button>
                        <ul className="absolute z-10 -right-12 mt-2 w-48 p-2
                                origin-top-right rounded-md bg-white border border-slate-200 
                                shadow-lg ring-1 ring-black/5 opacity-0 invisible 
                                scale-95 transition-all duration-200 pointer-events-none 
                                group-focus-within:opacity-100 [&_button]:rounded-sm
                                group-focus-within:invisible-none group-focus-within:scale-100 
                                group-focus-within:pointer-events-auto">
                            <li>
                            <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                                Edit Event
                            </button>
                            </li>
                            <li>
                            <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                                Invite to Event
                            </button>
                            </li>
                            <li>
                            <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                                Manage Participant
                            </button>
                            </li>
                            <li>
                            <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                                insights
                            </button>
                            </li>
                            <li>
                            <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                                Export as Excel file
                            </button>
                            </li>
                            <li>
                            <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                                Show history
                            </button>
                            </li>
                        </ul>
                    </div>
                    <div style={{ width: '50px' }} />
                </div>
            </nav>
            <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-4 shrink">
                <div className="bg-amber-500 w-full rounded-4xl h-50 self-center relative ">
                    <Image width={0} height={0} sizes="100vw" style={{ width: "100%", height: '100%' , borderRadius: 20 , objectFit: "fill" }} className="items-start" preload loading="eager" src="/split.jpeg" alt="Splity logo" />
                </div>
                <div className="content-center pl-2 w-full h-10 self-center">
                    <span className="text-black">Hi vimal</span>
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
                        <button type="submit" className="mr-2 p-1 rounded-sm bg-gray-200">View Expenses</button>
                        <button type="submit" className="bg-gray-400 rounded-sm p-1">Add Expenses</button>
                        <Link href='/new/entries' className="flex">
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
                    <span>Vimal</span>
                    <span>Vimal 2</span>
                    <button type="submit" className="p-1 w-fit self-end rounded-sm bg-gray-200">View Expenses</button>
                </div>
                <div className="bg-white shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] text-black rounded-sm gap-2 flex flex-col w-full h-fit self-center p-4">
                    <h1 className="">Comments</h1>
                    <textarea name="comments" id="comments" className="border rounded-sm"></textarea>
                    <button type="submit" className="pl-2 pr-2 p-1 w-fit self-end rounded-sm bg-gray-200">Send</button>
                </div>
            </div>
            
        </div>
    );
}