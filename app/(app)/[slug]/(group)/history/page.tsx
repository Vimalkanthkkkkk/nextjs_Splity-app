import Actions from "@/app/_components/Actions";
import Navigation from "@/app/_components/Navigation";
import { Props } from "@/app/_types/Props";
import BackButton from "@/app/_components/Backbutton";

export default async function HistoryPage({params} : Props){
    const {slug} = await params;
    return(
        <>
            <Navigation route={`/${slug}`}>
                <Actions eventName={event.event} slug={slug}  />
            </Navigation>
            <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-10 shrink">
                <BackButton route={`/${slug}`} />
                <div className="bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] p-4 gap-10 flex flex-col w-full h-fit self-center">
                    <div className="flex flex-1 text-black items-center justify-between">
                        <span>History</span>
                    </div> 
                    <ul className="list-none gap-4 flex flex-col text-black ">
                        <li>
                            <div className="flex flex-1 h-full items-center bg-gray-300">
                                <div className="w-1.5 self-stretch bg-amber-400"></div>
                                <div className="p-2 pl-4 pb-6 flex flex-col self-center">
                                    <span className="pb-4">Expenses Updated</span>
                                    <span className="pb-1">onl paid €25,896.00 for vvv</span>
                                    <span>2026-09-24 :: oe: €12,948.00, onl: €12,948.00</span>
                                </div>
                                <div className="p-2 flex self-stretch flex-col justify-between flex-1">
                                    <span className="self-end">26 minutes ago</span>
                                    <span className="self-end">by vvv</span>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="flex flex-1 h-full items-center bg-gray-300">
                                <div className="w-1.5 self-stretch bg-amber-400"></div>
                                <div className="p-2 pl-4 pb-6 flex flex-col self-center">
                                    <span className="pb-4">Expenses Updated</span>
                                    <span className="pb-1">onl paid €25,896.00 for vvv</span>
                                    <span>2026-09-24 :: oe: €12,948.00, onl: €12,948.00</span>
                                </div>
                                <div className="p-2 flex self-stretch flex-col justify-between flex-1">
                                    <span className="self-end">26 minutes ago</span>
                                    <span className="self-end">by vvv</span>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="flex flex-1 h-full items-center bg-gray-300">
                                <div className="w-1.5 self-stretch bg-amber-400"></div>
                                <div className="p-2 pl-4 pb-6 flex flex-col self-center">
                                    <span className="pb-4">Expenses Updated</span>
                                    <span className="pb-1">onl paid €25,896.00 for vvv</span>
                                    <span>2026-09-24 :: oe: €12,948.00, onl: €12,948.00</span>
                                </div>
                                <div className="p-2 flex self-stretch flex-col justify-between flex-1">
                                    <span className="self-end">26 minutes ago</span>
                                    <span className="self-end">by vvv</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}