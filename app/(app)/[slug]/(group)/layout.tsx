export default async function Grouplayout( {children} : {children : React.ReactNode} ){
    return(
        <div className="flex flex-1 
            pb-2 gap-2 
            flex-col shrink w-auto h-auto 
            justify-between bg-white overflow-y-scroll
        ">
            {children}
        </div>
    );
}