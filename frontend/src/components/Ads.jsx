import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const Ads = () => {
  const { convertToPersianDigits } = useContext(ShopContext);

  return (
    <div className="flex items-center justify-center h-15 py-2 bg-teal-400 text-white text-sm font-bold sm:text-xl md:text-2xl">
      تخفیفــــ‌های ویژه در{"  "}
      <span className="text-[#f01b87] mx-2">پـــــــوشکان </span>
      تا سقف{" "}
      <span className="text-[#f01b87] mx-2">
        {convertToPersianDigits(70)}
      </span>{" "}
      درصد
    </div>
  );
};

export default Ads;
