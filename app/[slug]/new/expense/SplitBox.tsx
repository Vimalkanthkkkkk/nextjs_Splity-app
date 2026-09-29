"use client"
import { ReactNode, useEffect, useState  } from "react";

export default function SplitBox() : ReactNode{
    const participants = ["vimal" , "kavi"];
    const TOTAL_PARTICIPANTS = 2;
    const [option , setoption] = useState<boolean>(true);
    const [amount, setAmount] = useState<string>('');
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

    const handleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, dataset } = event.target;
        const type = dataset.type;
        if (!type) return;
        const elements = getElements(
            participants.map((p) => {
                switch (type) {
                    case "equal":
                        return `equally-${p}`;

                    case "amount":
                        return `amount-${p}`;

                    case "share":
                        return `share-${p}`;

                    case "per":
                        return `per-${p}`;

                    default:
                        return "";
                }
            })
        );
        elements.forEach((input) => {
            input.checked = checked;
            const span = type === "equal"
                ? input.parentElement!.nextElementSibling as HTMLSpanElement
                : input.nextElementSibling!.nextElementSibling! as HTMLSpanElement;
            if (!checked) {
                span.textContent = "";
            }
        });
        if (!checked) return;
        switch (type) {
            case "equal": {
                const amountValue = parseFloat(amount) || 0;
                const eachAmount = elements.length > 0
                    ? (amountValue / elements.length).toFixed(2)
                    : "0.00";
                elements.forEach((input) => {
                    const span = input.parentElement!.nextElementSibling as HTMLSpanElement;
                    span.textContent = `= $ ${eachAmount}`;
                });
                settotal(elements.length);
                break;
            }
            case "amount": {
                break;
            }

            case "share": {
                const amountValue = parseFloat(amount) || 0;
                const totalShares = elements.reduce(
                    (total, input) =>
                        total + (parseFloat(input.value) || 0),
                    0
                );
                elements.forEach((input) => {
                    const share = parseFloat(input.value) || 0;
                    const result = totalShares > 0
                        ? ((share / totalShares) * amountValue).toFixed(2)
                        : "0.00";
                    const span =
                        input.nextElementSibling!
                            .nextElementSibling! as HTMLSpanElement;
                    span.textContent = `= $ ${result}`;
                });
                break;
            }
            case "per": {
                const amountValue = parseFloat(amount) || 0;
                elements.forEach((input) => {
                    const percentage = parseFloat(input.value) || 0;
                    const result = (
                        amountValue * percentage / 100
                    ).toFixed(2);
                    const span = input.nextElementSibling!
                        .nextElementSibling! as HTMLSpanElement;
                    span.textContent = `= $ ${result}`;
                });
                break;
            }
        }
    };

    const getElements = (classes: string[]) => {
        return classes
            .map((className) => {
                const element = document.getElementsByClassName(className)[0];
                return element instanceof HTMLInputElement
                    ? element
                    : null;
            })
            .filter((el): el is HTMLInputElement => el !== null);
    };


    const handleEqual = (event: React.ChangeEvent<HTMLInputElement>) => {
        const elements = getElements(
            participants.map((p) => `equally-${p}`)
        );
        const nextTotal = elements.filter(
            (input) => input.checked
        ).length;
        settotal(nextTotal);
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

    const handleAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const participants_amount_elements = getElements(
            participants.map((p) => `${p}-amount`)
        );
        const target_value = parseFloat(target.value);
        const float_amount = parseFloat(amount);
        let final_value = isFloat(target_value)
            ? target_value
            : parseInt(target.value);
        participants_amount_elements.forEach((ele) => {
            if (ele === target) {
                return;
            }
            const result = final_value > float_amount
                ? 0
                : float_amount -
                (
                    hasThreeOrMoreDecimals(final_value)
                        ? float_amount
                        : final_value
                );
            ele.value = result <= 0 || result > float_amount
                ? ''
                : result.toString();
        });
    };

    const handleShare = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const participants_share_elements = getElements(
            participants.map((p) => `share-${p}`)
        );
        const others_share = participants_share_elements.reduce((pre, cur) => {
            return pre + (
                cur !== target
                    ? parseFloat(cur.value) || 0
                    : 0
            );
        }, 0);
        const share_result = (parseFloat(target.value) || 0) + others_share;
        const amount_value = parseFloat(amount) || 0;
        participants_share_elements.forEach((ele) => {
            const share = parseFloat(ele.value) || 0;
            const shr_amount = share_result > 0
                ? ((share / share_result) * amount_value).toFixed(2)
                : "";
            ele.nextElementSibling!.nextElementSibling!
                .textContent = `= $ ${shr_amount}`;
        });
    };

    const handlePercent = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const participants_percent_elements = getElements(
            participants.map((p) => `percent-${p}`)
        );
        const target_value = parseFloat(target.value) || 0;
        const float_amount = parseFloat(amount) || 0;
        const per_res = (
            float_amount * (target_value / 100)
        ).toFixed(2);
        participants_percent_elements.forEach((ele) => {
            const output = ele.nextElementSibling!
                .nextElementSibling!;
            if (ele === target) {
                output.textContent = `= $ ${per_res}`;
            } else {
                const bal_per = (100 - target_value) || 100;
                ele.value = bal_per.toFixed(2);
                const others_res = float_amount *
                    (
                        (0.01 * bal_per) /
                        (participants_percent_elements.length - 1)
                    );
                output.textContent = `= $ ${others_res.toFixed(2)}`;
            }
        });
    };

    useEffect(() => {
        const input = document.getElementById("amount") as HTMLInputElement;
        if (!input) return;
        const handleInput = () => {
            const newAmount = input.value;
            setAmount(newAmount);
            const amountElements = getElements(
                participants.map((p) => `${p}-amount`)
            );
            amountElements.forEach((element) => {
                element.value = newAmount;
            });
            const equalElements = getElements(
                participants.map((p) => `equally-${p}`)
            );
            const checkedCount = equalElements.filter(
                (element) => element.checked
            ).length;
            const amountValue = parseFloat(newAmount) || 0;
            equalElements.forEach((element) => {
                const span = element.parentElement
                        ?.nextElementSibling as HTMLSpanElement | null;
                if (!span) return;
                if (element.checked && checkedCount > 0) {
                    span.textContent = `= $ ${(amountValue / checkedCount).toFixed(2)}`;
                } else {
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
                                    data-type="equal"
                                    className="accent-gray-400"
                                    onChange={handleAll}
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
                                    data-type="amount"
                                    onChange={handleAll}
                                />
                                all
                            </label>
                        </li>
                        <li className="flex flex-col justify-between border-t p-2">
                            <label className="text-black text-sm flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="amount-vimal"
                                    className="accent-gray-400"
                                    defaultChecked
                                    onChange={handleAmount}
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
                                    name="amount-kavi"
                                    className="accent-gray-400"
                                    defaultChecked
                                    onChange={handleAmount}
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
                                    data-type="share"
                                    onChange={handleAll}
                                />
                                all
                            </label>
                        </li>
                        <li className="flex flex-col justify-between border-t p-2">
                             <label className="text-black text-sm flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="share-vimal"
                                    onChange={handleShare}
                                    className="accent-gray-400"
                                    defaultChecked
                                />
                                Vimal
                            </label>
                            <div>
                                <input type="number" name="share-vimal" onChange={handleShare}
                                    className="p-2 text-black vimal-share
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
                                    name="share-kavi"
                                    onChange={handleShare}
                                    className="accent-gray-400"
                                    defaultChecked
                                />
                                Kavi
                            </label>
                            <div>
                                <input type="number" name="share-kavi" onChange={handleShare}
                                    className="p-2 text-black kavi-share
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
                                    data-type="per"
                                    onChange={handleAll}
                                />
                                all
                            </label>
                        </li>
                        <li className="flex flex-col justify-between border-t p-2">
                            <label className="text-black text-sm flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="per-vimal"
                                    className="accent-gray-400"
                                    defaultChecked
                                    onChange={handlePercent}
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
                                    name="per-kavi"
                                    className="accent-gray-400"
                                    defaultChecked
                                    onChange={handlePercent}
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