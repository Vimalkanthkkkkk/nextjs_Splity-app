import { getAllpayments } from "@/app/_orm/Queries";
import Image from "next/image";

export default async function EntriesPage({params}: {params: Promise<{ slug: string }>}){
    const { slug } = await params;
    const payments = await getAllpayments(Number(slug));
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
                <div className="bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] flex flex-col w-full h-fit self-center">
                    <div className="flex flex-1 text-black items-center justify-between p-4">
                        <span className="text-2xl mr-auto">Expenses</span>
                        <button type="submit" className="pl-2 mr-2 pr-2 p-1.5 shrink-0 self-center rounded-sm bg-gray-200">
                            <Image width={0} height={0} style={{ width: "24px", height: '20px' , borderRadius: 20 , objectFit: "contain" }} className="self-center" preload loading="eager" src="/search.png" alt="Splity logo" />
                        </button>
                        <button type="submit" className="wrap-anywhere pl-2 pr-2 p-1 w-fit rounded-sm bg-gray-200">+ Add participant</button>
                    </div>
                    <ul className="list-none ">
                        {
                            payments.length === 0 ? 

                            "No payments yet"

                            :
                            
                            payments.map((p)=> {
                                return(
                                    <li>
                                        <div className="grid grid-cols-12 items-center border-gray-200 text-black p-4">
                                            <div className="col-span-8">
                                                <span className="block">{p.whospayment} paid {p.howMuch} for </span>
                                                <span className="text-center text-sm">People involved: everyone. 09/24/2026 Your share: €12,948.00</span>
                                            </div>
                                            <span className="text-center min-h-fit rounded-4xl p-1 text-sm min-w-fit wrap-anywhere col-start-11 col-span-2 bg-blue-200">Rent & Home</span>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>                    
                </div>
            </div>
        </div>
    );
}