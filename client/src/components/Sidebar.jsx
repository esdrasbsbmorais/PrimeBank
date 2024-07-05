import {
  faBarsProgress,
  faChartColumn,
  faComment,
  faCreditCard,
  faDoorClosed,
  faDoorOpen,
  faGear,
  faHouse,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Link from "next/link";

export default function SideBar() {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  const handleMouseOver = () => {
    setIsMouseOver(true);
  };

  const handleMouseOut = () => {
    setIsMouseOver(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    Cookies.remove("cookieName");
    router.push("/Login");
  };

  const handleDeleteUser = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:1000/api/deleteUser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "same-origin",
      });

      if (response.ok) {
        await response.json();
        setShowDeleteModal(false);
        handleLogout();
      } else {
        const errorData = await response.json();
        console.error("Erro ao excluir o usuário", errorData.message);
      }
    } catch (error) {
      console.error("Erro ao excluir o usuário", error);
    }
  };

  return (
    <div className="w-20 min-h-screen flex flex-col items-center bg-[#181a1b] text-white">
      <div className="bg-yellow-500 rounded-xl h-10 w-10 mt-6 mb-3"></div>
      <div className="border-[#3c3b40] border-2 w-16 my-6"></div>
      <Link href={"/Chat"}><FontAwesomeIcon icon={faComment} className="h-6 hover:bg-[#3c3b40] hover:text-yellow-500 p-3 rounded-xl w-auto"/></Link>
      <div className="flex-grow flex items-end w-full mb-4">
        <button
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          onClick={() => setShowDeleteModal(true)}
          className="w-full flex justify-center mb-4"
        >
          <FontAwesomeIcon
            className="h-6 hover:bg-[#3c3b40] hover:text-yellow-500 p-3 rounded-xl w-auto"
            icon={isMouseOver ? faDoorOpen : faDoorClosed}
          />
        </button>
      </div>

      {/* Modal de Exclusão de Usuário */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-50 absolute inset-0"></div>
          <div className="bg-[#181a1b] rounded-lg overflow-hidden z-10">
            <div className="flex justify-end px-4 pt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <FontAwesomeIcon icon={faTimes} className="h-4" />
              </button>
            </div>
            <div className="p-8">
              <h2 className="text-xl font-semibold mb-4 text-center">O que deseja fazer?</h2>
              <div className="flex justify-end">
                <button
                  onClick={handleLogout}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400"
                >
                  Desconectar
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Excluir conta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
