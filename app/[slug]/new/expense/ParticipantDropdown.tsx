"use client";
import { useState, useRef, useEffect, ReactNode } from "react";

type ParticipantDropdownProps = {
  participants: string[];
};

export default function ParticipantDropdownPage({participants}: ParticipantDropdownProps): ReactNode {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<string>( participants[0]);
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

    return (
        <div ref={dropdownRef} className="inline-block">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                style={{ anchorName: "--dropdown-trigger" } as React.CSSProperties}
                className="inline-flex min-w-30 items-center justify-between rounded-md bg-gray-400 px-4 py-2 text-white transition-colors duration-200 cursor-pointer focus:outline-none"
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
        </div>
    );
}