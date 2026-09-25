import Image from "next/image";

export default async function EditEvent(){
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
                <div className="content-center pl-2 w-full h-10 self-center">
                    <span className="text-black">{`<- Back`}</span>
                </div>
                <div className="bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)]  gap-2 flex flex-col w-full h-fit self-center p-4">
                    <div className="flex flex-1 text-black items-center justify-between">
                        <span>Edit Event</span>
                    </div>
                    <div className="content-center w-full self-center">
                        <label htmlFor="eventName" className="text-black block">Event Name</label>
                        <input type="text" name="eventName" id="eventName"
                            className="
                                text-black
                                p-2 w-60 max-w-full h-8 border
                                border-gray-600 rounded-sm
                            "
                        />
                    </div>
                    <div className="flex flex-1 text-black items-center justify-between">
                        <span>Event image</span>
                    </div>
                    <div className="bg-amber-500 w-fit rounded-4xl h-40 relative ">
                        <Image width={0} height={0} sizes="100vw" style={{ width: "100%", height: '100%' , borderRadius: 20 , objectFit: "fill" }} className="items-start" preload loading="eager" src="/split.jpeg" alt="Splity logo" />
                    </div>
                    <div className="flex flex-1 text-black items-center justify-between">
                        <span>JPEG, PNG or WebP. Up to 10 MB.</span>
                    </div>
                    <div className="text-black flex flex-1 flex-row">
                        <button type="submit" className="mr-2 p-1 rounded-sm bg-gray-200">Change Image</button>
                        <button type="submit" className="bg-gray-200 rounded-sm p-1">Remove Image</button>
                    </div>
                    <div className="flex flex-1 text-black items-center justify-between">
                        <span>Home Currency</span>
                    </div>
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
                    <div className="bg-white text-black rounded-sm gap-2 flex flex-col w-full h-fit self-center mt-4">
                        <button type="submit" className="pl-2 pr-2 p-1 w-fit rounded-sm bg-gray-200">Send</button>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-4 shrink">
                <div className="bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)]  gap-2 flex flex-col w-full h-fit self-center p-4">
                    <div className="flex flex-1 text-black items-center justify-between">
                        <span>DANGER ZONE - Delete Event</span>
                    </div>
                    <div className="flex flex-1 mt-4 text-black items-center justify-between">
                        <span>There is no way of retrieving a deleted Event!</span>
                    </div>
                    <div className="bg-white text-black rounded-sm gap-2 flex flex-col w-full h-fit self-center">
                        <button type="submit" className="pl-2 pr-2 p-1 w-fit rounded-sm bg-gray-200">Delete Event</button>
                    </div>
                </div>
            </div>
        </div>
    );
}