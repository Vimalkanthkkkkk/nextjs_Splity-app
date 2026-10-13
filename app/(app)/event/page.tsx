import Image from "next/image";
import Link from "next/link";
import AddParticipants from "@/app/_components/AddParticipants";
import { createEventAction } from "@/app/_orm/CreateEvent";
import CurrencySelect from "@/app/_components/CurrencySelect";
import ActionForm from "@/app/_components/ActionForm";
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
                <ActionForm
                    action={createEventAction}
                    submitLabel="Create Event"
                    useIdempotencyKey
                    savingString="Creating"
                    submitButtonColorString="bg-cyan-200"
                    className="bg-gray-50 wrap-anywhere 
                        row-start-2 col-start-2 col-span-2 
                        h-fit w-full flex flex-col 
                        gap-y-2 p-2 mb-10 not-md:col-span-4 not-md:col-start-2
                    "
                >
                    <h1 className="text-black"> Create a new Event </h1>
                    <label htmlFor="eventName" className="text-black"> Event Name </label>
                    <input required min={3} type="text" name="eventName" id="eventName"
                        className="
                            text-black
                            p-2 w-60 max-w-full h-8 border
                            border-gray-600 rounded-sm
                        "
                    />
                    <label htmlFor="currency" className="text-black"> Home Currency</label>
                    <CurrencySelect/>
                    <label className="text-black"> Participants </label>
                    <label htmlFor="you" className="text-black"> You </label>
                    <input type="text" required name="you" id="you" className="
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
                    <input type="email" name="email" id="email" placeholder="your email (recommended)"
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
                    <input required min={3} type="text" name="Person2" id="Person2"
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
                </ActionForm>
                <div className="wrap-anywhere text-wrap bg-gray-50 row-start-2 col-start-4 col-span-2 hidden md:flex flex-col gap-y-2 p-2 mb-10 text-black">
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