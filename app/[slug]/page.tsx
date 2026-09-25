import Image from "next/image";

export default async function EventsMainPage({params}: {params: Promise<{ slug: string }>}){
    const { slug } = await params
    return(
        <div className="flex pb-2 flex-1 gap-2 flex-col shrink w-auto h-auto justify-between bg-white overflow-y-scroll">
            <nav role="navigation" className="bg-gray-600 w-full">
                <div className="mx-auto w-3xl ">
                    <Image
                        width={0} height={0}
                        style={{ width: '50px', height: '50px' }}
                        className="self-center col-start-2 col-end-3"
                        preload
                        loading="eager"
                        src="/noun_bill_5997839_@700.png"
                        alt="Splity logo"
                    />
                </div>
            </nav>
            <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-4 shrink">
                <div className="bg-amber-500 w-full h-50 self-center relative ">
                    <Image width={0} height={0} sizes="100vw" style={{ width: "100%", height: '100%' , objectFit: "fill" }} className="items-start" preload loading="eager" src="/split.jpeg" alt="Splity logo" />
                </div>
                <div className="bg-amber-300 w-full h-10 self-center"></div>
                <div className="bg-amber-300 w-full h-10 self-center"></div>
                <div className="bg-amber-300 gap-2 flex flex-col w-full h-fit self-center p-4">
                    <div className="flex flex-1 bg-gray-400 items-center justify-between">
                        <span className="pl-2 ">Overview</span>
                        <span className="pr-2">Overview</span>
                    </div>
                    <span>For families or couples who share their balance, set up default shares.</span>
                    <hr className="w-full bg-gray-950 h-1"/>  
                    <div className="bg-gray-400">
                        <div className="flex flex-1 items-center justify-between">
                            <span className="pl-2 ">Overview</span>
                            <span className="pr-2">Overview</span>
                        </div>
                        <div className="flex flex-1  items-center justify-between">
                            <span className="pl-2 ">Overview</span>
                            <span className="pr-2">Overview</span>
                        </div>
                        <div className="flex flex-1  items-center justify-between">
                            <span className="pl-2 ">Overview</span>
                            <span className="pr-2">Overview</span>
                        </div>
                        <div className="flex flex-1 items-center justify-between">
                            <span className="pl-2 ">Overview</span>
                            <span className="pr-2">Overview</span>
                        </div>   
                    </div>
                    <div className="flex flex-1 flex-row self-end">
                        <button type="submit" className="mr-2 p-1 bg-gray-200">View Expenses</button>
                        <button type="submit" className="bg-gray-400 p-1">Add Expenses</button>
                    </div>
                </div>
                <div className="bg-amber-300 gap-2 flex flex-col w-full h-fit self-center p-4">
                        <div className="flex flex-1 items-center justify-between">
                            <span className="">How to settle all debts</span>
                            <span className="">Overview</span>
                        </div>
                    <span>For families or couples who share their balance</span>
                </div>
                <div className="bg-amber-300 gap-2 flex flex-col w-full h-fit self-center p-4">
                        <div className="flex flex-1 items-center justify-between">
                            <span className="">Who has seen this Event?</span>
                        </div>
                    <span>For families or couples who share their balance</span>
                </div>
            </div>
            
        </div>
    );
}