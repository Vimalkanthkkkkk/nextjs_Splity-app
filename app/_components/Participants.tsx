"use client"

import { useState } from "react";
import ParticipantDropdown from "./ParticipantDropdown";
import IdeasPanel from "./IdeasPanel";

type ParticipantProps = {
  participants: string[];
  split: string;
};


export default function Participants({participants , split}:ParticipantProps){
    const [selected, setSelected] = useState<string>(participants[0]);

    return(
        <div className="grid grid-cols-12">
            <ParticipantDropdown
                className="col-span-8"
                participants={participants}
                selected={selected}
                onSelect={setSelected}
            >
                <span>Paid for Something</span>
                <label htmlFor="what" className="text-black block mt-4 mb-2">What for? </label>
                <input
                type="text"
                name="what"
                id="what"
                className="p-2 text-black outline-none w-60 max-w-full h-8 border border-gray-600 rounded-sm"
                />
            </ParticipantDropdown>
            <IdeasPanel className="col-span-4" selected={selected} split={split} />
        </div>
    );
    
}
