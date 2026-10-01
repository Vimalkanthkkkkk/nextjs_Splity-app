"use client"

import { ReactNode, useState } from "react";

export default function AddParticipants(){
    const [participants , setParticipants] = useState<number>(0);
    const MAX_LIMIT = 20
    const addparticipants = () : void =>{
        setParticipants(p => Math.min(p + 1, MAX_LIMIT));
    };

    const removeparticipants = () : void => {
        setParticipants(p => Math.min(p - 1, MAX_LIMIT));
    };

    return(
        <div className="">
            {
                Array.from({ length: participants }).map(( _ , idx) : ReactNode => {
                    return(
                        <div key={idx} className="block mb-2">
                            <label htmlFor="others" className="text-black block">Person {idx+3}</label>
                            <input type="text" name="others" id="others" className="p-2 text-black w-60 h-8 border border-gray-600 rounded-tl-sm rounded-bl-sm"/> 
                            <button type="button" className="bg-gray-400 w-6 h-8 rounded-tr-sm rounded-br-sm text-black" onClick={removeparticipants}>x</button>
                        </div>
                    );
                })
            }
            <button type="button" className="bg-gray-500 p-2 rounded-sm mt-2" onClick={addparticipants}>Add Person</button>
        </div>
    );
}