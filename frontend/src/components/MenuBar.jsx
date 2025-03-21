import React from "react";
import { NavLink } from "react-router-dom";
import MegaMenuCategory from "./MegaMenuCategory";

const MenuBar = () => {
  return (
    <div className="w-full z-10 sticky top-0 shadow-md">
      <ul className="hidden sm:flex gap-6 justify-center bg-[#271e31] text-white text-base sm:py-3 sm:mt-4">
        <NavLink
          to="/"
          className="flex flex-col items-center gap-1 hover:text-[#f01b87]"
        >
          <p>پوشکان</p>
        </NavLink>
        <div className="group relative">
          <NavLink
            to="/collection"
            className="flex flex-col items-center gap-1 group-hover:text-[#f01b87]"
          >
            <p>محصولات</p>
          </NavLink>
          <MegaMenuCategory />
        </div>
        <NavLink
          to="/about"
          className="flex flex-col items-center gap-1 hover:text-[#f01b87]"
        >
          <p>درباره ما</p>
        </NavLink>
        <NavLink
          to="/contact"
          className="flex flex-col items-center gap-1 hover:text-[#f01b87]"
        >
          <p>تماس با ما</p>
        </NavLink>
      </ul>
    </div>
  );
};

export default MenuBar;
