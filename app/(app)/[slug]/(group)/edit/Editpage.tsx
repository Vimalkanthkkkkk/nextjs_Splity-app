import Link from "next/link";

export default function EditlayoutPage( {children , slug} : {children : React.ReactNode , slug: string} ){
    return(
        <>
            {children}
            <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-4 shrink">
                <div className="bg-white text-black rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)]  gap-2 flex flex-col w-full h-fit self-center p-4">
                    <span>DANGER ZONE - Delete Event</span>
                    <span>There is no way of retrieving a deleted Event!</span>
                    <Link href={`/${slug}/delete`} className="pl-2 pr-2 p-1 w-fit rounded-sm bg-gray-500">Delete Event</Link>
                </div>
            </div>
        </>
    );
}