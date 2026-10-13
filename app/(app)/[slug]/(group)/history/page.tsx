import Actions from "@/app/_components/Actions";
import Navigation from "@/app/_components/Navigation";
import BackButton from "@/app/_components/Backbutton";
import { decodeHistoryCursor, encodeHistoryCursor } from "@/app/_components/utils";
import { getEvent, getHistory } from "@/app/_orm/Queries";
import Link from "next/link";

interface HistoryProps {
  params: Promise<{ slug: string; }>;
  searchParams: Promise<{
    cursor?: string;
    direction?: "next" | "previous";
  }>;
}

export default async function HistoryPage({params , searchParams} : HistoryProps){
    const {slug} = await params;
    const {cursor , direction } = await searchParams;
    const page_cursor = cursor
      ? decodeHistoryCursor(cursor)
      : undefined;

    const dir = direction === "previous"
        ? "previous"
        : "next";

    const event = await getEvent(Number(slug));

    if(!event){
        return;
    }
    const {
        data,
        hasPreviousPage,
        hasNextPage,
        previousCursor,
        nextCursor,
    } = await getHistory( event.id, page_cursor, dir );

    const previousCursorValue = previousCursor
        ? encodeHistoryCursor(previousCursor)
        : null;

    const nextCursorValue = nextCursor
        ? encodeHistoryCursor(nextCursor)
        : null;

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
                        {data.map((item) => {
                            const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
                            return <li key={item.id}>
                                <div className="flex flex-1 h-full items-center bg-gray-300">
                                    <div className="w-1.5 self-stretch" style={{ backgroundColor: randomColor }}></div>
                                    <div className="p-2 pl-4 pb-6 flex flex-col self-center">
                                        <span className="pb-4">
                                            {item.action}
                                        </span>
                                        <span className="pb-1">
                                            {
                                                item.payment
                                                ? `${item.payment.whospayment} paid ${item.payment.howMuch} for ${item.payment.whatFor}`
                                                : "Payment deleted"
                                            }
                                        </span>
                                        <span>
                                            {
                                                item.createdAt.toLocaleString()
                                            }
                                        </span>
                                    </div>
                                    <div className="p-2 flex self-stretch flex-col justify-between flex-1">
                                        <span className="self-end">
                                            {
                                                item.createdAt.toLocaleString()
                                            }
                                        </span>
                                        <span className="self-end">
                                            by { item.payment?.whospayment ?? "unknown" }
                                        </span>
                                    </div>

                                </div>
                            </li>
                        })}
                    </ul>
                    <div className="flex justify-between">
                        {
                            hasPreviousPage && previousCursorValue && (
                                <Link href={`/${slug}/history?cursor=${previousCursorValue}&direction=previous`}>
                                    Previous
                                </Link>
                            )
                        }
                        {
                            hasNextPage && nextCursorValue && (
                                <Link href={`/${slug}/history?cursor=${nextCursorValue}&direction=next`}>
                                    Next
                                </Link>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}