"use client"

import { ReactNode, useEffect, useState } from "react";
import { EventContextType, useEvent } from "./Context";
import { Notes } from "./Notes";

export function CircularEvents() {
    const eventContext: EventContextType = useEvent();
    const total_events = eventContext.events.length;

    const radius = 130;
    const [parentRotation, setParentRotation] = useState(0);

    useEffect(() => {
        if (total_events <= 3) {
            setParentRotation(0);
            return;
        }

        const handleScroll = () => {
            const scrolltop = window.scrollY;
            setParentRotation(scrolltop * 0.2);
        };

        // Initialize position on load
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [total_events]);

    return (
        <>
            {/* Scroll Spacer: Gives the document height so window.scrollY can register */}
            <div 
                style={{ 
                    height: total_events > 3 ? `${Math.max(total_events * 300, 2000)}px` : "100vh" 
                }} 
                className="w-full pointer-events-none"
            />

            {/* Add Button */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
                <button
                    type="button"
                    className="bg-mauve-500 min-w-20 p-2 rounded-sm pointer-events-auto"
                    onClick={() =>
                        eventContext.setevent({
                            who_ID: Date.now(), // Unique ID prevent key collisions
                            who_Name: "vimal",
                            event_name: "party",
                            currency: "Ind",
                            Participants: []
                        })
                    }
                >
                    Add
                </button>
            </div>

            {/* Circular Stage Overlay */}
            <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
                <div
                    className="relative w-0 h-0 transition-transform duration-75 ease-out"
                    style={{
                        transform: `rotate(${parentRotation}deg)`
                    }}
                >
                    {eventContext.events.map((e, idx) => {
                        const angle =
                            idx * ((2 * Math.PI) / (total_events || 1)) -
                            Math.PI / 2;

                        const x = radius * Math.cos(angle);
                        const y = radius * Math.sin(angle);

                        return (
                            <div
                                key={`${e.who_ID}-${idx}`}
                                className="absolute w-20 h-20 bg-amber-300 pointer-events-auto rounded-lg"
                                style={{
                                    transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${-parentRotation}deg)`
                                }}
                            >
                                <Notes
                                    id={e.who_ID}
                                    name={e.event_name}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>        
        </>
    );
}