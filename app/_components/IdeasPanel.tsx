"use client";
import { useState, useEffect, ReactNode } from "react";

type IdeasPanelProps = {
  selected: string;
  split: string;
  className?: string;
};

export default function IdeasPanel({ selected, split, className = "" }: IdeasPanelProps): ReactNode {
  const [whom, setWhom] = useState<string>("");

  useEffect(() => {
    const container = document.querySelector(".radio-group");
    if (!container) return;
    const handleChange = (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && target.value) {
        setWhom(target.value);
      }
    };
    container.addEventListener("change", handleChange);
    return () => container.removeEventListener("change", handleChange);
  }, []);

  const first =
    split === "expense" ? " paid for the rental car."
    : split === "transfer" ? ` withdrew money from the ATM for ${whom}.`
    : " brought some bottles back to the store.";

  const second =
    split === "expense" ? " got some supplies from supermarket."
    : split === "transfer" ? ` paid the flat deposit for ${whom}.`
    : " The landlord returned the deposit.";

  return (
    <div className={`text-black self-center ${className}`}>
      <span className="text-lg">Some Ideas</span>
      <div className="flex gap-1 mb-2">
        <div className="bg-amber-300 w-1 h-12"></div>
        <span className="text-wrap">{selected}{first}</span>
      </div>
      <div className="flex gap-1">
        <div className="bg-amber-300 w-1 h-12"></div>
        <span className="text-wrap">{selected}{second}</span>
      </div>
    </div>
  );
}