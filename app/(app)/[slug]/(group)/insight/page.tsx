import Actions from "@/app/_components/Actions";
import { Props } from "@/app/_types/Props";
import Navigation from "@/app/_components/Navigation";
import BackButton from "@/app/_components/Backbutton";
import { redirect } from "next/navigation";
import { getEvent, getEventInsights } from "@/app/_orm/Queries";
import InsightsCharts from "@/app/_components/InsightCharts";

export default async function InsightPage({params} : Props){
    const {slug} = await params;
    const event = await getEvent(Number(slug));
    if(!event){
        redirect(`/${slug}`)
    }

    const insights = await getEventInsights(event.id);
    const exp = Number(insights.summary.totalSpent).toFixed(2);
    const avg = Number(insights.summary.averageExpense).toFixed(2);
    const exp_cnt = Number(insights.summary.expenseCount).toFixed(2);
    const lrg_exp = Number(insights.summary.largestExpense).toFixed(2);

    return(
        <>
            <Navigation route={`/${slug}`}>
                <Actions eventName={event.event} slug={slug}  />
            </Navigation>
            <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-10 shrink">
                <BackButton route={`/${slug}`} />
                <div className="bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] p-4 gap-10 flex flex-col w-full h-fit self-center">
                    <div className="flex flex-1 text-black items-center justify-between">
                        <span>Insights</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-black">
                        <div className="bg-gray-100 rounded-sm p-4">
                            <span className="text-sm text-gray-500">
                                Total Spent
                            </span>
                            <div className="text-xl font-semibold">
                                {event.currency}{" "}
                                {exp}
                            </div>
                        </div>

                        <div className="bg-gray-100 rounded-sm p-4">
                            <span className="text-sm text-gray-500">
                                Average Expense
                            </span>
                            <div className="text-xl font-semibold">
                                {event.currency}{" "}
                                {avg}
                            </div>
                        </div>

                        <div className="bg-gray-100 rounded-sm p-4">
                            <span className="text-sm text-gray-500">
                                Expenses
                            </span>
                            <div className="text-xl font-semibold">
                                {exp_cnt}
                            </div>
                        </div>

                        <div className="bg-gray-100 rounded-sm p-4">
                            <span className="text-sm text-gray-500">
                                Largest Expense
                            </span>
                            <div className="text-xl font-semibold">
                                {event.currency}{" "}
                                {lrg_exp}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-1 text-black bg-gray-400 rounded-sm items-center p-4 justify-between">
                        <InsightsCharts insights={insights} currency={event.currency} />
                    </div>  
                </div>
            </div>
        </>
    );
}