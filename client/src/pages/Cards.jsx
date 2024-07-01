import CreditCard from "@/components/CreditCard";
import NavBar from "@/components/NavBar";

export default function Cards() {
  return (
    <div className="min-h-screen bg-[#181a1b]">
      <NavBar />
      <div className="flex flex-col items-center justify-center my-10">
        <h1 className="text-3xl font-bold mb-8 text-white">
          Conheça nossos cartões
        </h1>
        <div className="flex flex-wrap justify-center gap-8 w-full mx-10">
          <CreditCard
            bgColor="bg-[#5C5C5C]"
            textColor="text-white"
            title="Basic Cash Back"
            description="Cartão perfeito para compras diárias"
            benefits={[
              "Cashback de 1% em todas as compras",
              "Sem anuidade",
              "Acesso ao aplicativo de controle de gastos"
            ]}
            iconColor="text-[#5C5C5C]"
          />
          <CreditCard
            bgColor="bg-yellow-500"
            textColor="text-white"
            title="Intermediate Rewards"
            description="Cartão ideal para viajantes ocasionais"
            benefits={[
              "Todas as vantagens do 'Basic Cash Back'",
              "Cashback de 2% em todas as compras",
              "Pontos de recompensa em viagens",
              "Seguro de viagem gratuito"
            ]}
            iconColor="text-yellow-500"
          />
          <CreditCard
            bgColor="bg-[#161616]"
            textColor="text-yellow-500"
            title="Elite Travel"
            description="Cartão top de linha para viajantes frequentes"
            benefits={[
              "Todas as vantagens do 'Intermediate Rewards'",
              "Cashback de 3% em todas as compras",
              "Acesso a lounges de aeroportos",
              "Seguro de viagem premium",
              "Assistência 24/7"
            ]}
            iconColor="text-[#161616]"
          />
        </div>
      </div>
    </div>
  );
}
