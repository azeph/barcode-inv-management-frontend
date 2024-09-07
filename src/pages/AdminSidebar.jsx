import React from "react";
import logo from "../assets/images/icon.png";
import { Badge } from "@mui/material";

function AdminSidebar({ screen, screens, setScreen }) {
  return (
    <div className="w-[18%] h-full bg-white shadow-sm select-none">
      <div className="h-full w-full p-5">
        <div className="flex flex-col w-full h-full px-2 font-lato gap-2">
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
                  className={`w-[32px] h-[32px] p-1 rounded-full ${
                    screen == index && "bg-[#fff2cc]"
                  }`}
                >
                  {item.icon}
                </div>

                <p className={`font-lato-bold text-base`}>{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;
