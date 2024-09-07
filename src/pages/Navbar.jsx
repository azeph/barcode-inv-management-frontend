import React, { useState } from "react";
import {
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { ListItemIcon, Menu, MenuItem, MenuList } from "@mui/material";
import { STORE } from "../../config";
import { useAuth } from "../auth/AuthContext";

function Navbar({ user, screen, signin }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const { signout } = useAuth();

  const handleClick = (event) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className="w-full bg-white border rounded-lg shadow-sm">
      <div className="w-full lg:h-16 h-12 flex flex-row items-center lg:px-4 px-2 justify-between">
        <h1 className="hidden lg:flex cursor-pointer text-center font-cinzel font-extrabold text-xl text-[#1F2F3D]">
          {STORE.storeName}
        </h1>
        {!user._id ? (
          <div className="flex flex-row">
            <button
              onClick={() => {
                signin();
              }}
              className="lg:w-28 w-16 p-1 rounded-lg font-lato-bold lg:text-base text-sm bg-[#ffc100]"
            >
              Sign In
            </button>
          </div>
        ) : (
          <div className="flex flex-row items-center gap-4 px-2 select-none">
            <div className="flex flex-row items-center gap-x-2">
              <img
                alt="Profile"
                src={user.imageUrl}
                className="h-10 w-10 rounded-full object-cover"
              />
              <p className="text-[#555C68] text-sm font-lato-bold">
                {user.name}
              </p>
            </div>
            <Cog6ToothIcon
              onClick={handleClick}
              className="w-5 text-[#555C68] cursor-pointer"
            />
          </div>
        )}
      </div>
      <Menu
        className="ml-[-10px]"
        id="customer-logout"
        anchorEl={anchorEl}
        open={open}
        dense="true"
        onClose={() => {
          setAnchorEl(null);
        }}
      >
        <MenuList className="focus:outline-none">
          <MenuItem
            onClick={() => {
              setOpen(false);
              signout();
            }}
          >
            <ListItemIcon>
              <ArrowRightOnRectangleIcon className="w-5" />
            </ListItemIcon>
            <p className="text-sm">Logout</p>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}

export default Navbar;
