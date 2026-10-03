"use client"

import { useEffect, useState } from "react";
import { EventContextType, useEvent } from "./Context";
import { Notes } from "./Notes";
import { getAllEvent } from "../_orm/Queries";

export async function CircularEvents() {
    const eventContext: EventContextType = useEvent();
    const events = await getAllEvent();
    const total_events = events.length;
    const baseradius = 130;
    const baseStepAngle = 45; 
    const [parentRotation, setParentRotation] = useState(0);

    const stepAngleDeg = total_events > 6 
        ? Math.max(360 / total_events, 20) 
        : baseStepAngle;

    const radius = total_events > 6 
        ? baseradius + (total_events - 6) * 12 
        : baseradius;

    useEffect(() => {
        if (total_events <= 3) {
            setParentRotation(0);
            return;
        }
        const handleScroll = () => {
            const scrolltop = window.scrollY;
            setParentRotation(scrolltop * 0.2);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [total_events]);

    return (
        <>
            <div 
                style={{ 
                    height: total_events > 3 ? `${Math.max(total_events * 400, 3000)}px` : "100vh" ,
                }} 
                className="w-full pointer-events-none"
            >
            <div className="fixed left-1/2 translate-y-150 -translate-x-1/2  z-50">
                <button
                    type="button"
                    className="bg-mauve-500 min-w-20 p-2 rounded-sm pointer-events-auto"
                    onClick={() =>
                        eventContext.setevent({
                            who_ID: Date.now(), 
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
            <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
                <div
                    className="relative self-end-safe transition-transform duration-75 ease-out"
                    style={{
                        transform: `rotate(${parentRotation}deg)`
                    }}
                >
                    {events.map((e, idx) => {
                        const angleDeg = idx * (stepAngleDeg) - 90 ;
                        const angle = (angleDeg * Math.PI) / 180;
                        const x = radius * Math.cos(angle);
                        const y = radius * Math.sin(angle);

                        return (
                            <div
                                key={`${e.id}-${idx}`}
                                className="absolute w-20 h-20 border-2 border-white hover:border-gray-800 bg-white shadow-[inset_0px_0px_6px_rgba(0,0,0,0.1)] pointer-events-auto rounded-lg place-content-center"
                                style={{
                                    transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${-parentRotation}deg)`
                                }}
                            >
                                <Notes
                                    id={e.id}
                                    name={e.event}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>     
        </div>   
        </>
    );
}