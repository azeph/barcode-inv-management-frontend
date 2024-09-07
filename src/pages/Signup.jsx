import React, { useState } from "react";

function Signup() {
  const [error, setError] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = () => {};

  return (
    <div className="w-full h-screen">
      <div className="flex flex-row h-full w-full">
        <div className="flex-1 flex items-center justify-center">
          <img className="w-[350px]" alt="banner" src={banner} />
        </div>
        <div className="flex-1 flex items-center justify-center h-full w-full ">
          <div className="flex flex-col items-center border rounded-lg shadow-sm pt-10 w-[450px] h-[500px]">
            <h1 className="font-lato-bold text-2xl text-[#1F2F3D]">LOGIN</h1>
            <p className="font-lato py-4">
              Enter your email and password to Log In.
            </p>
            <div className="z-10 pt-8 flex flex-col w-[500px] h-full items-center">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col z-10 w-[350px] py-2 font-lato-bold text-[#1F2F3D]"
              >
                <label className="py-2 text-sm">Email Address</label>
                <input
                  type="text"
                  value={email}
                  className="px-2 border font-roboto text-[#1F2F3D] border-[#1F2F3D] h-10 rounded-lg"
                  name="username"
                  pattern="([A-Za-z0-9][._]?)+[A-Za-z0-9]@[A-Za-z0-9]+(\.?[A-Za-z0-9]){2}\.(com?|net|org)+(\.[A-Za-z0-9]{2,4})?"
                  title="Please enter a valid email"
                  required={true}
                  onChange={(e) => {}}
                />
                <label className="mt-3 py-2 text-sm">Password</label>
                <input
                  type="password"
                  value={password}
                  className="px-2 border text-[#1F2F3D] border-[#1F2F3D] h-10 rounded-lg"
                  name="username"
                  required={true}
                  onChange={(e) => {}}
                />
                <button
                  type="submit"
                  className="mt-8 flex w-full h-10 bg-[#ffc100] rounded-lg justify-center items-center"
                >
                  <p className="text-[#1F2F3D] text-sm">Log In</p>
                </button>
                <p
                  className={`${
                    error ? "opacity-100" : "opacity-0"
                  } p-2 h-4 text-xs font-bold text-[#E8090C]`}
                >
                  {error}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
