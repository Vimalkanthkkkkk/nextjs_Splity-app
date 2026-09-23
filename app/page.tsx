import {  EventProvider } from "./Context";
import Header from "./Header";
import { CircularEvents } from "./CirculatEvents";

export default function Home() {
  
  return (
    <EventProvider>
      <div className="flex flex-1 flex-col text-black font-sansbg-[#fafbfc] bg-linear-to-b from-[#ffffff] to-[#ffffff]">
        <Header></Header>
        <div className="fixed inset-0 flex items-center justify-center bg-linear-to-b from-[#ffffff] to-[#e9e7e7]">
          <div className="flex flex-col justify-around items-center z-10">
            <h1 className=" text-[clamp(1rem,6vw,3rem)] whitespace-nowrap">Easy splitting of group expenses</h1>
            <h2 className="text-gray-600 text-[clamp(0.5rem,4vw,1.7rem)] whitespace-nowrap">The simplest way to calculate who owes what</h2>
            <button type="button" className="bg-mauve-500 min-w-20 p-1 rounded-sm self-center z-10 ">Start</button>
          </div>
        </div>
        <CircularEvents/>
      </div>
    </EventProvider>   
  );
}