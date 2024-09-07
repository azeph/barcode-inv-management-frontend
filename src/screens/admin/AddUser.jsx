import {
  XMarkIcon,
  PencilSquareIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import { CircularProgress, Backdrop } from "@mui/material";
import React, { useEffect, useState, useRef, useReducer, useMemo } from "react";
import userIcon from "../../assets/images/user.png";
import { CLOUDINARY_URL } from "../../../config";
import { loginCustomer, registerCustomer } from "../../api/customer_api";
import { useDispatch } from "react-redux";
import { show } from "../../states/alerts";
import { customerLogin } from "../../states/customer";
import { useNavigate } from "react-router-dom";
import roles from "../../assets/data/user_type.json";
import { createUser, getUserAuth } from "../../api/user_api";
import firebase_errors from "../../assets/data/firebase_errors.json";

function AddUser({ close }) {
  const hiddenFileInput = useRef(null);
  const [fileError, setFileError] = useState("");
  const [fileImage, setFileImage] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = useMemo(
    () =>
      roles["userType"].map((role) => {
        return {
          label: role["type"],
          value: role,
        };
      }),
    [roles]
  );

  const [form, updateForm] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      imageUrl: null,
      userType: null,
    }
  );

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const fileUploaded = event.target.files[0];

    if (!allowedTypes.includes(fileUploaded.type)) {
      setFileError("Invalid image file.");
      return;
    }
    setFileError(null);
    setFileImage(fileUploaded);
  };

  const imageDisplay = (photo) => {
    if (photo != null) {
      return (
        <div className="relative w-full h-full rounded-full">
          <div className="absolute opacity-0 hover:opacity-100 bg-black/40 w-[90px] h-[90px] rounded-full p-[1px]">
            <div className="flex flex-row items-center text-white justify-center h-full gap-2 cursor-pointer select-none">
              <PencilSquareIcon className="w-5" />
              <p className="text-xs font-lato-bold flex flex-row gap-1 items-center">
                Edit Image
              </p>
            </div>
          </div>
          <img
            src={URL.createObjectURL(photo)}
            className="object-cover w-[90px] h-[90px] rounded-full"
          />
        </div>
      );
    }
    return (
      <div className="relative flex flex-col cursor-pointer select-none">
        <img src={userIcon} className="rounded-full object-cover" />
        <div className="absolute right-0 bottom-0 rounded-full bg-white w-7 p-1 border shadow-md flex items-center">
          <CameraIcon className="w-6 " />
        </div>
      </div>
    );
  };

  const uploadImage = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "inventoryApp");

    return fetch(`${CLOUDINARY_URL}/image/upload`, {
      method: "POST",
      body: data,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (fileImage == null) {
      setFileError("Please add user profile photo.");
      return;
    }

    if (form["password"] != form["confirm_password"])
      return setFileError("Password confirmation does not matched.");

    setFileError(null);
    setLoading(true);

    const data = await uploadImage(fileImage)
      .then((res) => res.json())
      .then((data) => data)
      .catch((error) => {
        setLoading(false);
        dispatch(
          show({
            type: "error",
            message: "Something went wrong.",
            duration: 3000,
            show: true,
          })
        );
      });

    if (!data) return setLoading(false);

    const authId = await getUserAuth(form["email"], form["password"]).catch(
      (err) => {
        return setFileError(firebase_errors[err.code]);
      }
    );

    let newForm = form;

    newForm["authId"] = authId;
    newForm["imageUrl"] = data.url;
    newForm["userType"] = JSON.parse(e.target[5].value);

    createUser(newForm)
      .then((res) => {
        if (res.status != 200) {
          setLoading(false);
          dispatch(
            show({
              type: "error",
              message: "Something went wrong.",
              duration: 3000,
              show: true,
            })
          );

          return;
        }

        setLoading(false);
        dispatch(
          show({
            type: "success",
            message: "Account created successfully, please sign in.",
            duration: 3000,
            show: true,
          })
        );

        setTimeout(() => {
          handleReset();
        }, 1000);
      })
      .catch((err) => {
        setLoading(false);
        dispatch(
          show({
            type: "error",
            message: "Failed, something went wrong.",
            duration: 3000,
            show: true,
          })
        );
      });
  };

  const handleReset = (e) => {
    Object.keys(form).forEach((inputKey) => {
      updateForm({ [inputKey]: "" });
    });

    setFileError("");
    setFileImage(null);
    close();
  };

  return (
    <>
      <div className="relative w-[450px] h-[550px] text-[#555C68] bg-white shadow-sm border rounded-lg mx-2">
        {isLoading && (
          <div className="absolute z-10 rounded-lg w-full h-full flex items-center justify-center bg-white/60">
            <CircularProgress color="inherit" className="text-[#ffc100]" />
          </div>
        )}
        <div className="flex flex-col h-full w-full p-4">
          <div className="flex flex-row justify-end">
            <XMarkIcon
              onClick={() => {
                close();
                handleReset();
              }}
              className="w-5 cursor-pointer"
            />
          </div>
          <form
            onSubmit={handleSignup}
            onReset={handleReset}
            className="flex flex-col w-full px-8 py-2"
          >
            <div className="w-full flex items-center justify-center">
              <div
                onClick={handleClick}
                className="w-[90px] text-[#555C68]/70 h-[90px] rounded-full border-[#555C68]/50 border shadow-lg"
              >
                <input
                  onChange={handleChange}
                  ref={hiddenFileInput}
                  type="file"
                  className="hidden"
                  accept="image/png, image/gif, image/jpeg"
                />
                {imageDisplay(fileImage)}
              </div>
            </div>
            <div className="flex flex-col pt-2 w-full">
              <label className="text-sm font-lato-bold">Full name</label>
              <input
                value={form.name}
                onChange={(e) => {
                  updateForm({ name: e.target.value });
                }}
                required
                className="px-2 my-1 w-full h-8 border border-[#555C68]/50 rounded-lg focus:outline-none"
              ></input>
            </div>
            <div className="flex flex-col w-full">
              <label className="text-sm font-lato-bold">Email</label>
              <input
                value={form.email}
                onChange={(e) => {
                  updateForm({ email: e.target.value });
                }}
                pattern="([A-Za-z0-9][._]?)+[A-Za-z0-9]@[A-Za-z0-9]+(\.?[A-Za-z0-9]){2}\.(com?|net|org)+(\.[A-Za-z0-9]{2,4})?"
                required
                className="px-2 my-1 w-full h-8 border border-[#555C68]/50 rounded-lg focus:outline-none"
              ></input>
            </div>
            <div className="flex flex-col w-full">
              <label className="text-sm font-lato-bold">Password</label>
              <input
                value={form.password}
                onChange={(e) => {
                  updateForm({ password: e.target.value });
                }}
                required
                type="password"
                className="px-2 my-1 w-full h-8 border border-[#555C68]/50 rounded-lg focus:outline-none"
              ></input>
            </div>
            <div className="flex flex-col w-full">
              <label className="text-sm font-lato-bold">Confirm Password</label>
              <input
                value={form.confirm_password}
                onChange={(e) => {
                  updateForm({ confirm_password: e.target.value });
                }}
                required
                type="password"
                className="px-2 my-1 w-full h-8 border border-[#555C68]/50 rounded-lg focus:outline-none"
              ></input>
            </div>
            <div className="flex flex-col w-full">
              <label className="text-sm font-lato-bold">User Type</label>
              <div className="w-full h-8 rounded-md focus:outline-none border border-[#555C68]/50 px-1 my-1">
                <select
                  required
                  className="w-full h-full focus:outline-none bg-transparent text-sm "
                >
                  {role.map((item, i) => (
                    <option id={item.id} value={JSON.stringify(item.value)}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 w-full h-9 bg-[#ffc100] font-lato-bold rounded-lg"
            >
              Create User
            </button>
            {fileError && (
              <p className="pt-2 flex-1 text-sm text-[#ff3333]">{fileError}</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default AddUser;
