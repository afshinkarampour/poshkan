import React from "react";
import { NavLink } from "react-router-dom";
import { IoAddCircleOutline } from "react-icons/io5";
import { BsCalendar2Check } from "react-icons/bs";
import { AiOutlineProduct } from "react-icons/ai";
import { MdOutlineDiscount } from "react-icons/md";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-l-[3px] border-[#15224c] bg-[#b8e1d3]">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink
          className="flex items-center gap-3 border border-[#15224c] border-r-0 px-3 py-2 rounded-l text-[#15224c] hover:bg-[#15224c] hover:text-white"
          to="/add"
        >
          <IoAddCircleOutline size={25} className="" />
          <p className="hidden md:block">ثبت جدید</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-[#15224c] border-r-0 px-3 py-2 rounded-l text-[#15224c] hover:bg-[#15224c] hover:text-white"
          to="/list"
        >
          <AiOutlineProduct size={25} className="" />
          <p className="hidden md:block"> محصولات</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-[#15224c] border-r-0 px-3 py-2 rounded-l text-[#15224c] hover:bg-[#15224c] hover:text-white"
          to="/orders"
        >
          <BsCalendar2Check size={25} className="" />
          <p className="hidden md:block">سفارش‌ها</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-[#15224c] border-r-0 px-3 py-2 rounded-l text-[#15224c] hover:bg-[#15224c] hover:text-white"
          to="/copon"
        >
          <MdOutlineDiscount size={25} className="" />
          <p className="hidden md:block">کد تخفیف</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
