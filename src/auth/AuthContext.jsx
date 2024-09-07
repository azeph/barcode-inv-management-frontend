import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { logout } from "../states/user";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async function signin(email, password) {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(auth, email, password)
        .then((val) => {
          resolve(val);
        })
        .catch((err) => reject(err));
    });
  }

  function signout() {
    localStorage.removeItem("user");
    dispatch(logout());
    return signOut(auth);
  }

  async function resetPassword(email) {
    return new Promise((resolve, reject) => {
      sendPasswordResetEmail(auth, email)
        .then((_) => {
          resolve();
        })
        .catch((err) => reject(err));
    });
  }

  // function updateEmail(email) {
  //     return currentUser.updateEmail(email)
  // }

  // function updatePassword(password) {
  //     return currentUser.updatePassword(password)
  // }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signin,
    signout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
