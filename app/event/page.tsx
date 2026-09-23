import Image from "next/image";
import Link from "next/link";

export default function CreateEvent(){
    return(
        <>
        <section className="bg-gray-200 w-full h-300 grid grid-cols-6 grid-rows-[80_1fr_1fr_1fr_1fr_1fr_1fr]">
            <div className="col-start-2 z-10">
                <Link href={"/"} className="flex items-center ">
                    <Image width={70} height={50} className="items-start" preload loading="eager" src={"/noun_bill_5997839_@700.png"} alt="Splity logo"/>
                    <span className="text-black">Splity</span>
                </Link>
            </div>
            <form className="bg-gray-50 flex flex-1 flex-col gap-y-2 p-2 row-start-2 col-start-2 col-span-4 row-span-full" action="">
                <h1 className="text-black">Create a new Event</h1>
                <label htmlFor="eventName" className="text-black">Event Name</label>
                <input type="text" name="eventName" id="eventName" className="text-black p-2 w-60 h-8 border border-gray-600 rounded-sm" />
                <label htmlFor="currency" className="text-black">Home Currency</label>
                <select name="" id="currency" className="*:bg-gray-400 focus:*:bg-gray-700 hover:bg-gray-500 mb-2 text-center duration-400 items-center pl-1 pr-2 w-18 h-8 bg-gray-400 rounded-sm [appearance:base-select] [&_::picker(select)]:[appearance:base-select]">
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
                <label className="text-black">Participants</label>
                <label htmlFor="you" className="text-black">You</label>
                <input type="text" name="you" id="you" className="p-2 text-black w-60 h-8 border border-gray-600 rounded-sm" />
                <input type="text" name="email" id="email" placeholder="your email (recommended)" className="p-2 text-black w-60 h-8 border border-gray-600 rounded-sm" />
                <span className="text-black text-wrap w-60">
                    Optionally create an account (recommended). Enter your email and we'll send you a link to log in or register, so you can access this Kitty from any device.
                </span>
            </form>
        </section>
        </>
    );
}