"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Event {
  who_ID : number,
  who_Name : string,
  event_name : string,
  currency : string,
  Participants : string[],
}

export interface EventContextType {
  events : Event[] ;
  setevent : (event : Event) => void;
  dltevent : (id : number) => void;
}

const EventContext = createContext<EventContextType | null>(null);

interface EventProviderProps {
  children: ReactNode;
}

export function EventProvider({ children }: EventProviderProps) {
  const [event , setEvt] = useState<Event[]>([]);
  const setevent = (event : Event):void => setEvt(s => [...s , event]);
  const delete_event = (id : number) => {
    setEvt(event.filter(e => e.who_ID !== id));
  };
  return (
    <EventContext value={{ events : event , setevent , dltevent :delete_event}}>
      {children}
    </EventContext>
  );
}

export function useEvent() : EventContextType {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within a ThemeProvider');
  }
  return context; 
}