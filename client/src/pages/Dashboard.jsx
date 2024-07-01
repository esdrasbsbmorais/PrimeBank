import { useEffect } from "react";
import { useRouter } from "next/router";
import Expense from "@/components/Expense";
import SideBar from "@/components/Sidebar";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Login");
    }
  }, []);

  return (
    <div className="bg-[#202024]">
      <SideBar />
      <Expense />
    </div>
  );
}
