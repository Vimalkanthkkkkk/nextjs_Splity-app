"use client"
import { ReactNode, useEffect, useState  } from "react";

export default function SplitBox() : ReactNode{
    const participants = ["vimal" , "kavi"];
    const TOTAL_PARTICIPANTS = 2;
    const [option , setoption] = useState<boolean>(true);
    const [amount, setAmount] = useState<string>('');
    const [all, setAll] = useState<boolean>(true);
    const [total, settotal] = useState<number>(TOTAL_PARTICIPANTS);
    

    const selectSplitMethod = () => {
        setoption(p => { return !p });
    }

    function isFloat(value : number) {
        return typeof value === 'number' && !Number.isInteger(value);
    }

    function hasThreeOrMoreDecimals(num : number) {
        const numStr = num.toString();
        if (numStr.includes('.')) {
            const decimalPlaces = numStr.split('.')[1].length;
            return decimalPlaces >= 3;
        }
        return false;
    }

    const participants_amount_elements = participants.map((p) => {
        if (typeof window !== 'undefined') {
            return document.getElementsByClassName(`${p}-amount`)[0] as HTMLInputElement;
        }
    });

    const participants_share_elements = participants.map((p) => {
        if (typeof window !== 'undefined') {
            return document.getElementsByClassName(`share-${p}`)[0] as HTMLInputElement;
        }
    });

    const participants_percent_elements = participants.map((p) => {
        if (typeof window !== 'undefined') {
            return document.getElementsByClassName(`percent-${p}`)[0] as HTMLInputElement;
        }
    });

    const participants_equal_elements = participants.map((p) => {
        if (typeof window !== 'undefined') {
            return document.getElementsByClassName(`equally-${p}`)[0] as HTMLInputElement;
        }
    });

    const handleEqual = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextTotal = event.target.checked
            ? total + 1
            : total - 1;
        settotal(nextTotal);
        const elements = participants.map((p) =>
                document.getElementsByClassName(`equally-${p}`)[0] as HTMLInputElement
            ).filter((el): el is HTMLInputElement => !!el);
        elements.forEach((p) => {
            const span = p.parentElement!.nextElementSibling as HTMLSpanElement;
            if (p.checked) {
                const calculated = nextTotal > 0
                        ? (parseFloat(amount) / nextTotal).toFixed(2)
                        : "0.00";
                span.textContent = `= $ ${calculated}`;
            } else {
                span.textContent = "";
            }
        });
    };

    const handleAmount = (event : React.ChangeEvent<HTMLInputElement>) => {
        let final_value = 0;
        const target = event.target;
        const target_value = parseFloat(target.value);
        const float_amount = parseFloat(amount);
        participants_amount_elements.forEach( ele => {
            if(ele === target){
                final_value = isFloat(target_value) ? target_value : parseInt(target.value);
            }else{
                const result = final_value > float_amount ? 
                    0 : 
                    float_amount - ( hasThreeOrMoreDecimals(final_value) ? float_amount : final_value );
                ele!.value = result <= 0 || result > float_amount ? '' : result.toString()
            }
        })
    };

    const handleShare = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const others_share = participants_share_elements.reduce((pre, cur) => {
            return pre + (
                cur !== target
                    ? parseFloat(cur!.value) || 0
                    : 0
            );
        }, 0);
        const share_result = parseFloat(target.value || '0') + others_share;
        participants_share_elements.forEach((ele) => {
            const share = parseFloat(ele!.value) || 0;
            const shr_amount = share_result > 0
                    ? ((share / share_result) * parseFloat(amount)).toFixed(2)
                    : "";
            ele!.nextElementSibling!
                .nextElementSibling!
                .textContent = `= $ ${shr_amount}`;
        });
    };

    const handlePercent = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const target_value = parseFloat(target.value);
        const float_amount = parseFloat(amount);
        const per_res = isFloat(target_value) ? 
                    (float_amount * ((target_value || 0 / 100) )).toFixed(2) : 
                    (float_amount * (0.01 * target_value) ).toFixed(2) || 0;
        participants_percent_elements.forEach( ele => {
            if(ele === target){
                ele.nextElementSibling!.nextElementSibling!.textContent = `= $ ${per_res}`
            }else{
                const bal_per = (100 - target_value) || 100;
                ele!.value = bal_per.toFixed(2).toString();
                const others_res = float_amount * ((0.01 * bal_per) / (participants_percent_elements.length - 1));
                ele!.nextElementSibling!.nextElementSibling!.textContent = `= $ ${others_res.toFixed(2)}`
            }
        })
    }

    useEffect(() => {
        const input = document.getElementById("amount") as HTMLInputElement;
        if (!input) return;
        const handleInput = () => {
            const newAmount = input.value;
            setAmount(newAmount);
            participants_amount_elements.forEach((i) => {
                i!.value = newAmount ;
            });
            const calculated = total > 0
                ? (parseFloat(newAmount) / total).toFixed(2)
                : "0.00";
            participants.forEach((p) => {
                const input = document.getElementsByClassName(`equally-${p}`)[0] as HTMLInputElement;
                if (!input) return;
                const span = input.parentElement!.nextElementSibling as HTMLSpanElement;
                if (input.checked) {
                    span.textContent = `= $ ${calculated}`;
                }else {
                    span.textContent = "";
                }
            });
        };
        input.addEventListener("input", handleInput);
        return () => {
            input.removeEventListener("input", handleInput);
        };
    }, []);

    return(
        <>
            <div className="flex gap-2 text-center text-wrap">
                <input 
                    type="radio" id="split-ery-equally" name="split-method" onChange={selectSplitMethod} defaultChecked value="Equal-ery" 
                    className="text-black outline-none border-0 accent-gray-400"
                />
                <label htmlFor="split-ery-equally" className="text-black self-center inline mt-2">Split Equally between Everyone</label>
            </div>
            <div className="flex gap-2 text-center text-wrap">
                <input 
                    type="radio" id="split-diff" name="split-method" onChange={selectSplitMethod}  value="diff-ery" 
                    className="text-black outline-none border-0 accent-gray-400"
                />
                <label htmlFor="split-diff" className="text-black self-center inline mt-1 mb-1">Split differently</label>
            </div>
            <div className=" flex-col gap-2 mb-4 text-black" style={{ display: option===true ? "flex" : "none" }}>
                <span>Summary</span>
                <span>Equally between Everyone</span>
                <ul className="flex flex-col gap-2">
                    <li className="grid grid-cols-2 wrap-anywhere gap-0">
                        <label className="text-black text-sm flex gap-2 items-center">
                            Vimal
                        </label>
                        <span className="text-black text-[12px]">
                            5000
                        </span>
                    </li>
                    <li className="grid grid-cols-2 wrap-anywhere gap-0">
                        <label className="text-black text-sm flex gap-2 items-center">
                            Kavi
                        </label>
                        <span className="text-black text-[12px]">
                            5000
                        </span>
                    </li>
                </ul>
            </div>
            <div className=" w-fit border-2 wrap-anywhere
                [&:has(#equally:checked)_label[for='equally']]:font-bold
                [&:has(#equally:checked)_label[for='equally']]:underline
                [&:has(#splitamount:checked)_label[for='splitamount']]:font-bold
                [&:has(#splitamount:checked)_label[for='splitamount']]:underline
                [&:has(#shares:checked)_label[for='shares']]:font-bold
                [&:has(#shares:checked)_label[for='shares']]:underline
                [&:has(#percent:checked)_label[for='percent']]:font-bold
                [&:has(#percent:checked)_label[for='percent']]:underline
            " style={{ display : !option ? "block" : "none" }}>
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
                        className="cursor-pointer"
                    >
                        Equally
                    </label>
                    <label
                        htmlFor="splitamount"
                        className="cursor-pointer"
                    >
                        Amount
                    </label>
                    <label
                        htmlFor="shares"
                        className="cursor-pointer"
                    >
                        Shares
                    </label>
                    <label
                        htmlFor="percent"
                        className="cursor-pointer"
                    >
                        Percent
                    </label>
                </div>
                <div className="
                    hidden
                    peer-checked/equally:block
                ">
                    <ul className="flex flex-col gap-2">
                        <li className="flex justify-between gap-1 pl-2 pr-2">
                            <label className="text-black flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="equally-all"
                                    defaultChecked
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
                                    onChange={handleEqual}
                                    defaultChecked
                                    className="accent-gray-400 equally-vimal"
                                />
                                Vimal
                            </label>
                            <span className="text-black text-[12px]">
                                
                            </span>
                        </li>
                        <li className="flex justify-between gap-1 border-t p-2">
                            <label className="text-black text-sm flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="equally-kavi"
                                    onChange={handleEqual}
                                    defaultChecked
                                    className="accent-gray-400 equally-kavi"
                                />
                                Kavi
                            </label>
                            <span className="text-black text-[12px]">
                                
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
                                    defaultChecked
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
                                    defaultChecked
                                />
                                Vimal
                            </label>
                            <div>
                                <span className="inline text-black border-t border-l border-b p-2 border-gray-600 rounded-tl-sm rounded-bl-sm">$</span>
                                <input type="number" name="vimal-amount" onChange={handleAmount} 
                                    className=" vimal-amount
                                        p-2 text-black text-right
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
                                    defaultChecked
                                />
                                Kavi
                            </label>
                            <div>
                                <span className="inline text-black border-t border-l border-b p-2 border-gray-600 rounded-tl-sm rounded-bl-sm">$</span>
                                <input type="number" name="kavi-amount" onChange={handleAmount}
                                    className="kavi-amount p-2 text-black text-right
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
                                    defaultChecked
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
                                    defaultChecked
                                />
                                Vimal
                            </label>
                            <div>
                                <input type="number" name="share-vimal" onChange={handleShare}
                                    className="p-2 text-black share-vimal
                                    max-w-full outline-none text-right
                                    h-8 border-l border-t border-b
                                    border-gray-600 rounded-tl-sm rounded-bl-sm
                                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                    [&::-webkit-inner-spin-button]:appearance-none
                                "/>
                                <span className="inline text-black border-t border-r border-b p-2 border-gray-600 rounded-tr-sm rounded-br-sm">$</span>
                                <span className="text-black ml-10 shr-vimal">
                                    {amount ? `= $ ${amount}` : ''}
                                </span>
                            </div>
                        </li>
                        <li className="flex flex-col justify-between border-t p-2">
                            <label className="text-black text-sm flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="share-kavi-f"
                                    className="accent-gray-400"
                                    defaultChecked
                                />
                                Kavi
                            </label>
                            <div>
                                <input type="number" name="share-kavi" onChange={handleShare}
                                    className="p-2 text-black share-kavi
                                    max-w-ful outline-none text-right
                                    h-8 border-l border-t border-b
                                    border-gray-600 rounded-tl-sm rounded-bl-sm
                                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                    [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <span className="inline text-black border-t border-r border-b p-2 border-gray-600 rounded-tr-sm rounded-br-sm">$</span>
                                <span className="text-black ml-10 shr-kavi">
                                    {amount ? `= $ ${amount}` : ''}
                                </span>
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
                                    defaultChecked
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
                                    defaultChecked
                                />
                                Vimal
                            </label>
                            <div>
                                <input type="number" name="percent-vimal" onChange={handlePercent}
                                className="
                                    p-2 text-black percent-vimal text-right
                                    max-w-full outline-none
                                    h-8 border-l border-t border-b
                                    border-gray-600 rounded-tl-sm rounded-bl-sm
                                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                    [&::-webkit-inner-spin-button]:appearance-none
                                "/>
                                <span className="inline text-black border-t border-r border-b p-2 border-gray-600 rounded-tr-sm rounded-br-sm">%</span>
                                <span className="text-black ml-10 shr-vimal">
                                    {amount ? `= $ ${amount}` : ''}
                                </span>
                            </div>
                        </li>
                        <li className="flex flex-col justify-between border-t p-2">
                            <label className="text-black text-sm flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="per-kavi-f"
                                    className="accent-gray-400"
                                    defaultChecked
                                />
                                Kavi
                            </label>
                            <div>
                                <input type="number" name="percent-kavi" onChange={handlePercent}
                                    className="p-2 text-black percent-kavi
                                    max-w-ful outline-none text-right
                                    h-8 border-l border-t border-b
                                    border-gray-600 rounded-tl-sm rounded-bl-sm
                                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                    [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <span className="inline text-black border-t border-r border-b p-2 border-gray-600 rounded-tr-sm rounded-br-sm">%</span>
                                <span className="text-black ml-10 shr-vimal">
                                    {amount ? `= $ ${amount}` : ''}
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}