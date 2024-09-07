import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import AdminHomepage from "./pages/AdminHomepage";
import PrivateRoute from "./components/PrivateRoute";
import AdminLogin from "./pages/AdminLogin";
import Homepage from "./pages/Homepage";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import { pingServer } from "./api/user_api";
import { useDispatch } from "react-redux";
import { login } from "./states/user";
import { customerLogin, logout } from "./states/customer";
import NewHomepage from "./pages/NewHomepage";

function App() {
  let user = JSON.parse(localStorage.getItem("user"));
  let customer = JSON.parse(localStorage.getItem("customer"));

  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    initServer();
    checkUser();
  }, []);

  const initServer = () => {
    pingServer()
      .then((res) => res.json())
      .then((val) => {
        if (!val) {
          return initServer();
        }

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        initServer();
      });
  };

  const checkUser = () => {
    if (user) dispatch(login(user));
  };

  if (isLoading) {
    return <Loader message="Loading, please wait..." />;
  }

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <NewHomepage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminHomepage />
                </PrivateRoute>
              }
            />
            <Route
              path="/clerk"
              element={
                <PrivateRoute>
                  <Homepage />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<AdminLogin />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
