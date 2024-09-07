import React from "react";
import logo from "../assets/images/logo.png";
import {
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { ListItemIcon, Menu, MenuItem, MenuList } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { STORE } from "../../config";

function AdminNavbar({ user }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const { signout } = useAuth();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className="w-full h-16 bg-white shadow-sm">
      <div className="flex flex-row w-full py-5 px-7">
        <div className="flex flex-row items-center gap-4 w-full ">
          <img src={logo} className="w-8" />
          <h1 className="font-lato-black text-[#0b2b29] ">{STORE.storeName}</h1>
        </div>
        <div className="flex w-full flex-row justify-between">
          <div></div>
          <div className="flex flex-row items-center gap-6 px-2 select-none">
            <div className="flex flex-row items-center gap-x-2">
              <img
                alt="Profile"
                src={user.imageUrl}
                className="h-8 w-8 rounded-full object-cover"
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
        </div>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          dense={true}
          onClose={() => {
            setAnchorEl(null);
          }}
        >
          <MenuList className="focus:outline-none">
            <MenuItem
              onClick={() => {
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
    </div>
  );
}

export default AdminNavbar;
