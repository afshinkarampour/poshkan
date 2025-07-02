import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

import { assets } from "../assets/assets"; //بعدا این را حذف کنم

const ProductsItems = ({
  id,
  image,
  name,
  price,
  discount = null,
  warehouseInventory,
  bottomColor = "bg-teal-400",
  priceColor = "#f01b87",
}) => {
  const { currency, convertToPersianDigits, formatAmount, backendUrl } =
    useContext(ShopContext);

  return (
    <Link
      to={`/product/${id}#topPage`}
      className="text-gray-700 cursor-pointer"
      dir="rtl"
    >
      <div className={`border border-gray-200  ${bottomColor}`}>
        <div className="relative overflow-hidden w-full h-auto max-w-[200px] max-h-[280px] sm:max-w-[250px] sm:max-h-[320px] md:max-w-[280px] md:max-h-[350px] mx-auto">
          <img
            className="hover:scale-110 transition ease-in-out w-full h-full object-contain"
            src={
              `${backendUrl}/uploads/${image[0]}`
              // assets.product1 || image[0].substring(0, image[0].indexOf("?"))
            }
            alt={name}
            loading="lazy"
          />
          <div
            style={{
              display:
                discount !== null && discount > 0 && warehouseInventory > 0
                  ? "block"
                  : "none",
            }}
            className={`absolute top-3 right-0 py-1 px-4 text-white rounded-l-full bg-[#f01b87]`}
          >
            {discount
              ? convertToPersianDigits(
                  Math.round(((price - discount) / price) * 100)
                )
              : ""}{" "}
            %
          </div>
          <div
            style={{
              display:
                warehouseInventory <= 2 && warehouseInventory > 0
                  ? "block"
                  : "none",
            }}
            className="absolute bottom-0 right-2 left-2 px-1 bg-[#15224c] text-white text-[11px] text-center rounded-t-lg opacity-90"
          >
            فقط {convertToPersianDigits(warehouseInventory)} عدد در انبار باقی
            مانده است
          </div>
        </div>
        <p className="flex justify-center items-center h-10 text-[12px] md:text-[15px] text-center bg-white text-[#15224c]">
          {convertToPersianDigits(name)}
        </p>
        <div
          style={{
            display: warehouseInventory <= 0 ? "none" : "block",
          }}
          className="text-[12px] md:text-[15px]"
        >
          <p className="py-2 text-md font-medium text-left">
            <span className={`mx-1 text-[${priceColor}]`}>
              {discount !== null && discount > 0
                ? convertToPersianDigits(formatAmount(discount))
                : ""}
            </span>
            <span
              style={{
                textDecoration:
                  discount !== null && discount > 0 ? "line-through" : "none",
                color:
                  discount !== null && discount > 0 ? "#15224c" : priceColor,
              }}
            >
              {convertToPersianDigits(formatAmount(price))}
            </span>
            <span style={{ color: priceColor }}>{currency}</span>
          </p>
        </div>
        <div
          style={{
            display: warehouseInventory <= 0 ? "block" : "none",
          }}
          className="py-2"
        >
          موجود نمی‌باشد
        </div>
      </div>
    </Link>
  );
};

export default ProductsItems;
