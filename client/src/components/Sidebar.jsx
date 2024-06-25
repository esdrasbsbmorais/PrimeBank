import {
  faBarsProgress,
  faChartColumn,
  faCreditCard,
  faDoorClosed,
  faDoorOpen,
  faGear,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";

export default function SideBar() {
  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleMouseOver = () => {
    setIsMouseOver(true);
  };

  const handleMouseOut = () => {
    setIsMouseOver(false);
  };

  const icons = [
    { icon: faHouse, link: "#", subtitle: "" },
    { icon: faChartColumn, link: "#", subtitle: "" },
    { icon: faCreditCard, link: "#", subtitle: "" },
    { icon: faBarsProgress, link: "#", subtitle: "" },
  ];
  
  return (
    <div className="w-20 h-screen flex flex-col items-center bg-[#181a1b] text-white">
      <div className="bg-yellow-500 rounded-xl h-10 w-10 mt-6 mb-3"></div>
      <div className="border-[#3c3b40] border-2 w-16 my-6"></div>
      <div className="flex flex-col items-center w-full">
        {icons.map((item) => (
          <Link key={item.icon.iconName} href={item.link}>
            <FontAwesomeIcon
              className="h-6 hover:bg-[#3c3b40] hover:text-yellow-500 p-3 mb-4 rounded-xl w-auto"
              icon={item.icon}
            />
          </Link>
        ))}
        <button onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
          <FontAwesomeIcon
            className="h-6 hover:bg-[#3c3b40] hover:text-yellow-500 p-3 mb-4 rounded-xl w-auto"
            icon={isMouseOver ? faDoorOpen : faDoorClosed}
          />
        </button>
      </div>
      <div className="flex-grow flex items-end w-full mb-4">
        <Link href={"#"} className="w-full flex justify-center">
          <FontAwesomeIcon className="h-6 hover:bg-[#3c3b40] hover:text-yellow-500 p-3 rounded-xl w-auto" icon={faGear} />
        </Link>
      </div>
    </div>
  );
}
