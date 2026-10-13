import Link from "next/link";
import Image from "next/image";


export default function Navigation({route , children} : {route : string , children : React.ReactNode }){
    return(
        <>
            <nav role="navigation" className="w-full bg-gray-600">
                <div className="w-full max-w-3xl items-center justify-between mx-auto px-2 flex">
                    <Link href={route} className="flex items-center">
                        <Image
                            width={0} height={0}
                            style={{ width: '50px', height: '50px' }}
                            className=" col-start-2 col-end-3"
                            preload
                            loading="eager"
                            src="/noun_bill_5997839_@700.png"
                            alt="Splity logo"
                        />
                    </Link>
                    {children}
                    <div style={{ width: '50px' }} />
                </div>
            </nav>
        </>
    );
}