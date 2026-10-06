import CategoryDropdown from "@/app//_components/CategorydropDown";
import Navigation from "@/app/_components/Navigation";
import Participants from "@/app/_components/Participants";
import SplitBox from "@/app//_components/SplitBox";
import { createEventAction } from "@/app/_orm/CreateExpenses";
import { getpayment } from "@/app/_orm/Queries";
import { redirect } from "next/navigation";
import Actions from "@/app/_components/Actions";
import BackButton from "@/app/_components/Backbutton";

interface PageProps {
  params: Promise<{
    slug: string;
    payment: string;
  }>;
}

export default async function ExpenseEditPage( {params } : PageProps){
    const { payment , slug } = await params;
    const paymentData = await getpayment(Number(payment));
    if(!paymentData){
        redirect(`/${slug}/entries`)
    }
    const splitType = paymentData.type;
    return(
        <>
            <Navigation route={`/${slug}`}>
                <Actions eventName={paymentData.event.event} slug={slug}  />
            </Navigation>
            <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-10 shrink">
                <BackButton route={`/${slug}/entries`} />
                <div className="bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] p-4 gap-10 flex flex-col w-full h-fit self-center">
                    <form action={createEventAction}>
                        <input type="hidden"
                            name="event_id"
                            value={slug}
                        />
                        <input type="hidden"
                            name="type"
                            value={splitType}
                        />
                        <span className="text-black">Who Paid for it?</span>
                        <Participants split={splitType} participants={ paymentData.event.participants} edit={false} />
                        <div className="grid grid-cols-12 grid-rows-2">
                            <label htmlFor="amount" className="text-black block col-span-3 mt-2 mb-1">How much?</label>
                            <span className="text-black row-start-2 h-8 border-t border-l border-b w-full p-1 border-gray-600 rounded-tl-sm rounded-bl-sm">$</span>
                            <input type="number" name="amount" id="amount" placeholder="Amount" 
                                value={paymentData.howMuch}
                                className="
                                    p-2 text-black row-start-2 col-start-2 col-end-9
                                    max-w-full outline-none
                                    h-8 border-r border-t border-b
                                    border-gray-600 rounded-tr-sm rounded-br-sm
                                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                            "/>
                        </div>
                        {
                            splitType !== "transfer" ?
                                <>
                                    <label htmlFor="category" className="text-black block mt-3">Which Category?</label>
                                    <CategoryDropdown/>
                                </>
                                :
                                <></>
                        }
                        
                        <label htmlFor="date" className="text-black block mt-2 mb-1">When?</label>
                        <input type="date" name="date" id="date" placeholder="Amount" 
                            value={paymentData.when.toString()}
                            className="
                                p-2 text-black outline-none
                                max-w-full
                                h-8 border
                                border-gray-600 rounded-sm
                        "/>
                        <label htmlFor="notes" className="text-black block mt-2 mb-1">Any Notes</label>
                        <textarea name="notes" rows={1} cols={3} id="notes" value={paymentData.notes ? paymentData.notes : ''} 
                            placeholder="eg.who had what or a receipt number" 
                            className="
                                p-2 text-black outline-none field-sizing-content 
                                w-60 h-fit 
                                border
                                border-gray-600 rounded-sm
                        "></textarea>

                        {
                            splitType !== "transfer" ?
                                <>
                                    <label htmlFor="attach" className="text-black block mt-2 mb-1">Any Attachment ?</label>
                                    <input 
                                        type="file" 
                                        name="attach" 
                                        id="attach" 
                                        accept="image/jpeg" 
                                        className="
                                            text-gray-700 outline-none border-0
                                            w-60 max-w-full 
                                            h-8 
                                        "
                                    />
                                    <SplitBox participants={ paymentData.event.participants}/>
                                </>
                                :
                                <></>
                        }      

                        {
                            splitType === "transfer" ? 
                            <>
                                <label className="text-black block mt-2 mb-1">To whom?</label>
                                <div className="flex gap-2 text-center text-wrap radio-group">
                                    {
                                        paymentData.event.participants.map((p , idx) => {
                                            return(
                                                <>
                                                    <input type="radio" id={`whom-${p}`} name="whom" defaultChecked value={p} 
                                                        className="text-black  outline-none border-0 accent-gray-400"
                                                    />
                                                    <label htmlFor={`whom-${p}`} className="text-black self-center mt-1">{p}</label>
                                                </>
                                            );
                                        })
                                    }
                                </div>
                            </>
                            :
                            <>
                            </>
                        }
                        <div className="flex gap-4 mt-6">
                            <button type="submit" className="pl-2 pr-2 p-1 w-fit rounded-sm text-black bg-cyan-200">Save</button>
                        </div>
                    </form> 
                </div>
            </div>
        </>
    );
}