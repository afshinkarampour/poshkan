import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { MdSpaceDashboard, MdOutlineLogout } from "react-icons/md";
import { PiShoppingCartLight } from "react-icons/pi";
import { MdArrowBackIosNew } from "react-icons/md";
import { ShopContext } from "../context/ShopContext";
import { CgProfile } from "react-icons/cg";
import { TbLogin } from "react-icons/tb";
import { CgMenu } from "react-icons/cg";
import BerifCart from "./BerifCart";

import SerarchBar from "./SerarchBar";

const Navbar = () => {
  const {
    getCartCount,
    navigate,
    userInfo,
    convertToPersianDigits,
    handleLogOut,
  } = useContext(ShopContext);

  const [visible, setVisible] = useState(false);

  const handleLogin = () => {
    localStorage.setItem("previousPageUrl", window.location.href);
    navigate("login");
  };

  return (
    <div className="sticky top-0 z-20 sm:relative">
      <div className="flex items-center justify-between pt-2 sm:px-10 font-medium bg-white">
        <Link to="/">
          <img src={assets.logo} alt="Poshkan" className="w-[75px]" />
        </Link>
        {/* --------------Searchbar-------------- */}
        <div className="w-full lg:w-[60%]">
          <SerarchBar />
        </div>

        <div className="flex items-center gap-1 sm:gap-6 text-[#15224c]">
          <div className="group relative">
            <Link to="/cart">
              <PiShoppingCartLight size={20} />
              {getCartCount() > 0 && (
                <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-[#f01b87] text-white aspect-square rounded-full text-[10px]">
                  {convertToPersianDigits(getCartCount())}
                </p>
              )}
            </Link>
            <BerifCart />
          </div>
          {localStorage.getItem("isLogin") ? (
            <div className="group relative">
              <CgProfile
                onClick={() =>
                  localStorage.getItem("isLogin") ? null : navigate("/login")
                }
                className="cursor-pointer text-[#15224c]"
                size={20}
              />
              {/* Dropdown Menu */}
              {userInfo.name !== "" && (
                <div className="group-hover:block hidden absolute dropdown-menu left-0 pt-4 z-40">
                  <div className="absolute left-3 top-2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#15224c]"></div>
                  <div className="flex flex-col gap-2 w-40 py-5 px-5 bg-[#b8e1d3] text-[#15224c] border-y-4 border-[#15224c] rounded">
                    <p className="flex items-center justify-start gap-4 pr-1 pb-2 cursor-pointer boreder border-b border-[#15224c]">
                      {" "}
                      <MdSpaceDashboard />
                      <Link to="/dashboard">حساب کاربری</Link>
                    </p>
                    <p
                      onClick={handleLogOut}
                      className="flex items-center justify-start gap-4 pr-1 cursor-pointer "
                    >
                      <MdOutlineLogout />
                      خـــــــــروج
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={handleLogin}
              className="flex gap-2 justify-center items-center px-1 sm:px-5 py-3 border border-slate-400 rounded-md cursor-pointer"
            >
              <TbLogin size={20} />
              <p className="text-xs sm:text-sm ">ورود</p>
            </div>
          )}
          <div className="cursor-pointer sm:hidden">
            <CgMenu
              onClick={() => {
                setVisible(true);
              }}
              size={20}
            />
          </div>
        </div>
        {/* sidebar menu for small screens */}
        <div
          className={`absolute top-0 right-0 overflow-hidden bg-white transition-all z-40`}
          style={{ width: visible ? "100%" : "0px" }}
        >
          <div className="flex flex-col text-gray-600">
            <div
              onClick={() => {
                setVisible(false);
              }}
              className="flex items-center gap-4 p-3"
            >
              <div className="h-4 rotate-180 cursor-pointer ">
                <MdArrowBackIosNew size={20} />
              </div>
              <p>بازگشت</p>
            </div>
            <NavLink
              onClick={() => setVisible(false)}
              className="p-2 pl-6 border"
              to="/"
            >
              خانه
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="p-2 pl-6 border"
              to="/collection"
            >
              محصولات
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="p-2 pl-6 border"
              to="/about"
            >
              درباره ما
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="p-2 pl-6 border"
              to="/contact"
            >
              تماس با ما
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
