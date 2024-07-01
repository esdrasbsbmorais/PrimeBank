import Card from "@/components/Card";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#181a1b]">
      <NavBar />
      <div className="flex justify-center">
        <h1 className="text-center text-8xl font-bold w-[1000px] my-10 text-white">
          NOVA ERA DOS{" "}
          <span className="text-8xl font-bold text-yellow-500">BANCOS!</span>
        </h1>
      </div>
      <div className="flex justify-between text-white mx-10">
        <div>
          <p className="w-72">Aproveite nosso cartão de crédito zero anuidade e ganhe cashback em todas as compras no crédito. Coloque dinheiro de volta no seu bolso e simplifique suas finanças com um cartão que trabalha a seu favor.</p>
          <Link href={"/Register"} className="inline-block mt-6 cursor-pointer hover:animate-pulse">
            <div className="flex items-center bg-zinc-800 rounded-full">
              <p className="mx-7 rounded-lg text-xl font-bold py-4">Peça já o seu!</p>
              <div className="w-[60px] h-[60px] bg-yellow-500 rounded-full flex items-center justify-center">
                <Image src="/chipCard.png" alt="" width={40} height={40}/>
              </div>
            </div>
          </Link>
        </div>
        <Link href={"/Register"}>
          <Card />
        </Link>
        <div className="flex flex-col border border-[#373c3e] rounded-md w-52">
          <div className="flex flex-col text-center p-10">
            <p className="text-6xl">Zer0</p>
            <p className="text-md font-light">Anuidade e sem taxas no fechamento da conta</p>
          </div>
        </div>
      </div>
    </div>
  );
}
