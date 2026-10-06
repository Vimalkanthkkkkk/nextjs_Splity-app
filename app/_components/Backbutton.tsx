import Link from "next/link";

export default function BackButton({route} : {route : string} ){
    return(
        <div className="content-center pl-2 w-full h-10 self-center">
            <Link href={route} className="">
                <svg 
                    fill="#000000" height="13px" width="20px" 
                    version="1.1" id="Capa_1" className="inline"
                    xmlns="http://www.w3.org/2000/svg" 
                    xmlnsXlink="http://www.w3.org/1999/xlink" 
                    viewBox="0 0 475 590" xmlSpace="preserve"
                >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier"> 
                        <g>
                            <path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225 c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"></path> 
                        </g> 
                    </g>
                </svg>
                <span className="text-black text-center">Back</span>
            </Link>
        </div>
    );
}