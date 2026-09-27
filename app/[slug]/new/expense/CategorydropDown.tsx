"use client";
import { useState, useRef, useEffect, ReactNode } from "react";

type CategortType = {
    mainTitle : string,
    subTitle  : string,
    color : string

};

const category : CategortType[] = [
    {
        mainTitle : "None",
        subTitle  : "",
        color : "#999999"
    },
    {
        mainTitle : "Rent & Home",
        subTitle  : "Rent , mortage",
        color : "#c08559"
    },
    {
        mainTitle : "Accommodation",
        subTitle  : "Hotels , hotel , vacation home",
        color : "#a3c059"
    },
    {
        mainTitle : "Food & Groceries",
        subTitle  : "Supermarket Purchase , snacks",
        color : "#a3c059"
    },
    {
        mainTitle : "Dining & Drinks",
        subTitle  : "Restrauent , cafes , bars , takeout",
        color : "#76c059"
    },
    {
        mainTitle : "Transporation",
        subTitle  : "Flight , train tickets , publoc transport",
        color : "#59c068"
    },
    {
        mainTitle : "Utilities & Connectivity",
        subTitle  : "Electricity , phones , internet",
        color : "#59c093"
    },
    {
        mainTitle : "Experiences",
        subTitle  : "Movies , concerts , Hobby",
        color : "#5993c0"
    },
    {
        mainTitle : "Health",
        subTitle  : "Insurance , pharmacy , doctor visit , dental",
        color : "#59c0c0"
    },
    {
        mainTitle : "Wellness & Personal care",
        subTitle  : "Haircuts , skincare",
        color : "#7659c0"
    },
    {
        mainTitle : "Financial & Fees",
        subTitle  : "Debt , savings",
        color : "#a359c0"
    },
    {
        mainTitle : "Shopping & Gear",
        subTitle  : "clothes , Electronics",
        color : "#5968c0"
    },
    {
        mainTitle : "Education & Work",
        subTitle  : "Courses , book , materials",
        color : "#c059b0"
    },
    {
        mainTitle : "Celebrations & Events",
        subTitle  : "Birthdays , anniversary , weddings",
        color : "#c05985"
    },
    {
        mainTitle : "Miscellaneous",
        subTitle  : "Things that don't fit into the other category",
        color : "#c05959"
    }
]

export default function CategoryDropdown(): ReactNode {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<CategortType>(category[0]);
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

    const handleSelect = (option: CategortType) => {
        setSelected(option);
        setIsOpen(false);
    };

    return (
        <div className="grid grid-cols-12  ">
            <div ref={dropdownRef} className="block w-full text-black mt-3 col-span-8">
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    style={{ anchorName: "--dropdown-trigger-two" } as React.CSSProperties}
                    className="inline-flex min-w-20 mr-1 items-center gap-1 justify-between rounded-md bg-gray-400 px-4 py-2 text-white transition-colors duration-200 cursor-pointer focus:outline-none"
                >
                    <div className="rounded-full self-center w-3 h-3" style={{backgroundColor : selected.color}} ></div>
                    <span>{selected.mainTitle}</span>
                    <span className={`ml-2 text-xs transition-transform duration-300 pointer-events-none ${isOpen ? "rotate-180" : ""}`}>
                        ▼
                    </span>
                </button>
                {isOpen && (
                    <ul
                        style={{
                            positionAnchor: "--dropdown-trigger-two",
                            top: "anchor(bottom)",
                            left: "anchor(left)",
                        } as React.CSSProperties}
                    className="fixed z-10 mt-2 w-80 h-60 rounded-md border overflow-y-scroll border-slate-200 bg-gray-200 p-2 shadow-lg ring-1 ring-black/5"
                    >
                    {category.map((c, i): ReactNode => (
                        <li key={i}>
                            <button type="button"
                                onClick={() => handleSelect(c)}
                                className="w-full flex flex-1 text-left gap-1 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 transition-colors cursor-pointer"
                            >
                                <div className="rounded-full self-start w-10 h-10" style={{backgroundColor : c.color}} ></div>
                                <div className="self-center text-wrap">
                                    <span className="block">{c.mainTitle}</span>
                                    <span>{c.subTitle}</span>
                                </div>
                            </button>
                        </li>
                    ))}
                    </ul>
                )} 
                <span>Paid for Something</span>
            </div>
        </div>
    );
}