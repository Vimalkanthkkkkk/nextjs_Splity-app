"use client"

import { useState } from "react";
import ParticipantDropdown from "./ParticipantDropdown";
import IdeasPanel from "./IdeasPanel";

type ParticipantProps = {
  participants: string[];
  split: string;
  edit : boolean
};


export default function Participants({participants , split , edit}:ParticipantProps){
    const [selected, setSelected] = useState<string>(participants[0]);
    const [idempotencyKey]        = useState(() => crypto.randomUUID());
    return(
        <div className="grid grid-cols-12">
            <input
                type="hidden"
                name="idempotencyKey"
                value={idempotencyKey}
            />
            <input
                type="hidden"
                name="participant"
                value={selected}
            />
            <ParticipantDropdown
                className="col-span-8"
                participants={participants}
                selected={selected}
                onSelect={setSelected}
            >
                {
                    edit ? <span>Paid for Something</span> : <></>
                }
                <label htmlFor="what" className="text-black block mt-4 mb-2">What for? </label>
                <input
                    type="text"
                    name="what"
                    id="what"
                    style={{
                        width : `${edit ? "240px" : "100%"}`
                    }}
                    className="p-2 text-black outline-none w-60 max-w-full h-8 border border-gray-600 rounded-sm"
                />
            </ParticipantDropdown>
            {
                edit ? <IdeasPanel className="col-span-4" selected={selected} split={split} /> : <></>
            }
        </div>
    );
    
}
