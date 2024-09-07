import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { BASEURL } from "../../config";
import { secondAuth } from "../../firebase";

const getUser = async (authId) => {
  return fetch(`${BASEURL}/api/user/login/${authId}`);
};

const pingServer = async () => {
  return fetch(`${BASEURL}/ping`);
};

const getAllUsers = async () => {
  return fetch(`${BASEURL}/api/user/get/all`);
};

const getUserAuth = async (email, password) => {
  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(secondAuth, email, password)
      .then((user) => {
        const userId = user.user.uid;
        signOut(secondAuth);
        resolve(userId);
      })
      .catch((err) => reject(err));
  });
};

const createUser = async (user) => {
  return fetch(`${BASEURL}/api/user/register`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(user),
  });
};

export { getUser, pingServer, getAllUsers, getUserAuth, createUser };
