import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const CartTotal = () => {
  const {
    currency,
    delivery_fee,
    getCartAmount,
    convertToPersianDigits,
    formatAmount,
  } = useContext(ShopContext);

  const { totalAmountWithDiscount, totalAmount, benefit } = getCartAmount();

  return (
    <div className="w-full">
      <div className="w-full border flex justify-center py-2 bg-slate-100 text-xl text-[#15224c]">
        جمع سبدخرید
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="py-2 flex justify-between items-center">
          <p>قیمت کالاها</p>
          <div className="flex">
            <p className="ml-1">
              {convertToPersianDigits(formatAmount(totalAmount))}{" "}
            </p>{" "}
            <p>{currency} </p>
          </div>
        </div>
        <hr />
        <div className="py-2 flex justify-between items-center">
          <p>جمع سبد خرید</p>
          <div className="flex">
            <p>
              {convertToPersianDigits(formatAmount(totalAmountWithDiscount))}
            </p>
            <p className="mr-1">{currency}</p>
          </div>
        </div>
        <hr />
        <div
          style={{ display: benefit > 0 ? "flex" : "none" }}
          className="py-2 justify-between items-center text-red-500"
        >
          <p>سود شما از خرید</p>
          <div className="flex">
            <p>{convertToPersianDigits(formatAmount(benefit))}</p>
            <p className="mr-1">{currency}</p>
          </div>
        </div>
        {/* <hr style={{ display: benefit > 0 ? "block" : "none" }} />
        <div className="py-2 flex justify-between items-center">
          <p>هزینه ارسال</p>
          <div className="flex">
            <p>{convertToPersianDigits(formatAmount(delivery_fee))}</p>
            <p className="mr-1">{currency}</p>
          </div>
        </div> */}
        <hr />
        <div className="py-2 flex justify-between items-center">
          <b>جمع کل سبدخرید</b>
          <b>
            {totalAmountWithDiscount === 0
              ? 0
              : convertToPersianDigits(
                  formatAmount(totalAmountWithDiscount + delivery_fee)
                )}{" "}
            {currency}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
