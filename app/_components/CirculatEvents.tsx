"use client"

import { useEffect, useState } from "react";
import { Notes } from "./Notes";

type params ={
    id: number;
    event: string;
    whoCreated: number;
    participants: unknown;
    eventImage: Buffer<ArrayBufferLike> | null;
    currency: string;
}

type Props = {
    events: params[];
};


export function CircularEvents( {events} : Props) {
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