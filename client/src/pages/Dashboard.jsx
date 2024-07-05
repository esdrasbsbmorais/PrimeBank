import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SideBar from "@/components/Sidebar";
import CardManager from "@/components/CardManager";
import TransferHistory from "@/components/TransferHistory";
import ChatbotButton from "@/components/ChatbotButton";
import ChatModal from "@/components/ChatModal";

export default function Dashboard() {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Login");
    }
  }, []);

  const handleOpenChat = () => setIsChatOpen(true);
  const handleCloseChat = () => setIsChatOpen(false);

  return (
    <div className="flex bg-[#202024] min-h-screen overflow-hidden">
      <SideBar />
      <div className="p-5 flex flex-wrap gap-5 w-full">
        <div className="flex-1 sm:flex-[2] md:flex-[2] lg:flex-[3] xl:flex-[2] bg-gradient-to-tr from-[#222222] to-[#2d2c30] p-4 pl-7 text-white rounded-xl border border-[#373c3e]">
          <h2 className="text-lg">Seus cartões</h2>
          <CardManager />
        </div>
        <div className="flex-1 sm:flex-[2] md:flex-[3] lg:flex-[6] xl:flex-[5] bg-gradient-to-tr from-[#222222] to-[#2d2c30] p-4 pl-7 text-white rounded-xl border border-[#373c3e] shadow-lg m-2">
          <TransferHistory />
          <h2 className="text-lg">Historico de transações</h2>
        </div>
      </div>
      <ChatbotButton onOpen={handleOpenChat} />
      {isChatOpen && <ChatModal onClose={handleCloseChat} />}
    </div>
  );
}
