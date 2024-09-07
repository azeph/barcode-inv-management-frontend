import { Badge } from "@mui/material";
import React from "react";

function Sidebar({ screens, setScreen, screen }) {
  return (
    <div className="lg:p-2 flex flex-col w-full h-full font-lato gap-2 select-none">
      {screens.map((item, index) => {
        return (
          <div
            id={item.label}
            onClick={() => {
              setScreen(index);
            }}
            className={`flex flex-row h-12 ${
              screen == index ? "text-[#ffc100]" : "text-[#555C68]"
            } items-center gap-4 cursor-pointer`}
          >
            <div
              className={`lg:w-[32px] w-[24px] lg:h-[32px] h-[24px] lg:p-1 rounded-full ${
                screen == index && "bg-[#fff2cc]"
              }`}
            >
              {item.icon}
            </div>

            <p className={`font-lato-bold text-base lg:flex hidden`}>
              {item.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default Sidebar;
