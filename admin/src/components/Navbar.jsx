import React from "react";
import { assets } from "../assets/assets";
import axiosInstance from "../services/axiosInstance";

const Navbar = ({ setLogin }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const handleLogout = () => {
    axiosInstance.post(backendUrl + "/api/user/adminlogout");

    setLogin(false);
    localStorage.setItem("isLogin", false);
  };

  return (
    <div className="flex items-center py-2 px-[4%] justify-between bg-[#b8e1d3] border-b-[3px] border-[#15224c]">
      <img className="w-[max(10%,80px)]" src={assets.logo} alt="" />
      <button
        onClick={handleLogout}
        className="bg-[#15224c] text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        خروج
      </button>
    </div>
  );
};

export default Navbar;
