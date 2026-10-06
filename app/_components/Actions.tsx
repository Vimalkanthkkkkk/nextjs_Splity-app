import Link from "next/link";

type Actionprops ={
    eventName : string;
    slug : string
}

export default function Actions({eventName , slug} : Actionprops){
    return(
        <div className="relative inline-block text-left group">
            <button 
                type="button" 
                className="duration-400 inline-flex items-center justify-between px-4 py-2 text-white rounded-md cursor-pointer transition-colors focus:outline-none"
            >
                {eventName}
                <span className="ml-2 text-xs transition-transform duration-300 pointer-events-none group-focus-within:rotate-180">▼</span>
            </button>
            <ul className="absolute z-10 -right-12 mt-2 w-48 p-2
                    origin-top-right rounded-md bg-white border border-slate-200 
                    shadow-lg ring-1 ring-black/5 opacity-0 invisible 
                    scale-95 transition-all duration-200 pointer-events-none 
                    group-focus-within:opacity-100 [&_button]:rounded-sm
                    group-focus-within:invisible-none group-focus-within:scale-100 
                    group-focus-within:pointer-events-auto">
                <li className="w-full">
                    <Link href={`/${slug}/edit`} className="w-full text-left px-4 pr-24 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                        Edit Event
                    </Link>
                </li>
                <li>
                    <Link href={`/${slug}/invite`} className="w-full text-left px-4 pr-18 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                        Invite to Event
                    </Link>
                </li>
                <li>
                    <Link href={`/${slug}/manage`} className="w-full text-left px-4 pr-11 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                        Manage Participant
                    </Link>
                </li>
                <li>
                    <Link href={`/${slug}/insight`} className="w-full text-left px-4 pr-28 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                        insights
                    </Link>
                </li>
                <li>
                    <Link href={`/${slug}`} className="w-full text-left px-4 pr-12 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                        Export as Excel file
                    </Link>
                </li>
                <li>
                    <Link href={`/${slug}/history`} className="w-full text-left px-4 pr-21 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                        Show history
                    </Link>
                </li>
            </ul>
        </div>
    );
}