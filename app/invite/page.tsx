import Image from "next/image";

export default function InvitePage(){
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
                            Actions
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
                <div className="bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)]  gap-2 flex flex-col w-full h-fit self-center p-4">
                    <div className="flex flex-1 text-black items-center justify-between">
                        <span>Invite your friends to participate in this Event</span>
                    </div>
                    <span className="text-black mt-4">Everyone with this link can modify the Kitty and add expenses.</span>
                    <div className="text-black flex flex-1 flex-row">
                        <div className="bg-gray-300 rounded-tl-sm rounded-bl-sm content-center p-1">vimal</div>
                        <button type="submit" className="p-1 bg-gray-300">View</button>
                        <button type="submit" className="bg-gray-300 p-1">Add </button>
                        <input type="text" name="eventName" id="eventName"
                            className="
                                text-black
                                p-2 max-w-full w-full h-8 border
                                border-gray-400
                            "
                        />
                        <button type="submit" className="p-1 bg-gray-300">View</button>
                        <button type="submit" className="bg-gray-300 p-1 rounded-tr-sm rounded-br-sm">Add </button>
                    </div>
                </div>
            </div>
        </div>
    );
}