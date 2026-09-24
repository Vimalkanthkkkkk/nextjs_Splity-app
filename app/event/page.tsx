import Image from "next/image";
import Link from "next/link";
import AddParticipants from "./AddParticipants";

export default function CreateEvent(){
    return(
        <>
            <section className="bg-gray-200 w-full min-h-screen overflow-y-auto overflow-x-hidden grid grid-cols-6 grid-rows-[80px_auto]">
                <div className="col-start-2 row-start-1 z-10">
                    <Link href="/" className="flex items-center">
                        <Image
                            width={70}
                            height={50}
                            className="items-start"
                            preload
                            loading="eager"
                            src="/noun_bill_5997839_@700.png"
                            alt="Splity logo"
                        />
                        <span className="text-black"> Splity </span>
                    </Link>
                </div>
                <form className="bg-gray-50 wrap-anywhere row-start-2 col-start-2 col-span-2 h-fit w-full flex flex-col gap-y-2 p-2 mb-10" method="GET" action="">
                    <h1 className="text-black"> Create a new Event </h1>
                    <label htmlFor="eventName" className="text-black"> Event Name </label>
                    <input type="text" name="eventName" id="eventName"
                        className="
                            text-black
                            p-2 w-60 max-w-full h-8 border
                            border-gray-600 rounded-sm
                        "
                    />
                    <label htmlFor="currency" className="text-black"> Home Currency</label>
                    <select name="currency" id="currency"
                        className=" *:bg-gray-400 focus:*:bg-gray-700 hover:bg-gray-500
                            mb-2 text-center duration-400 items-center
                            pl-1 pr-2 w-max max-h-max wrap-anywhere bg-gray-400 rounded-sm
                            [appearance:base-select] [&_::picker(select)]:[appearance:base-select]
                        ">
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="AED">AED</option>
                        <option value="GBP">GBP</option>
                        <option value="AFN">AFN</option>
                        <option value="BDT">BDT</option>
                        <option value="CAD">CAD</option>
                        <option value="IDR">IDR</option>
                        <option value="PKR">PKR</option>
                        <option value="PHP">PHP</option>
                        <option value="QAR">QAR</option>
                    </select>
                    <label className="text-black"> Participants </label>
                    <label htmlFor="you" className="text-black"> You </label>
                    <input type="text" name="you" id="you" className="
                            p-2
                            text-black
                            w-60
                            max-w-full
                            h-8
                            border
                            border-gray-600
                            rounded-sm
                        "
                    />
                    <input type="text" name="email" id="email" placeholder="your email (recommended)"
                        className="
                            p-2
                            text-black
                            w-60
                            max-w-full
                            h-8
                            border
                            border-gray-600
                            rounded-sm
                        "
                    />
                    <span className="text-black min-w-auto wrap-break-word">
                        Optionally create an account (recommended).
                        Enter your email and we'll send you a link to
                        log in or register, so you can access this Kitty
                        from any device.
                    </span>
                    <label htmlFor="Person2" className="text-black">Person 2</label>
                    <input type="text" name="Person2" id="Person2"
                        className="
                            p-2
                            text-black
                            w-60
                            max-w-full
                            h-8
                            border
                            border-gray-600
                            rounded-sm
                        "
                    />
                    <AddParticipants />
                    <button type="submit"
                        className="
                            bg-mauve-700
                            p-2
                            w-fit
                            rounded-sm
                            mt-2
                        "
                    >
                        Create Event
                    </button>
                    
                </form>
                <div className="wrap-anywhere text-wrap bg-gray-50 row-start-2 col-start-4 col-span-2 flex flex-col gap-y-2 p-2 mb-10 text-black">
                    <span className="text-2xl">
                        Good examples for creating a Event
                    </span>
                    <div className="flex gap-2">
                        <div className="before: h-12 w-1.5 bg-gray-400 "></div>
                        <span className="text-black">You are organising a bachelorette party or a baby shower.</span>
                    </div>
                </div>
            </section>
        </>
    );
}