import Link from "next/link";

type NotesArg = {
    id : number,
    name : string,
}

export function Notes(args : NotesArg){
    return(
        <Link className="text-center" href={`/${args.id}`}>
            <span className=" text-2xl">{args.name}</span>
        </Link>
    );
}