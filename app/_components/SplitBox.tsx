"use client"

import { ReactNode, useEffect, useState } from "react";

type SplitType = "equal" | "amount" | "share" | "per";

type SplitProps = {
    money? : string
    participants : string[]
    splitMethod? : SplitMethod
    splitDifferent? : SplitDifferent
};

type SplitDifferent = Record<
  string,
  {
    amt: number;
    share?: number;
    percent?: number;
  }
>;

type SplitMethod =
  | "Equally"
  | "percentages"
  | "amounts"
  | "shares";

const SPLIT_TYPES: SplitType[] = ["equal", "amount", "share", "per"];

const CHECK: Record<SplitType, (p: string) => string> = {
    equal: (p) => `equally-${p}`,
    amount: (p) => `amount-${p}`,
    share: (p) => `share-${p}`,
    per: (p) => `per-${p}`,
};

const INPUT: Record<SplitType, (p: string) => string | null> = {
    equal: () => null,
    amount: (p) => `${p}-amount`,
    share: (p) => `${p}-share`,
    per: (p) => `percent-${p}`,
};

const getAmount = () => parseFloat((document.getElementById("amount") as HTMLInputElement | null)?.value ?? "") || 0;

const numStr = (n: number) => (n > 0 ? String(Math.round(n * 100) / 100) : "");
const BAD_CLASSES = ["ring-2", "ring-red-300", "bg-red-50"];

const flag = (input: HTMLInputElement | null, bad: boolean, msg = "") => {
    const box = input;
    if (!box) return;
    BAD_CLASSES.forEach((c) => box.classList.toggle(c, bad));
    box.title = bad ? msg : "";
};

const TYPE_OF_METHOD = {
    Equally: "equal",
    amounts: "amount",
    shares: "share",
    percentages: "per",
} as const;


export default function SplitBox( {money , participants , splitMethod , splitDifferent} : SplitProps ) : ReactNode{
    const TOTAL_PARTICIPANTS = participants.length;

    const editing = !!splitMethod && !!splitDifferent;
    const savedType: SplitType | null = editing ? TYPE_OF_METHOD[splitMethod!] : null;

    const savedForEveryone = editing && savedType === "equal" && participants.every((p) => !!splitDifferent![p]);

    const [option , setoption] = useState<boolean>(!editing || savedForEveryone);
    const [splitType, setSplitType] = useState<SplitType>(savedType ?? "equal");
    const [amount, setAmount] = useState<string>(money ? money.toString() : '' );
    const [total, settotal] = useState<number>(TOTAL_PARTICIPANTS);

    const rowChecked = (type: SplitType, p: string) => editing && savedType === type ? !!splitDifferent![p] : true;
    const allChecked = (type: SplitType) => participants.every((p) => rowChecked(type, p));

    const savedValue = (type: SplitType, p: string) => {
        if (!(editing && savedType === type)) return undefined;
        const s = splitDifferent![p];
        if (!s) return undefined;
        if (type === "amount") return s.amt;
        if (type === "share") return s.share;
        if (type === "per") return s.percent;
        return undefined;
    };

    const recalc = (type: SplitType, source?: HTMLInputElement , keepValues = false) => {
        const amountValue = money  ? parseFloat(money) : getAmount();
        const total_share_input = document.querySelector<HTMLInputElement>(`.total_share`);
        const rows = participants.flatMap((p) => {
            const check = document.querySelector<HTMLInputElement>(`.${CHECK[type](p)}`);
            if (!check) return [];
            const inputClass = INPUT[type](p);
            const input = inputClass
                ? document.querySelector<HTMLInputElement>(`.${inputClass}`)
                : null;
            const span = (
                type === "equal"
                    ? check.parentElement?.nextElementSibling
                    : type === "amount"
                        ? null
                        : input?.nextElementSibling?.nextElementSibling
            ) as HTMLElement | null | undefined;
            return [{ check, input, span }];
        });
        const active = rows.filter((r) => r.check.checked);
        const count = active.length;
        const allBox = document.querySelector<HTMLInputElement>(`input[data-type="${type}"]`);
        if (allBox) allBox.checked = count === rows.length;
        rows.forEach((r) => {
            if (r.check.checked) {
                if (r.input) r.input.disabled = false;
                return;
            }
            if (r.span) r.span.textContent = "";
            if (r.input) {
                flag(r.input, false);
                r.input.disabled = true;
                if (type !== "share") r.input.value = "";
            }
        });

        if (count === 0) return;

        const srcRow = source ? active.find((r) => r.input === source) : undefined;
        const typed = parseFloat(srcRow?.input?.value ?? "") || 0;
        let owed: number[] = [];

        switch (type) {
            case "equal": {
                settotal(count);
                owed = active.map(() => amountValue / count);
                break;
            }
            case "amount": {
                if (keepValues) break;
                const rest = srcRow && count > 1
                    ? Math.max(0, amountValue - typed) / (count - 1)
                    : amountValue / count;
                active.forEach((r) => {
                    if (r !== srcRow || count === 1) r.input!.value = numStr(rest);
                });
                break;
            }
            case "share": {
                const shares = active.map((r) => parseFloat(r.input!.value) || 0);
                const totalShares = shares.reduce((a, b) => a + b, 0);
                total_share_input!.value = totalShares.toString();
                owed = count === 1
                    ? [amountValue]
                    : shares.map((s) => (totalShares > 0 ? (s / totalShares) * amountValue : NaN));
                break;
            }
            case "per": {
                if (!keepValues) {
                    const rest = srcRow && count > 1
                        ? Math.max(0, 100 - typed) / (count - 1)
                        : 100 / count;
                    active.forEach((r) => {
                        if (r !== srcRow || count === 1) r.input!.value = numStr(rest);
                    });
                }
                owed = active.map((r) => (amountValue * (parseFloat(r.input!.value) || 0)) / 100);
                break;
            }
        }

        active.forEach((r, i) => {
            const v = parseFloat(r.input?.value ?? "");
            const bad = type === "amount"
                ? v > amountValue + 0.005 || v < 0
                : type === "per"
                    ? v > 100 || v < 0
                    : owed[i] > amountValue + 0.005;
            if (r.input) {
                flag(r.input, bad, type === "per"
                    ? "Must be between 0% and 100%"
                    : "Cannot be more than the total amount");
            }
            if (r.span) {
                r.span.textContent = !bad && amountValue > 0 && Number.isFinite(owed[i])
                    ? `= $ ${owed[i].toFixed(2)}`
                    : "";
            }
        });
    };

    const handleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, dataset } = event.target;
        const type = dataset.type as SplitType | undefined;
        if (!type) return;
        participants.forEach((p) => {
            const c = document.querySelector<HTMLInputElement>(`.${CHECK[type](p)}`);
            if (c) c.checked = checked;
        });
        recalc(type);
    };

    const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        recalc(event.target.dataset.split as SplitType);
    };

    const handleAmount = (event: React.ChangeEvent<HTMLInputElement>) => recalc("amount", event.target);
    const handleShare = (event: React.ChangeEvent<HTMLInputElement>) => recalc("share", event.target);
    const handlePercent = (event: React.ChangeEvent<HTMLInputElement>) => recalc("per", event.target);

    useEffect(() => {
        if (editing) SPLIT_TYPES.forEach((t) => recalc(t, undefined, t === savedType));

        if (money) {
            setAmount(money);
            if (!editing) SPLIT_TYPES.forEach((t) => recalc(t));
            return;
        }

        const input = document.getElementById("amount") as HTMLInputElement | null;
        if (!input) return;
        const handleInput = () => {
            setAmount(input.value);
            SPLIT_TYPES.forEach((t) => recalc(t));
        };
        input.addEventListener("input", handleInput);
        return () => input.removeEventListener("input", handleInput);
    }, []);

    return(
        <>
            <div className="flex gap-2 text-center text-wrap">
                <input 
                    type="radio" id="split-ery-equally" name="split-method" checked={option} onChange={() => setoption(true)} value="Eql" 
                    className="text-black outline-none border-0 accent-gray-400"
                />
                <label htmlFor="split-ery-equally" className="text-black self-center inline mt-2">Split Equally between Everyone</label>
            </div>
            <div className="flex gap-2 text-center text-wrap">
                <input 
                    type="radio" id="split-diff" name="split-method" checked={!option} onChange={() => setoption(false)}  value="dif" 
                    className="text-black outline-none border-0 accent-gray-400"
                />
                <label htmlFor="split-diff" className="text-black self-center inline mt-1 mb-1">Split differently</label>
            </div>
            <div className=" flex-col gap-2 mb-4 text-black" style={{ display: option===true ? "flex" : "none" }}>
                <span>Summary</span>
                <span>Equally between Everyone</span>
                <ul className="flex flex-col gap-2">
                    {
                        participants.map((p , idx)=>{
                            return(
                                <li key={idx} className="grid grid-cols-2 wrap-anywhere gap-0">
                                    <label className="text-black text-sm flex gap-2 items-center">
                                        {p}
                                    </label>
                                    <span className="text-black text-[12px]">
                                        { money ? (parseFloat(money)/total).toFixed(2) : amount ? (parseFloat(amount)/total).toFixed(2) : '0.00'}
                                    </span>
                                </li>
                            );
                        })
                    }
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
                    checked={splitType === "equal"} onChange={() => setSplitType("equal")}
                    className="peer/equally sr-only"
                />
                <input
                    type="radio"
                    id="splitamount"
                    name="splitType"
                    value="amount"
                    checked={splitType === "amount"} onChange={() => setSplitType("amount")}
                    className="peer/split-amount sr-only"
                />
                <input
                    type="radio"
                    id="shares"
                    name="splitType"
                    value="shares"
                    checked={splitType === "share"} onChange={() => setSplitType("share")}
                    className="peer/shares sr-only"
                />
                <input
                    type="radio"
                    id="percent"
                    name="splitType"
                    value="percent"
                    checked={splitType === "per"} onChange={() => setSplitType("per")}
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
                                    defaultChecked={allChecked("equal")}
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
                        {
                            participants.map((p , idx) => {
                                return (
                                    <li key={idx} className="flex justify-between gap-1 border-t p-2">
                                        <label className="text-black text-sm flex gap-2 items-center">
                                            <input
                                                type="checkbox"
                                                name={`equally-${p}`}
                                                data-split="equal"
                                                value={"1"}
                                                onChange={handleToggle}
                                                defaultChecked={rowChecked("equal", p)}
                                                className={`accent-gray-400 equally-${p}`}
                                            />
                                            {p}
                                        </label>
                                        <span className="text-black text-[12px]">

                                        </span>
                                    </li>
                                );
                            })
                        }
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
                                    defaultChecked={allChecked("amount")}
                                    data-type="amount"
                                    onChange={handleAll}
                                />
                                all
                            </label>
                        </li>
                        {
                            participants.map((p , idx) => {
                                return(
                                    <li key={idx} className="flex flex-col justify-between border-t p-2">
                                        <label className="text-black text-sm flex gap-2 items-center">
                                            <input
                                                type="checkbox"
                                                name={`amount-${p}`}
                                                data-split="amount"
                                                onChange={handleToggle}
                                                className={`accent-gray-400 amount-${p}`}
                                                defaultChecked={rowChecked("amount", p)}
                                            />
                                            {p}
                                        </label>
                                        <div className="w-fit rounded-sm transition">
                                            <span className="inline text-black border-t border-l border-b p-2 border-gray-600 rounded-tl-sm rounded-bl-sm">$</span>
                                            <input type="number" name={`${p}-amount`} onChange={handleAmount}
                                                defaultValue={savedValue("amount", p)} 
                                                className={`${p}-amount
                                                    p-2 text-black text-right
                                                    max-w-full outline-none
                                                    h-8 border-r border-t border-b
                                                    border-gray-600 rounded-tr-sm rounded-br-sm
                                                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                                    [&::-webkit-inner-spin-button]:appearance-none
                                            `}/>
                                        </div>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
                <div
                    className="
                        hidden
                        peer-checked/shares:block
                ">
                    <ul className="flex flex-col gap-2">
                        <input type="number" hidden className="total_share" name="total_share" />
                        <li className="flex justify-between gap-1 pl-2 pr-2">
                            <label className="text-black flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="shares-all"
                                    className="accent-gray-400"
                                    defaultChecked={allChecked("share")}
                                    data-type="share"
                                    onChange={handleAll}
                                />
                                all
                            </label>
                        </li>
                        {
                            participants.map((p , idx)=>{
                                return (
                                    <li key={idx} className="flex flex-col justify-between border-t p-2">
                                        <label className="text-black text-sm flex gap-2 items-center">
                                            <input
                                                type="checkbox"
                                                name={`share-${p}`}
                                                data-split="share"
                                                onChange={handleToggle}
                                                className={`accent-gray-400 share-${p}`}
                                                defaultChecked={rowChecked("share", p)} 
                                            />
                                            {p}
                                        </label>
                                        <div className="w-fit rounded-sm transition">
                                            <input type="number" name={`${p}-share`} onChange={handleShare}
                                                defaultValue={savedValue("share", p)}
                                                className={`p-2 text-black ${p}-share
                                                max-w-full outline-none text-right
                                                h-8 border-l border-t border-b
                                                border-gray-600 rounded-tl-sm rounded-bl-sm
                                                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                                [&::-webkit-inner-spin-button]:appearance-none
                                            `}/>
                                            <span className="inline text-black border-t border-r border-b p-2 border-gray-600 rounded-tr-sm rounded-br-sm">$</span>
                                            <span className="text-black ml-10"></span>
                                        </div>
                                    </li>
                                );
                            })
                        }
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
                                    defaultChecked={allChecked("per")}
                                    data-type="per"
                                    onChange={handleAll}
                                />
                                all
                            </label>
                        </li>
                        {
                            participants.map((p,idx) => {
                                return(
                                    <li key={idx} className="flex flex-col justify-between border-t p-2">
                                        <label className="text-black text-sm flex gap-2 items-center">
                                            <input
                                                type="checkbox"
                                                name={`per-${p}`}
                                                data-split="per"
                                                onChange={handleToggle}
                                                className={`accent-gray-400 per-${p}`}
                                                defaultChecked={rowChecked("per", p)}
                                            />
                                            {p}
                                        </label>
                                        <div className="w-fit rounded-sm transition">
                                            <input type="number" name={`percent-${p}`} onChange={handlePercent}
                                            defaultValue={savedValue("per", p)}
                                            className={`
                                                p-2 text-black percent-${p} text-right
                                                outline-none max-w-ful
                                                h-8 border-l border-t border-b
                                                border-gray-600 rounded-tl-sm rounded-bl-sm
                                                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                                [&::-webkit-inner-spin-button]:appearance-none
                                            `}/>
                                            <span className="inline text-black border-t border-r border-b p-2 border-gray-600 rounded-tr-sm rounded-br-sm">%</span>
                                            <span className="text-black ml-10"></span>
                                        </div>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            </div>
        </>
    );
}