import Actions from "@/app/_components/Actions";
import { currencySymbols } from "@/app/_components/CurrencySymbols";
import { getpayment } from "@/app/_orm/Queries";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navigation from "@/app/_components/Navigation";
import BackButton from "@/app/_components/Backbutton";

interface PageProps {
  params: Promise<{
    slug: string;
    payment: string;
  }>;
}

interface PaymentDetail {
  amt: number;
  share?: number;
  percent?: number;
}


export default async function PaymentPage({params}: PageProps){
    const { payment , slug } = await params;
    const paymentData = await getpayment(Number(payment));
    if(!paymentData){
        redirect(`/${slug}/entries`)
    }
    const currencyCode = paymentData.event.currency as keyof typeof currencySymbols;
    const currencySymbol = currencySymbols[currencyCode];
    const participants = paymentData.event.participants;
    const splitType = paymentData.type;
    const splitMethod = paymentData.splitMethod;
    const word = paymentData.type === "expense" ? "Paid by" : paymentData.type === "income" ? "received by" : "gave to" ;
    const date = `${paymentData.when.getDate()}/${paymentData.when.getMonth()}/${paymentData.when.getFullYear()}`
    const equally = Boolean(paymentData.isSplitEqually || ( Object.entries(paymentData.splitDifferent ?? {}).length === participants.length ) );
    const splitWord = `Equally between ${equally ? "Everyone" : "involved participants"}`;
    const split_title = splitMethod === "Equally" ? splitWord 
        : splitMethod === "amounts" ? 'Split by exact amounts' 
        : splitMethod === "shares" ? 'Split by shares' 
        : splitMethod === "percentages" ? 'Split by percentages' 
        : '' ;
    const paymentMembers : string[] = Object.entries(paymentData.splitDifferent ?? {}).map(([name , amt], idx) => {
        return name;
    })
    const [whom] = Object.entries(paymentData.splitDifferent ?? {})[0] ?? [];
    const paymentMembersLookup: Record<string, PaymentDetail> = Object.fromEntries(
        Object.entries(paymentData.splitDifferent ?? {}).map(([name, amt]) => {
            const paymentDetail: PaymentDetail = typeof amt === 'number' ? { amt } : amt;  
            return [name, paymentDetail]; 
        })
    );
    return(
        <>
            <Navigation route={`/${slug}`}>
                <Actions eventName={paymentData.event.event} slug={slug}  />
            </Navigation>
            <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-10 shrink">
                <BackButton route={`/${slug}`} />
                <div className="bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] flex flex-col w-full h-fit self-center">
                    <div className="flex flex-1 gap-10 flex-col text-black justify-between p-4">
                        <div className="flex flex-1 w-full justify-between text-black">
                            <span className="mr-auto">{splitType.toUpperCase()}</span>
                            <span className="mr-auto">{paymentData.category}</span>
                        </div>
                        <div className="flex flex-1 w-full justify-between text-black">
                            <span className="text-2xl" >{paymentData.whatFor}</span>
                            <span>{currencySymbol} {paymentData.howMuch.toFixed(2)}</span>
                        </div>
                        <span>
                            {word} { paymentData.type !== "transfer" ? paymentData.whospayment : whom} on {date}
                        </span>
                        <div>
                            <label>Notes</label>
                            <p>{paymentData.notes}</p>
                        </div>
                        <div>
                            <label className="text-[24px]" >{split_title}</label>
                            <ul className="flex flex-col gap-4 mt-2">
                                {
                                    participants.map((p , idx) => {
                                        return (
                                            <li key={idx}>
                                                <div className="flex flex-row justify-between w-full" >
                                                    <span className={`${paymentMembers.includes(p) ? 'text-black' : 'text-gray-200' } flex flex-col `}>
                                                        {p}
                                                        <span>
                                                            { 
                                                                splitMethod === "percentages" ? `${paymentMembersLookup[p].percent} %` : 
                                                                splitMethod === "shares"  ? `Shares : ${paymentMembersLookup[p].share} ` : ``
                                                            }
                                                        </span>
                                                    </span>
                                                    <span className={`${paymentMembers.includes(p) ? 'text-black' : 'text-gray-200' }`}>
                                                        {
                                                            paymentMembers.includes(p) ? 
                                                            `${currencySymbol} ${paymentData.splitDifferent![p].amt.toFixed(2)}` : 
                                                            `${currencySymbol} 0.00`
                                                        }
                                                    </span>
                                                </div>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                        <div className="flex flex-row justify-between w-full" >
                            <Link href={`${payment}/edit`} className="pl-2 pr-2 p-1 w-fit rounded-sm text-black bg-cyan-200">
                                Edit
                            </Link>
                            <Link href={``} className="pl-2 pr-2 p-1 w-fit rounded-sm text-black bg-gray-200">
                                Delete
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}