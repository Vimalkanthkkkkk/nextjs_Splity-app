import Actions from "@/app/_components/Actions";
import { currencySymbols } from "@/app/_components/CurrencySymbols";
import { getAllpayments, getEventEntries } from "@/app/_orm/Queries";
import { Props } from "@/app/_types/Props";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navigation from "@/app/_components/Navigation";
import BackButton from "@/app/_components/Backbutton";
import { requireEventAccess } from "@/app/_components/utils";

export default async function EntriesPage({params}: Props){
    const { slug } = await params;
    const access = await requireEventAccess(Number(slug));
    const entries = await getEventEntries(access.event.id);
    if(entries.length === 0){
        redirect(`/${slug}`);
    }
    return(
        <>
            <Navigation route={`/${slug}`}>
                <Actions eventName={entries[0].event.event} slug={slug}  />
            </Navigation>
            <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-10 shrink">
                <BackButton route={`/${slug}`} />
                <div className="bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] flex flex-col w-full h-fit self-center">
                    <div className="flex flex-1 text-black items-center justify-between p-4">
                        <span className="text-2xl mr-auto">Expenses</span>
                        <button type="submit" className="pl-2 mr-2 pr-2 p-1.5 shrink-0 self-center rounded-sm bg-gray-200">
                            <Image width={0} height={0} style={{ width: "24px", height: '20px' , borderRadius: 20 , objectFit: "contain" }} className="self-center" preload loading="eager" src="/search.png" alt="Splity logo" />
                        </button>
                        <Link href={`/${slug}/new/entries/expense`} className="wrap-anywhere pl-2 pr-2 p-1 w-fit rounded-sm bg-gray-200">+ Add Expense</Link>
                    </div>
                    <ul className="list-none ">
                        {
                            payments.length === 0 ? 

                            <span className="p-4 mb-4 text-black">No payments yet</span>

                            :
                            
                            payments.map((p , i)=> {
                                const word = p.type === "expense" ? "Paid" : p.type === "income" ? "received" : "gave" ;
                                const date = `${p.when.getDate()}/${p.when.getMonth()}/${p.when.getFullYear()}`
                                const currency = p.event.currency;
                                const length = Object.keys(p.splitDifferent ?? {}).length - 1;
                                const currencyCode = currency as keyof typeof currencySymbols;
                                const currencySymbol = currencySymbols[currencyCode] ;
                                const myShare = p.splitDifferent ? Object.entries(p.splitDifferent).map(([participant , amount]) => {
                                                    return participant=== p.whospayment ? amount.amt : '' 
                                        }) : ''
                                return(
                                    <li key={i} className="hover:bg-gray-100">
                                        <Link href={`entries/${p.id}`} className="flex flex-1 justify-between items-center border-gray-200 text-black p-4">
                                            <div className="col-span-8">
                                                <span className="block text-[20px]">{p.whospayment} {word} {currencySymbol}{p.howMuch} for {p.whatFor}</span>
                                                {
                                                    p.type !== "transfer" ? 
                                                    <span className="text-center text-sm">People involved: {p.isSplitEqually ? "everyone" : p.splitDifferent 
                                                        ? 
                                                        Object.entries(p.splitDifferent).map(([participant , amount] , idx) => {
                                                            return (`${participant}${length !== idx ? " , " : '' }`);
                                                        })  
                                                        : ''
                                                        }. {date} Your share: {currencySymbol}{myShare}
                                                    </span>
                                                    :
                                                    <></>
                                                }
                                            </div>
                                            <span className="text-center rounded-4xl p-1 w-fit text-[12px] col-start-11 bg-blue-200">{p.category}</span>
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>                    
                </div>
            </div>
        </>
    );
}