import React, { useState } from "react";
import banner from "../assets/images/logo.png";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUser } from "../api/user_api";
import { useDispatch } from "react-redux";
import { login } from "../states/user";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [onLogin, setOnLogin] = useState(false);
  const [onReset, setOnReset] = useState(false);
  const [error, setError] = useState("");
  const { signin, currentUser, resetPassword } = useAuth();
  const [forgot, setForgot] = useState(false);
  const [sent, setSent] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getUserData = async (uid) => {
    return getUser(uid)
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => {
        setError("Something went wrong, try again.");
        setOnLogin(false);
        console.log(err);
      });
  };

  const loginUser = async (e) => {
    e.preventDefault();

    setOnLogin(true);
    setError("");

    signin(email, password)
      .then((value) => {
        getUserData(value.user.uid).then((user) => {
          dispatch(login(user));
          navigate("/admin");
        });
      })
      .catch((err) => {
        setError("Invalid email or password.");
        setOnLogin(false);
      });
  };

  const handleReset = async (e) => {
    e.preventDefault();

    setOnReset(true);
    setError("");

    resetPassword(email)
      .then((_) => {
        setOnReset(false);
        setSent(true);
      })
      .catch((err) => {
        setOnReset(false);
        setError("Error password reset.");
      });
  };

  return (
    <div className="w-full h-screen">
      <div className="flex flex-row h-full w-full">
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <img className="w-[250px]" alt="banner" src={banner} />
          <h1 className="font-lato-bold text-2xl">
            PSAU CONSUMERS COOPERATIVE
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center h-full w-full ">
          {forgot ? (
            sent ? (
              <div className="flex flex-col items-center border rounded-lg shadow-sm pt-10 w-[450px] h-[400px] justify-center px-8">
                <h1 className="font-lato text-[#1F2F3D] text-center">
                  An email has been sent to you with instruction to reset your
                  password.
                </h1>
                <button
                  disabled={onReset}
                  onClick={() => {
                    setForgot(false);
                  }}
                  className="mt-8 flex w-full h-10 bg-[#ffc100] rounded-lg justify-center items-center"
                >
                  <p className="text-[#1F2F3D] text-sm">Back to Login</p>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center border rounded-lg shadow-sm pt-10 w-[450px] h-[400px]">
                <h1 className="font-lato-bold text-2xl text-[#1F2F3D]">
                  Reset Password
                </h1>
                <p className="font-lato py-4">
                  Enter your email to reset you password.
                </p>
                <div className="z-10 pt-4 flex flex-col w-[500px] h-full items-center">
                  <form
                    onSubmit={handleReset}
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
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />

                    <button
                      disabled={onReset}
                      type="submit"
                      className="mt-8 flex w-full h-10 bg-[#ffc100] rounded-lg justify-center items-center"
                    >
                      {onReset ? (
                        <div className="flex flex-row items-center gap-4">
                          <CircularProgress size="18px" color="inherit" />
                          <p className="text-[#1F2F3D] text-sm">
                            Loading, please wait...
                          </p>
                        </div>
                      ) : (
                        <p className="text-[#1F2F3D] text-sm">Continue</p>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setForgot(false);
                      }}
                      className="rounded-lg border text-sm h-10 mt-2"
                    >
                      Cancel
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
            )
          ) : (
            <div className="flex flex-col items-center border rounded-lg shadow-sm pt-10 w-[450px] h-[500px]">
              <h1 className="font-lato-bold text-2xl text-[#1F2F3D]">LOGIN</h1>
              <p className="font-lato py-4">
                Enter your admin/clerk credentials to Log In.
              </p>
              <div className="z-10 pt-8 flex flex-col w-[500px] h-full items-center">
                <form
                  onSubmit={loginUser}
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <label className="mt-3 py-2 text-sm">Password</label>
                  <input
                    type="password"
                    value={password}
                    className="px-2 border text-[#1F2F3D] border-[#1F2F3D] h-10 rounded-lg"
                    name="username"
                    required={true}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  {/* <p
                    onClick={() => {
                      setForgot(true);
                      setSent(false);
                    }}
                    className="cursor-pointer self-end pt-2 text-sm"
                  >
                    Forgot Password?
                  </p> */}
                  <button
                    disabled={onLogin}
                    type="submit"
                    className="mt-6 flex w-full h-10 bg-[#ffc100] rounded-lg justify-center items-center"
                  >
                    {onLogin ? (
                      <div className="flex flex-row items-center gap-4">
                        <CircularProgress size="18px" color="inherit" />
                        <p className="text-[#1F2F3D] text-sm">
                          Logging in, please wait...
                        </p>
                      </div>
                    ) : (
                      <p className="text-[#1F2F3D] text-sm">Log In</p>
                    )}
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
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
