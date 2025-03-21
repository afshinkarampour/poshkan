import React, { useContext } from "react";
import { categories, assets } from "../assets/assets";
import { Link, createSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const MegaMenuCategory = () => {
  const { setCategoryName, setSubCategoryName } = useContext(ShopContext);

  return (
    <div className="md:group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-10">
      <div className="flex flex-col gap-2 w-[600px] max-h-96 py-5 px-5 bg-gradient-to-r from-orange-50 to-fuchsia-50 text-[#15224c] shadow-xl border-y-[6px] border-[#271e31] rounded">
        <div className="absolute right-3 top-2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#271e31]"></div>
        <div>
          <div className="flex justify-evenly text-sm font-bold border-b-2 p-2 border-[#271e31]">
            {categories.map((item, index) => (
              <Link
                key={index}
                to={{
                  pathname: "/product",
                  search: `?${createSearchParams({
                    category: `${item.name}`,
                  })}`,
                }}
                onClick={() => {
                  setCategoryName(item.name);
                  //   setSubCategoryName("");
                }}
                className="cursor-pointer hover:text-[#f01b87]"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex justify-evenly text-[14px] p-2">
            {categories.map((items, index) => (
              <div key={index} className="flex flex-col gap-1">
                {items.subCategory.map((item, index) => (
                  <Link
                    to={{
                      pathname: "/product",
                      search: `?${createSearchParams({
                        category: `${item.name}`,
                      })}`,
                    }}
                    key={index}
                    onClick={() => {
                      setCategoryName(items.name);
                      setSubCategoryName(item.name);
                    }}
                    className="cursor-pointer hover:text-[#f01b87]"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <Link
          to="/collection"
          className="text-center font-bold mt-2 hover:text-[#f01b87]"
        >
          همه محصولات پوشکان
        </Link>
        <div className="absolute bottom-2 left-1 w-16">
          <img src={assets.logo} alt="logo" />
        </div>
      </div>
    </div>
  );
};

export default MegaMenuCategory;
