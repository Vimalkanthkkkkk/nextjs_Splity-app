import Image from "next/image";
import Link from "next/link";

export default function Header(){
    return(
        <div className="fixed w-full flex flex-1 justify-around flex-row items-center z-10">
            <Link href={"/"} className="flex items-center ">
                <Image width={70} height={50} className="items-start" preload loading="eager" src={"/noun_bill_5997839_@700.png"} alt="Splity logo"/>
                <span className="text-black">Splity</span>
            </Link>
            <Link href={""} className="text-black self-center">Log in</Link>
        </div>
    );
}