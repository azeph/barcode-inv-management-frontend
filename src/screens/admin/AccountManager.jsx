import React, { useState } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { CircularProgress, Backdrop } from "@mui/material";
import AddUser from "./AddUser";

function AccountManager({ users }) {
  const [addUser, setAddUser] = useState(false);
  const statusBuilder = (state) => {
    if (state == 2) {
      return (
        <div className="w-full h-full flex flex-col items-center pt-4">
          <h1 className="font-lato text-lg ">
            Your have no products, add now!
          </h1>
        </div>
      );
    }

    if (state == -1) {
      return (
        <div className="w-full h-full flex flex-col items-center pt-4">
          <h1 className="font-lato text-lg ">Oops, an error occurred.</h1>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center pb-8 gap-4">
        <CircularProgress color="inherit" className="text-[#ffc100]" />
        <h1 className="font-lato">Loading users, please wait...</h1>
      </div>
    );
  };
  return (
    <div className="w-full h-full p-4 text-[#555C68]">
      <div className="w-full h-full flex flex-col gap-4">
        <div className="w-full bg-white border rounded-lg px-4 py-4 flex flex-row justify-between items-center">
          <h1 className="font-lato-bold text-base">Account Manager</h1>
          <div className="flex flex-row gap-2 select-none items-center px-2">
            <h1
              onClick={() => {
                setAddUser(true);
                console.log("tae");
              }}
              className="px-2 cursor-pointer flex gap-2 font-lato-bold text-sm text-[#555C68] border border-[#555C68]/40 w-32 shadow-sm py-[6px] rounded-lg justify-center"
            >
              <span>{<UserIcon className="w-5" />}</span>Add User
            </h1>
          </div>
        </div>
        {users["fetchState"] != 1 ? (
          statusBuilder(users["fetchState"])
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {users["users"].map((item) => {
              return (
                <div className="w-[250px] h-[300px] bg-white rounded-lg border p-4">
                  <div className="w-full h-full flex flex-col">
                    <img
                      src={`${item["imageUrl"]}`}
                      className="w-24 h-24 rounded-full self-center"
                    />
                    <p className="pt-4">
                      Name{": "}
                      <span className="">{item["name"]}</span>
                    </p>
                    <p className="">
                      Email{": "}
                      <span className="">{item["email"]}</span>
                    </p>
                    <p className="">
                      Role{": "}
                      <span className="">{item["userType"]["type"]}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={addUser}
      >
        {addUser && (
          <AddUser
            close={() => {
              setAddUser(false);
            }}
          />
        )}
      </Backdrop>
    </div>
  );
}

export default AccountManager;
