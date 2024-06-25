import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
    return (
        <nav className="flex justify-between mx-10 text-zinc-50 p-10">
            <div>
                <Link href={"#"}>Preço</Link>
                <Link href={"#"} className="mx-10">Preço</Link>
                <Link href={"#"}>Preço</Link>
            </div>
            <Link href={"/"}>
                <Image src={"/primebank.svg"} width={200} height={88}></Image>
            </Link>
            <Link href={"/Login"} className="px-5 py-2 border-2 border-neutral-700 rounded-full">Registro - <span className="text-sm text-neutral-500">Gratuito</span></Link>
        </nav>
    )
}