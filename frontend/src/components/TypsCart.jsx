//کارتهای نوع در صفحه اصلی
import React from "react";
import { productTypes } from "../assets/assets";
import { Link, createSearchParams } from "react-router-dom";

const TypsCart = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mr-5 cursor-pointer">
      {productTypes.map((item, index) => (
        <Link
          to={{
            pathname: "/type",
            search: `?${createSearchParams({
              type: `${item.name}`,
            })}`,
          }}
          key={index}
          className="bg-gradient-to-r from-violet-200 to-pink-200 h-52 w-[95%] flex justify-around items-center rounded-lg my-3"
        >
          <p className="flex text-[#15224c] text-[24px]">{item.name}</p>

          <img className="w-32" src={item.src} alt="" />
        </Link>
      ))}
    </div>
  );
};

export default TypsCart;
