import { useEffect } from "react";
import { useRouter } from "next/router";
import SideBar from "@/components/Sidebar";
import Expense from "@/components/Expense";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Login");
    }
  }, []);

  return (
    <div className="flex bg-[#202024] min-h-screen">
      <SideBar />
      <div className="p-5 grid grid-rows-2 grid-cols-3 gap-5 w-full">
        <div className="col-span-1 row-span-1 bg-gradient-to-tr from-[#222222] to-[#2d2c30] p-4 pl-7 text-white rounded-xl border border-[#373c3e]">
          <h2 className="text-lg">Gráfico de Despesas</h2>
          <Expense />
        </div>
        <div className="col-span-1 row-span-1 bg-gradient-to-tr from-[#222222] to-[#2d2c30] p-4 pl-7 text-white rounded-xl border border-[#373c3e]">
          {/* Informações Adicionais 1 */}
          <h2 className="text-lg">Rendimentos</h2>
          <div><p>R$ 0,00</p></div>
        </div>
        <div className="col-span-1 row-span-2 bg-gradient-to-tr from-[#222222] to-[#2d2c30] p-4 pl-7 text-white rounded-xl border border-[#373c3e]">
          {/* Bloco vertical no lado direito */}
          <h2 className="text-lg">Seus cartões</h2>
          <div className="mt-8 w-[410px] h-[260px] bg-white rounded-xl"></div>
          <p className="mt-4 text-sm text-zinc-500">Carteira</p>
          <p className="mt-2 text-2xl">R$ </p>
          {/* Você pode adicionar mais componentes ou informações aqui */}
        </div>
        <div className="col-span-2 row-span-1 bg-gradient-to-tr from-[#222222] to-[#2d2c30] p-4 pl-7 text-white rounded-xl border border-[#373c3e]">
          {/* Detalhes */}
          <h2 className="text-lg">Historico de transações</h2>
        </div>
      </div>
    </div>
  );
}
