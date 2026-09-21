type NotesArg = {
    id : number,
    name : string,
}

export function Notes(args : NotesArg){
    return(
        <div>
            <span className="text-2xl">{args.name}</span>
        </div>
    );
}