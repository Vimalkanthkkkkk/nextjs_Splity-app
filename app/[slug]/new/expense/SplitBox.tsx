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
                <div className="
                        hidden
                        peer-checked/split-amount:block
                ">
                    <ul className="flex flex-col gap-2">
                        <li className="flex justify-between gap-1 pl-2 pr-2">
                            <label className="text-black flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="spilt-amount-all"
                                    className="accent-gray-400"
                                />
                                all
                            </label>
                        </li>
                        <li className="flex flex-col justify-between border-t p-2">
                            <label className="text-black text-sm flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="amount-vimal-f"
                                    className="accent-gray-400"
                                />
                                Vimal
                            </label>
                            <div>
                                <span className="inline text-black border-t border-l border-b p-2 border-gray-600 rounded-tl-sm rounded-bl-sm">$</span>
                                <input type="number" name="vimal-amount" className="
                                    p-2 text-black
                                    w-54 max-w-full outline-none
                                    h-8 border-r border-t border-b
                                    border-gray-600 rounded-tr-sm rounded-br-sm
                                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                    [&::-webkit-inner-spin-button]:appearance-none
                                "/>
                            </div>
                        </li>
                        <li className="flex flex-col justify-between border-t p-2">
                            <label className="text-black text-sm flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="amount-kavi-f"
                                    className="accent-gray-400"
                                />
                                Kavi
                            </label>
                            <div>
                                <span className="inline text-black border-t border-l border-b p-2 border-gray-600 rounded-tl-sm rounded-bl-sm">$</span>
                                <input type="number" name="amount-kavi"
                                    className="p-2 text-black
                                    w-54 max-w-ful outline-none
                                    h-8 border-r border-t border-b
                                    border-gray-600 rounded-tr-sm rounded-br-sm
                                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                    [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>    
                        </li>
                    </ul>
                </div>
                <div
                    className="
                        hidden
                        peer-checked/shares:block
                ">
                    <ul className="flex flex-col gap-2">
                        <li className="flex justify-between gap-1 pl-2 pr-2">
                            <label className="text-black flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="shares-all"
                                    className="accent-gray-400"
                                />
                                all
                            </label>
                        </li>
                        <li className="flex flex-col justify-between border-t p-2">
                             <label className="text-black text-sm flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="share-vimal-f"
                                    className="accent-gray-400"
                                />
                                Vimal
                            </label>
                            <div>
                                <input type="number" name="share-vimal" className="
                                    p-2 text-black
                                    w-54 max-w-full outline-none
                                    h-8 border-l border-t border-b
                                    border-gray-600 rounded-tl-sm rounded-bl-sm
                                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                    [&::-webkit-inner-spin-button]:appearance-none
                                "/>
                            <span className="inline text-black border-t border-r border-b p-2 border-gray-600 rounded-tr-sm rounded-br-sm">$</span>
                            </div>
                        </li>
                        <li className="flex flex-col justify-between border-t p-2">
                            <label className="text-black text-sm flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="share-kavi-f"
                                    className="accent-gray-400"
                                />
                                Kavi
                            </label>
                            <div>
                                <input type="number" name="share-kavi"
                                    className="p-2 text-black
                                    w-54 max-w-ful outline-none
                                    h-8 border-l border-t border-b
                                    border-gray-600 rounded-tl-sm rounded-bl-sm
                                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                    [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <span className="inline text-black border-t border-r border-b p-2 border-gray-600 rounded-tr-sm rounded-br-sm">$</span>
                            </div>
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
                        <li className="flex justify-between gap-1 pl-2 pr-2">
                            <label className="text-black flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="percent-all"
                                    className="accent-gray-400"
                                />
                                all
                            </label>
                        </li>
                        <li className="flex flex-col justify-between border-t p-2">
                            <label className="text-black text-sm flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="per-vimal-f"
                                    className="accent-gray-400"
                                />
                                Vimal
                            </label>
                            <div>
                                <input type="number" name="percent-vimal" className="
                                    p-2 text-black
                                    w-54 max-w-full outline-none
                                    h-8 border-l border-t border-b
                                    border-gray-600 rounded-tl-sm rounded-bl-sm
                                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                    [&::-webkit-inner-spin-button]:appearance-none
                                "/>
                                <span className="inline text-black border-t border-r border-b p-2 border-gray-600 rounded-tr-sm rounded-br-sm">%</span>
                            </div>
                        </li>
                        <li className="flex flex-col justify-between border-t p-2">
                            <label className="text-black text-sm flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="per-kavi-f"
                                    className="accent-gray-400"
                                />
                                Kavi
                            </label>
                            <div>
                                <input type="number" name="percent-kavi"
                                    className="p-2 text-black
                                    w-54 max-w-ful outline-none
                                    h-8 border-l border-t border-b
                                    border-gray-600 rounded-tl-sm rounded-bl-sm
                                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                    [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <span className="inline text-black border-t border-r border-b p-2 border-gray-600 rounded-tr-sm rounded-br-sm">%</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}