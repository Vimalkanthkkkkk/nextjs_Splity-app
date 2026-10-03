"use client";

import { useState } from "react";

export default function AddParticipants() {
  const MAX_LIMIT = 20;
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  
  const addParticipant = (): void => {
    if (participantIds.length >= MAX_LIMIT) return;
    const newId = crypto.randomUUID?.() || Date.now().toString() + Math.random();
    setParticipantIds(prev => [...prev, newId]);
  };

  const removeParticipant = (idToRemove: string): void => {
    setParticipantIds(prev => prev.filter(id => id !== idToRemove));
  };

  return (
    <div className="w-full">
      {participantIds.map((id, idx) => {
        const personNumber = idx + 3;
        return (
            <div key={id} className="block mb-2">
                <label htmlFor={`person-${id}`} className="text-black block text-sm">
                    Person {personNumber}
                </label>
                <input 
                    type="text" 
                    name="additionalParticipants" 
                    id={`person-${id}`}
                    required 
                    className="p-2 text-black w-60 h-8 border border-gray-600 rounded-tl-sm rounded-bl-sm"
                /> 
                <button 
                    type="button" 
                    className="bg-red-200 hover:bg-red-300 w-8 h-8 rounded-tr-sm rounded-br-sm text-red-700 font-bold transition-colors" 
                    onClick={() => removeParticipant(id)} 
                >
                    ✕
                </button>
            </div>
        );
      })}

      <button 
        type="button" 
        className="bg-gray-400 hover:bg-gray-500 text-black px-3 py-1 text-sm font-medium rounded-sm mt-2 transition-colors block" 
        onClick={addParticipant}
      >
        + Add Participant
      </button>
    </div>
  );
}
