import { getAllparticipants } from "@/app/_orm/Queries";
import OCRClient from "@/app/_components/OCRClient";

interface PageProps {
  params: Promise<{slug: string;}>;
}

export default async function OCRPage( {params} : PageProps ) {
    const { slug } = await params;
    const Allparticipants = await getAllparticipants(Number(slug));
    const participants = Allparticipants ? Allparticipants.participants : [];
    
    return (
        <OCRClient participants={participants}></OCRClient>
    );
}