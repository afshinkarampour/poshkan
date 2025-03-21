//کارت های دسته بندی در صفحه اصلی: مردانه و بچگانه
import React, { useContext } from "react";
import Title from "./Title";
import { categories } from "../assets/assets";
import { Link, createSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const CategoriesCart = () => {
  const { setCategoryName } = useContext(ShopContext);

  return (
    <div className="mt-10 px-3">
      <div className="flex justify-center">
        <Title text1={"دستــــه‌بنـــدی‌های"} text2={"پوشکـــان"} />
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center">
        {categories.map((category) => (
          <Link
            to={{
              pathname: "/product",
              search: `?${createSearchParams({
                category: `${category.name}`,
              })}`,
            }}
            onClick={() => setCategoryName(category.name)}
            key={category.id}
            // className="m-2 pt-2 w-[300px] sm:w-[600px] md:w-[700px] h-[200px] sm:h-[300px] lg:h-[400px] border border-gray-300 rounded-md bg-gradient-to-r from-violet-200 to-pink-200 cursor-pointer"
            className="m-2 pt-2 w-[95%] sm:w-[100%] h-[200px] sm:h-[300px] lg:h-[400px] border border-gray-300 rounded-md bg-gradient-to-r from-violet-200 to-pink-200 cursor-pointer"
          >
            <div className="flex items-center justify-around h-[100%] w-[100%]">
              <div className="py-2 border-b-2 border-[#15224c]">
                <p className="font-bold text-lg sm:text-4xl text-[#15224c]">
                  {category.name}
                </p>
              </div>
              <img
                src={category.src}
                alt={category.alt}
                className="w-[50%] h-[100%]"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesCart;
