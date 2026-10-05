import Link from "next/link";
import Image from "next/image";
import { getpayment } from "@/app/_orm/Queries";
import { redirect } from "next/navigation";
import { currencySymbols } from "@/app/_components/CurrencySymbols";

interface PaymentProps {
  params: Promise<{
    slug: string;
    payment : string;
  }>;
}

export default async function EditpaymentsPage( {params } : PaymentProps){
    const {slug , payment} = await params;
    const expense = await getpayment(Number(payment));
    if(!expense){
        redirect(`/${slug}/entries`)
    }
    const currency = expense.event.currency;
    const currencyCode = currency as keyof typeof currencySymbols;
    const currencySymbol = currencySymbols[currencyCode] ;
    const date = expense.when;
    const type = expense.type;
    const word = type === "expense" ? "Paid by" : type === "income" ? "Received by" : ''
    const wordtwo = type !== "transfer" ? "on" : "gave to";
    return(
        <div className="flex pb-2 flex-1 gap-2 flex-col shrink w-auto h-auto justify-between bg-white overflow-y-scroll">
            <nav role="navigation" className="w-full bg-gray-600">
                <div className="w-full max-w-3xl items-center justify-between mx-auto px-2 flex">
                    <div className="flex items-center">
                        <Link href="/">
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
            <div className="w-full max-w-xl mx-auto px-2 flex flex-1 flex-col gap-10 shrink">
                <div className="content-center pl-2 w-full h-10 self-center">
                    <span className="text-black">{`<- Back`}</span>
                </div>
                <div className="bg-white gap-2 text-black p-4 rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] flex flex-col w-full h-fit self-center">
                    <span>{type.toLocaleUpperCase()}</span>
                    <div className="flex mt-6 flex-1 justify-between">
                        <span>{expense.whatFor}</span>
                        <span>{currencySymbol}{expense.howMuch}</span>
                    </div>
                    <span>{word} {expense.whospayment} {wordtwo} {`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`}</span>
                    <span className="mt-6 mb-6">split by {expense.splitMethod === "amounts" ? `exacts ${expense.splitMethod}` : expense.splitMethod}</span>
                    <ul>
                        {
                            Object.entries(expense.splitDifferent ?? {}).map(([p , amt] , idx)=>{
                                return(
                                   <li key={idx} className="flex mb-4 flex-1 justify-between">
                                        <div className="flex flex-1 flex-col justify-between">
                                            <span>{p}</span>
                                            <span className="text-[14px]">{expense.splitMethod === "percentages" ? `${amt.percent} %` : expense.splitMethod === "shares" ? `Shares : ${amt.share}` : ''}</span>
                                        </div>
                                        <span>{currencySymbol} {amt.amt}</span>
                                    </li> 
                                );
                            })
                        }
                    </ul>
                    <div className="flex justify-between text-black">
                        <Link href={`${expense?.id}/edit`} className="bg-sky-300 rounded-sm p-2">
                            <Image width={0} height={0} style={{ width: "24px", height: '20px' , borderRadius: 20 , objectFit: "contain" }} className="self-center inline mr-1" preload loading="eager" src="/edit.png" alt="Splity logo" />
                            Edit
                        </Link>
                        <Link href={`${expense?.id}/edit`} className="bg-gray-300 rounded-sm p-2">
                            <Image width={0} height={0} style={{ width: "24px", height: '20px' , borderRadius: 20 , objectFit: "contain" }} className="self-center inline mr-1" preload loading="eager" src="/delete.png" alt="Splity logo" />
                            Delete
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    );
}