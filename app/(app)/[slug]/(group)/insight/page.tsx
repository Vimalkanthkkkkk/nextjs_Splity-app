import Actions from "@/app/_components/Actions";
import { Props } from "@/app/_types/Props";
import Navigation from "@/app/_components/Navigation";
import BackButton from "@/app/_components/Backbutton";

export default async function InsightPage({params} : Props){
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
                        <span>Insights</span>
                    </div>
                    <div className="flex flex-1 text-black bg-gray-400 rounded-sm items-center p-4 justify-between">
                    </div>  
                </div>
            </div>
        </>
    );
}