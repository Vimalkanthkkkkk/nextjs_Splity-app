import { getAllparticipants } from "@/app/_orm/Queries";
import OCRClient from "@/app/_components/OCRClient";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{slug: string;}>;
}

export default async function OCRPage( {params} : PageProps ) {
    const { slug } = await params;
    const Allparticipants = await getAllparticipants(Number(slug));
    if(!Allparticipants){
        redirect(`/${slug}`)
    }
    const participants = Allparticipants.participants;
    
    return (
        <OCRClient participants={participants} Eventname={Allparticipants.event} slug={slug} ></OCRClient>
    );
}