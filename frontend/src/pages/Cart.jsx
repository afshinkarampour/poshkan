import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { IoTrashBinOutline } from "react-icons/io5";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";

const Cart = () => {
  const {
    products,
    currency,
    navigate,
    cartItems,
    backendUrl,
    formatAmount,
    updateQuantity,
    maxQuantityInWateHouse,
    convertToPersianDigits,
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

  {
    return cartData.length === 0 ? (
      <div className="flex flex-col gap-10 justify-center items-center py-44">
        <img src={assets.emptycart} alt="emptycart" className="h-36" />
        <p className="text-2xl text-[#15224c]">سبد خرید شما خالی است !</p>
      </div>
    ) : (
      <div className="border-t pt-14 px-2 lg:px-36">
        <div className="w-full border flex justify-center py-2 bg-slate-100 text-xl text-[#15224c]">
          سبد خرید
        </div>
        <div>
          {cartData.map((item, index) => {
            const productData = products.find(
              (product) => product._id === item._id
            );
            return (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[4rf_0.5fr_0.5fr] sm:grid-cols-[4rf_2fr_0.5fr] items-center gap-4"
              >
                <div className="flex items-center justify-between gap-2 sm:gap-6">
                  <img
                    className="w-20 sm:w-36"
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
                    تعداد :
                    <div className="flex gap-1 items-center">
                      {/*باید در دکمه اضافه کردن به سبد خرید این مور را نیز کنترل کنیم */}
                      {/*سیاست فعلی: بیشتر از دو محصول کاربر نمیتونه به سبد خرید اضافه بکنه */}
                      {/*بنا بر سایت مدیر سایت این رو میتوان به تعداد موجود از رنگ و سایز در انبار تغییر داد */}
                      <FiPlusCircle
                        size={20}
                        style={{
                          color:
                            item.quantity ===
                            maxQuantityInWateHouse(productData, item.size)
                              ? "gray"
                              : "black",
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
                      <p className="px-4 py-1 border font-bold">
                        {convertToPersianDigits(item.quantity)}
                      </p>
                      <FiMinusCircle
                        size={20}
                        style={{
                          color: item.quantity === 1 ? "gray" : "black",
                          cursor: item.quantity === 1 ? "default" : "pointer",
                        }}
                        onClick={() => {
                          if (item.quantity - 1 === 0) return;
                          updateQuantity(
                            item._id,
                            item.size,
                            item.quantity - 1
                          );
                        }}
                      />
                    </div>
                  </div>

                  <div className="my-auto">
                    <div className="flex justify-center">
                      <p className="text-xs md:text-base lg:text-lg font-bold">
                        {convertToPersianDigits(productData.name)}
                      </p>
                    </div>
                    <div className="flex flex-col justify-between items-center gap-1 sm:gap-2 mt-2">
                      <div className="text-xs md:text-sm lg:text-base flex gap-1">
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
                      <div className="text-xs md:text-sm lg:text-base flex gap-1">
                        رنگ و سایز :<p className="">{item.size}</p>
                      </div>
                    </div>
                  </div>
                  <IoTrashBinOutline
                    onClick={() => {
                      updateQuantity(item._id, item.size, 0);
                    }}
                    className="min-w-4 max-w-5 sm:w-5 cursor-pointer"
                    size={25}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end my-20">
          <div className="w-full sm:w-[450px]">
            <CartTotal />
            <div className="w-full text-end">
              <button
                onClick={() => navigate("/user-info-order")}
                className="bg-[#15224c] text-white text-sm my-8 px-8 py-3"
              >
                تایید و تکمیل سفارش{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Cart;
