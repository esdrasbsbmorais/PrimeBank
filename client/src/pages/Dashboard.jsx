import Expense from "@/components/Expense";
import SideBar from "@/components/Sidebar";

export default function Dashboard() {
  return (
    <div className="bg-[#202024]">
      <SideBar />
      <Expense />
    </div>
  );
}
