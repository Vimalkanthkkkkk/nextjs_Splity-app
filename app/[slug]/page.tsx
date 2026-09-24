
export default async function EventsMainPage({params}: {params: Promise<{ slug: string }>}){
    const { slug } = await params
    return(
        <div className="flex pb-2 flex-1 gap-2 flex-col justify-between bg-white overflow-y-scroll">
            <div className="bg-gray-600 grid grid-cols-8 grid-rows-1 w-full h-20"></div>
            <div className="bg-amber-500 w-100 h-50 self-center"></div>
            <div className="bg-amber-300 w-100 h-10 self-center"></div>
            <div className="bg-amber-300 w-100 h-10 self-center"></div>
            <div className="bg-amber-300 gap-2 flex flex-col w-100 h-fit self-center p-4">
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
            <div className="bg-amber-300 gap-2 flex flex-col w-100 h-fit self-center p-4">
                    <div className="flex flex-1 items-center justify-between">
                        <span className="">How to settle all debts</span>
                        <span className="">Overview</span>
                    </div>
                <span>For families or couples who share their balance</span>
            </div>
            <div className="bg-amber-300 gap-2 flex flex-col w-100 h-fit self-center p-4">
                    <div className="flex flex-1 items-center justify-between">
                        <span className="">Who has seen this Event?</span>
                    </div>
                <span>For families or couples who share their balance</span>
            </div>
        </div>
    );
}