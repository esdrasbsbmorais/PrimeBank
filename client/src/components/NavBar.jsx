import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
    return (
        <nav className="flex justify-between text-zinc-50 p-10 bg-[#161616]">
            <div>
                <Link href={"/"}>Inicio</Link>
                <Link href={"/Cards"} className="ml-4">Cartões</Link>
            </div>
            <Link href={"/"}>
                <Image src={"/primebank.svg"} width={200} height={88}></Image>
            </Link>
            <Link href={"/Register"} className="px-5 py-2 border-2 border-neutral-700 rounded-full">Registro - <span className="text-sm text-neutral-500">Gratuito</span></Link>
        </nav>
    )
}