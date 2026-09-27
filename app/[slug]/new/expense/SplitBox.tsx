"use client"
import { ReactNode, useState } from "react";

export default function SplitBox() : ReactNode{
    const [option , setoption] = useState<string[]>(["Eql" , "Amt" , "Shr" , "Prc"]);

    return(
        <>
            <div className="flex gap-2 text-center text-wrap">
                <input 
                    type="radio" id="split" name="split" value="Equal" 
                    className="text-black outline-none border-0 accent-gray-400"
                />
                <label htmlFor="split" className="text-black self-center inline mt-2">Split Equally between Everyone</label>
            </div>
            <div className="flex gap-2 text-center text-wrap">
                <input 
                    type="radio" id="split" name="split" value="diff" 
                    className="text-black outline-none border-0 accent-gray-400"
                />
                <label htmlFor="split" className="text-black self-center inline mt-1 mb-1">Split differently</label>
            </div>
            <div className="w-fit border-2">
                <input
                    type="radio"
                    id="equally"
                    name="splitType"
                    value="equally"
                    defaultChecked
                    className="peer/equally sr-only"
                />
                <input
                    type="radio"
                    id="splitamount"
                    name="splitType"
                    value="amount"
                    className="peer/split-amount sr-only"
                />
                <input
                    type="radio"
                    id="shares"
                    name="splitType"
                    value="shares"
                    className="peer/shares sr-only"
                />
                <input
                    type="radio"
                    id="percent"
                    name="splitType"
                    value="percent"
                    className="peer/percent sr-only"
                />
                <div className="flex flex-row text-black gap-10 p-2">
                    <label
                        htmlFor="equally"
                        className="cursor-pointer
                                peer-checked/equally:font-bold
                                peer-checked/equally:underline"
                    >
                        Equally
                    </label>
                    <label
                        htmlFor="splitamount"
                        className="cursor-pointer
                                peer-checked/split-amount:font-bold
                                peer-checked/split-amount:underline"
                    >
                        Amount
                    </label>
                    <label
                        htmlFor="shares"
                        className="cursor-pointer
                                peer-checked/shares:font-bold
                                peer-checked/shares:underline"
                    >
                        Shares
                    </label>
                    <label
                        htmlFor="percent"
                        className="cursor-pointer
                                peer-checked/percent:font-bold
                                peer-checked/percent:underline"
                    >
                        Percent
                    </label>
                </div>
                <div
                    className="
                        hidden
                        peer-checked/equally:block
                    "
                >
                    <ul className="flex flex-col gap-2">

                        <li className="flex justify-between gap-1 pl-2 pr-2">
                            <label className="text-black flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="equally-all"
                                    className="accent-gray-400"
                                />
                                all
                            </label>

                            <span className="text-black text-[12px] self-center">
                                e.g. stays in a vacation home
                            </span>
                        </li>

                        <li className="flex justify-between gap-1 border-t p-2">
                            <label className="text-black text-sm flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="equally-vimal"
                                    className="accent-gray-400"
                                />
                                Vimal
                            </label>

                            <span className="text-black text-[12px]">
                                = 5000
                            </span>
                        </li>

                        <li className="flex justify-between gap-1 border-t p-2">
                            <label className="text-black text-sm flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="equally-kavi"
                                    className="accent-gray-400"
                                />
                                Kavi
                            </label>

                            <span className="text-black text-[12px]">
                                = 5000
                            </span>
                        </li>

                    </ul>
                </div>
                <div
                    className="
                        hidden
                        peer-checked/split-amount:block
                    "
                >
                    <ul className="flex flex-col gap-2">
                        <li className="flex justify-between border-t p-2">
                            <span className="text-black">
                                Vimal
                            </span>

                            <input
                                type="number"
                                name="amount-vimal"
                                className="w-24 border text-black"
                            />
                        </li>

                        <li className="flex justify-between border-t p-2">
                            <span className="text-black">
                                Kavi
                            </span>

                            <input
                                type="number"
                                name="amount-kavi"
                                className="w-24 border text-black"
                            />
                        </li>

                    </ul>
                </div>
                <div
                    className="
                        hidden
                        peer-checked/shares:block
                    "
                >
                    <ul className="flex flex-col gap-2">

                        <li className="flex justify-between border-t p-2">
                            <span className="text-black">
                                Vimal
                            </span>

                            <input
                                type="number"
                                name="shares-vimal"
                                className="w-24 border text-black"
                            />
                        </li>

                        <li className="flex justify-between border-t p-2">
                            <span className="text-black">
                                Kavi
                            </span>

                            <input
                                type="number"
                                name="shares-kavi"
                                className="w-24 border text-black"
                            />
                        </li>

                    </ul>
                </div>
                <div
                    className="
                        hidden
                        peer-checked/percent:block
                    "
                >
                    <ul className="flex flex-col gap-2">

                        <li className="flex justify-between border-t p-2">
                            <span className="text-black">
                                Vimal
                            </span>

                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    name="percent-vimal"
                                    className="w-24 border text-black"
                                />
                                <span className="text-black">%</span>
                            </div>
                        </li>

                        <li className="flex justify-between border-t p-2">
                            <span className="text-black">
                                Kavi
                            </span>

                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    name="percent-kavi"
                                    className="w-24 border text-black"
                                />
                                <span className="text-black">%</span>
                            </div>
                        </li>

                    </ul>
                </div>
            </div>
        </>
    );
}