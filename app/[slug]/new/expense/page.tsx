import Image from "next/image";
import ParticipantDropdownPage from "./ParticipantDropdown";
import CategoryDropdown from "./CategorydropDown";


export default function ExpensePage(){
    const participants = [""];
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
            <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-10 shrink">
                <div className="content-center pl-2 w-full h-10 self-center">
                    <span className="text-black">{`<- Back`}</span>
                </div>
                <div className="bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] p-4 gap-10 flex flex-col w-full h-fit self-center">
                    <div className="grid grid-cols-12 grid-rows-1">
                        <div className="flex flex-1 flex-col col-span-12 gap-4">
                            <div className="flex flex-row gap-2 text-black">
                                <a href="" className="border-b-3">Expense</a>
                                <a href="">Transfer</a>
                                <a href="">Income</a>
                            </div>
                            <form action="">
                                <ParticipantDropdownPage participants={participants} />
                                <label htmlFor="you" className="text-black block mt-2 mb-1">How much?</label>
                                <span className="inline text-black border-t border-l border-b p-2 border-gray-600 rounded-tl-sm rounded-bl-sm">$</span>
                                <input type="number" name="you" id="you" placeholder="Amount" className="
                                    p-2 text-black
                                    w-60 max-w-full
                                    h-8 border-r border-t border-b
                                    border-gray-600 rounded-tr-sm rounded-br-sm
                                "/>
                                <CategoryDropdown/>
                                <label htmlFor="you" className="text-black block mt-2 mb-1">How much?</label>
                                <span className="inline text-black border-t border-l border-b p-2 border-gray-600 rounded-tl-sm rounded-bl-sm">$</span>
                                <input type="number" name="you" id="you" placeholder="Amount" className="
                                    p-2 text-black
                                    w-60 max-w-full
                                    h-8 border-r border-t border-b
                                    border-gray-600 rounded-tr-sm rounded-br-sm
                                "/><label htmlFor="you" className="text-black block mt-2 mb-1">How much?</label>
                                <span className="inline text-black border-t border-l border-b p-2 border-gray-600 rounded-tl-sm rounded-bl-sm">$</span>
                                <input type="number" name="you" id="you" placeholder="Amount" className="
                                    p-2 text-black
                                    w-60 max-w-full
                                    h-8 border-r border-t border-b
                                    border-gray-600 rounded-tr-sm rounded-br-sm
                                "/><label htmlFor="you" className="text-black block mt-2 mb-1">How much?</label>
                                <span className="inline text-black border-t border-l border-b p-2 border-gray-600 rounded-tl-sm rounded-bl-sm">$</span>
                                <input type="number" name="you" id="you" placeholder="Amount" className="
                                    p-2 text-black
                                    w-60 max-w-full
                                    h-8 border-r border-t border-b
                                    border-gray-600 rounded-tr-sm rounded-br-sm
                                "/>
                                <label htmlFor="you" className="text-black block mt-2 mb-1">How much?</label>
                                <span className="inline text-black border-t border-l border-b p-2 border-gray-600 rounded-tl-sm rounded-bl-sm">$</span>
                                <input type="number" name="you" id="you" placeholder="Amount" className="
                                    p-2 text-black
                                    w-60 max-w-full
                                    h-8 border-r border-t border-b
                                    border-gray-600 rounded-tr-sm rounded-br-sm
                                "/><label htmlFor="you" className="text-black block mt-2 mb-1">How much?</label>
                                <span className="inline text-black border-t border-l border-b p-2 border-gray-600 rounded-tl-sm rounded-bl-sm">$</span>
                                <input type="number" name="you" id="you" placeholder="Amount" className="
                                    p-2 text-black
                                    w-60 max-w-full
                                    h-8 border-r border-t border-b
                                    border-gray-600 rounded-tr-sm rounded-br-sm
                                "/><label htmlFor="you" className="text-black block mt-2 mb-1">How much?</label>
                                <span className="inline text-black border-t border-l border-b p-2 border-gray-600 rounded-tl-sm rounded-bl-sm">$</span>
                                <input type="number" name="you" id="you" placeholder="Amount" className="
                                    p-2 text-black
                                    w-60 max-w-full
                                    h-8 border-r border-t border-b
                                    border-gray-600 rounded-tr-sm rounded-br-sm
                                "/><label htmlFor="you" className="text-black block mt-2 mb-1">How much?</label>
                                <span className="inline text-black border-t border-l border-b p-2 border-gray-600 rounded-tl-sm rounded-bl-sm">$</span>
                                <input type="number" name="you" id="you" placeholder="Amount" className="
                                    p-2 text-black
                                    w-60 max-w-full
                                    h-8 border-r border-t border-b
                                    border-gray-600 rounded-tr-sm rounded-br-sm
                                "/><label htmlFor="you" className="text-black block mt-2 mb-1">How much?</label>
                                <span className="inline text-black border-t border-l border-b p-2 border-gray-600 rounded-tl-sm rounded-bl-sm">$</span>
                                <input type="number" name="you" id="you" placeholder="Amount" className="
                                    p-2 text-black
                                    w-60 max-w-full
                                    h-8 border-r border-t border-b
                                    border-gray-600 rounded-tr-sm rounded-br-sm
                                "/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}