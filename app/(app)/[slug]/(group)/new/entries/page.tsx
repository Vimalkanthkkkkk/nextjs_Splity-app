import { getAllparticipants } from "@/app/_orm/Queries";
import OCRClient from "@/app/_components/OCRClient";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{slug: string , split : string;}>;
}

export default async function OCRPage( {params} : PageProps ) {
    const { slug , split } = await params;
    const Allparticipants = await getAllparticipants(Number(slug));
    if(!Allparticipants){
        redirect(`/${slug}`)
    }
    const eventname =  Allparticipants.event 
    const participants = Allparticipants.participants ;
    
    return (
        <OCRClient 
            split={split} 
            participants={participants} 
            Eventname={eventname} 
            slug={slug} 
        >
        </OCRClient>
    );
}