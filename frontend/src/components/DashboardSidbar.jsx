import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { BsCalendar2Check } from "react-icons/bs";
import { PiBasketBold } from "react-icons/pi";
import { FaRegUser, FaUser } from "react-icons/fa";
import { ImExit } from "react-icons/im";

const DashboardSidbar = ({ userInfo, setShowComponent, showComponent }) => {
  const { handleLogOut } = useContext(ShopContext);
  return (
    <div className="w-[18%] min-h-screen border-l-2">
      <div className="flex flex-col justify-center items-center gap-2 mt-3">
        <FaRegUser className="text-gray-700 border-2 border-gray-500 rounded-full w-10 sm:w-16 h-10 sm:h-16 p-[2px]" />
        <p>{userInfo.name}</p>
      </div>
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <div
          onClick={() => setShowComponent("userInfo")}
          style={{
            backgroundColor: showComponent === "userInfo" ? "#15224c" : "",
            color: showComponent === "userInfo" ? "#fff" : "",
          }}
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l cursor-pointer hover:bg-[#15224c] hover:text-white"
        >
          <FaUser size={25} className="" />
          <p className="hidden md:block">اطلاعات کاربری</p>
        </div>
        <div
          onClick={() => setShowComponent("userOrders")}
          style={{
            backgroundColor: showComponent === "userOrders" ? "#15224c" : "",
            color: showComponent === "userOrders" ? "#fff" : "",
          }}
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l cursor-pointer hover:bg-[#15224c] hover:text-white"
        >
          <BsCalendar2Check size={25} className="" />
          <p className="hidden md:block">سفارش‌های من</p>
        </div>
        <div
          onClick={() => setShowComponent("userCard")}
          style={{
            backgroundColor: showComponent === "userCard" ? "#15224c" : "",
            color: showComponent === "userCard" ? "#fff" : "",
          }}
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l cursor-pointer hover:bg-[#15224c] hover:text-white"
        >
          <PiBasketBold size={25} className="" />
          <p className="hidden md:block">سبدخرید من</p>
        </div>

        <div
          onClick={handleLogOut}
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l cursor-pointer hover:bg-[#15224c] hover:text-white"
        >
          <ImExit size={25} className="" />
          <p className="hidden md:block">خروج</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidbar;
