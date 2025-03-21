import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "react-toastify/dist/ReactToastify.css";
import Welcome from "./components/Welcome";
import Edit from "./pages/Edit";
import AddCopon from "./pages/AddCopon";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "تومان";

const App = () => {
  const [isLogin, setLogin] = useState(
    localStorage.getItem("isLogin") ? localStorage.getItem("isLogin") : false
  );

  useEffect(() => {
    setLogin(localStorage.getItem("isLogin"));
  }, []);

  useEffect(() => {
    setLogin(localStorage.getItem("isLogin"));
  }, [isLogin]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {!localStorage.getItem("isLogin") ||
      localStorage.getItem("isLogin") === "false" ||
      isLogin === false ? (
        <Login setLogin={setLogin} />
      ) : (
        <>
          <Navbar setLogin={setLogin} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[80%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/" element={<Welcome />} />

                <Route path="/add" element={<Add isLogin={isLogin} />} />
                <Route path="/list" element={<List />} />
                <Route path="/orders" element={<Orders isLogin={isLogin} />} />
                <Route
                  path="/product/:productId"
                  element={<Edit isLogin={isLogin} />}
                />
                <Route path="/copon" element={<AddCopon />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
