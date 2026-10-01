"use client";
import { useState, useRef, useEffect, ReactNode } from "react";

type ParticipantDropdownProps = {
  participants: string[];
  split : string
};

export default function ParticipantDropdownPage({participants , split}: ParticipantDropdownProps): ReactNode {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<string>( participants[0]);
    const [whom, setWhom] = useState<string>('');
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if ( dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: string) => {
        setSelected(option);
        setIsOpen(false);
    };

    useEffect(() => {
        const container = document.querySelector('.radio-group');
        if (!container) return;
        const handleChange = (event: Event) => {
            const target = event.target;
            if (target instanceof HTMLInputElement && target.value) {
                setWhom(target.value);
            }
        };

        container.addEventListener('change', handleChange);
        return () => container.removeEventListener('change', handleChange);
    }, []);

    return (
        <div className="grid grid-cols-12">
            <div ref={dropdownRef} className="block w-full text-black mt-3 col-span-8">
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    style={{ anchorName: "--dropdown-trigger" } as React.CSSProperties}
                    className="inline-flex min-w-20 mr-1 items-center justify-between rounded-md bg-gray-400 px-4 py-2 text-white transition-colors duration-200 cursor-pointer focus:outline-none"
                >
                    <span>{selected}</span>
                    <span className={`ml-2 text-xs transition-transform duration-300 pointer-events-none ${isOpen ? "rotate-180" : ""}`}>
                        ▼
                    </span>
                </button>
                {isOpen && (
                    <ul
                        style={{
                            positionAnchor: "--dropdown-trigger",
                            top: "anchor(bottom)",
                            left: "anchor(left)",
                        } as React.CSSProperties}
                    className="fixed z-10 mt-2 w-48 rounded-md border border-slate-200 bg-gray-200 p-2 shadow-lg ring-1 ring-black/5"
                    >
                    {participants.map((p, i): ReactNode => (
                        <li key={i}>
                            <button
                                type="button"
                                onClick={() => handleSelect(p)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 transition-colors cursor-pointer rounded-sm"
                            >
                                {p}
                            </button>
                        </li>
                    ))}
                        <li>
                            <button type="button"
                            onClick={() => handleSelect("vimal")}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 transition-colors cursor-pointer"
                            >
                                vimal
                            </button>
                        </li>
                        <li>
                            <button type="button"
                            onClick={() => handleSelect("Kavi")}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 transition-colors cursor-pointer"
                            >
                            Kavi
                            </button>
                        </li>
                    </ul>
                )}
                <span>Paid for Something</span>
                <label htmlFor="what" className="text-black block mt-4 mb-2">What for? </label>
                <input type="text" name="what" id="what" className="
                        p-2
                        text-black outline-none
                        w-60
                        max-w-full
                        h-8
                        border
                        border-gray-600
                        rounded-sm
                    "
                />
            </div>
            <div className="text-black self-center col-span-4">
                <span className="text-lg">Some Ideas</span>
                <div className="flex gap-1 mb-2">
                    <div className="bg-amber-300 w-1 h-12"></div>
                    <span className="text-wrap">
                        {selected} 
                        {
                         split === "expense" ?
                            " paid for the rental car."
                        :
                         split === "transfer" ?
                            ` withdrew money from the ATM for ${whom}.`
                        : 
                            " brought some bottles back to the store."
                        }
                    </span>
                </div>
                <div className="flex gap-1">
                    <div className="bg-amber-300 w-1 h-12"></div>
                    <span className="text-wrap">
                        {selected} 
                        {
                         split === "expense" ?
                            " got some supplies from the supermarket."
                        :
                         split === "transfer" ?
                            ` paid the flat deposit for ${whom}.`
                        : 
                            " The landlord returned the deposit."
                        }
                    </span>
                </div>
            </div>
        </div>
    );
}