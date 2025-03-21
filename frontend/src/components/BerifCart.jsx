import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";

import { assets } from "../assets/assets";

const BerifCart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    navigate,
    formatAmount,
    convertToPersianDigits,
    maxQuantityInWateHouse,
    backendUrl,
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="hidden md:group-hover:block absolute dropdown-menu left-0 top-5 pt-4 z-10">
      <div
        style={{ display: cartData.length === 0 ? "none" : "block" }}
        className="flex flex-col gap-2 w-[350px] max-h-96 py-5 px-5 bg-[#b8e1d3] text-[#15224c] shadow-xl border-y-[6px] border-[#15224c] rounded"
      >
        <div className="absolute left-4 top-2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#15224c]"></div>
        <p className="text-xs text-[#15224c] pb-1">سبد خرید شما</p>
        <div className="max-h-72 overflow-y-visible overflow-x-hidden">
          {cartData.map((item, index) => {
            const productData = products.find(
              (product) => product._id === item._id
            );
            return (
              <div key={index}>
                <div
                  key={index}
                  style={{
                    borderBottom:
                      index === cartData.length - 1 ? "none" : "solid 1px",
                  }}
                  className="py-5"
                  //   className="py-4 border-t border-b text-gray-700 grid grid-cols-[4rf_0.5fr_0.5fr] sm:grid-cols-[4rf_2fr_0.5fr] items-center gap-4"
                >
                  <div className="flex items-center justify-between pl-2">
                    <div className="flex flex-col gap-2">
                      <img
                        className="w-[80px] h-[100px] object-contain rounded-sm"
                        src={
                          `${backendUrl}/uploads/${productData.img[0]}`
                          // assets.product1 ||
                          // productData.img[0].substring(
                          //   0,
                          //   productData.img[0].indexOf("?")
                          // )
                        }
                        alt=""
                      />
                      <div className="flex flex-col sm:flex-row sm:gap-2 items-center justify-center">
                        <div className="flex gap-1 items-center">
                          {/*باید در دکمه اضافه کردن به سبد خرید این مورد را نیز کنترل کنیم */}
                          {/*سیاست فعلی: بیشتر از دو محصول کاربر نمیتونه به سبد خرید اضافه بکنه */}
                          {/*بنا بر سایت مدیر سایت این رو میتوان به تعداد موجود از رنگ و سایز در انبار تغییر داد */}
                          <FiPlusCircle
                            size={20}
                            style={{
                              color:
                                item.quantity ===
                                maxQuantityInWateHouse(productData, item.size)
                                  ? "gray"
                                  : "#15224c",
                              cursor:
                                item.quantity ===
                                maxQuantityInWateHouse(productData, item.size)
                                  ? "default"
                                  : "pointer",
                            }}
                            onClick={() => {
                              if (
                                item.quantity + 1 >
                                maxQuantityInWateHouse(productData, item.size)
                              )
                                return;
                              updateQuantity(
                                item._id,
                                item.size,
                                item.quantity + 1
                              );
                            }}
                          />
                          <p className="px-2 py-0 border border-[#15224c] font-bold">
                            {convertToPersianDigits(item.quantity)}
                          </p>
                          <FiMinusCircle
                            size={20}
                            style={{
                              display: item.quantity === 1 ? "none" : "block",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              // e.stopPropagation();
                              if (item.quantity - 1 === 0) return;
                              updateQuantity(
                                item._id,
                                item.size,
                                item.quantity - 1
                              );
                            }}
                          />
                          <RiDeleteBin5Line
                            onClick={() => {
                              updateQuantity(item._id, item.size, 0);
                            }}
                            size={20}
                            style={{
                              display: item.quantity === 1 ? "block" : "none",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="">
                      <div className="flex justify-center">
                        <p className="text-xs font-bold">
                          {convertToPersianDigits(productData.name)}
                        </p>
                      </div>
                      <div className="flex flex-col justify-between items-center gap-1 sm:gap-2 mt-2">
                        <div className="text-xs flex gap-1">
                          قیمت واحد :
                          <p>
                            {productData.discount
                              ? convertToPersianDigits(
                                  formatAmount(productData.discount)
                                )
                              : convertToPersianDigits(
                                  formatAmount(productData.price)
                                )}{" "}
                            {currency}
                          </p>
                        </div>
                        <div className="text-xs flex gap-1">
                          رنگ و سایز :<p className="">{item.size}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center ">
          <Link
            to="/user-info-order"
            className="w-full py-1 my-2 border border-[#15224c] dorder-white rounded-md hover:bg-[#15224c] text-center text-sm hover:text-white bg-[#b8e1d3] duration-300 text-[#15224c] hover:border-[#15224c]"
          >
            تکمیل سفارش
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BerifCart;
