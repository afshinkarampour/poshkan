import React from "react";
import { RiExchangeFundsLine } from "react-icons/ri";
import { BsFillClipboardCheckFill } from "react-icons/bs";
import { BiSupport } from "react-icons/bi";

const OurPolicy = () => {
  return (
    <div
      className={`flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-10 mb-0 text-xs sm:text-sm md:text-base text-[#15224c]`}
    >
      <div>
        <div className="w-12 m-auto mb-5">
          <BsFillClipboardCheckFill size={30} />
        </div>
        <p className="font-semibold">تضمین بهترین کیفیت</p>
        <p className="">ما محصــولات با کیفیتی را به شما ارائه می‌دهیم</p>
      </div>
      <div>
        <div className="w-12 m-auto mb-5">
          <RiExchangeFundsLine size={30} />
        </div>
        <p className="font-semibold">تحویل سریع کالا</p>
        <p className="">
          ما در سریع‌ترین زمان ممکن محصول را به دستان شما می‌رسانیم
        </p>
      </div>
      <div>
        <div className="w-12 m-auto mb-5">
          <BiSupport size={30} />
        </div>
        <p className="font-semibold">پشتیبانی 24 ساعته</p>
        <p className="">با پشتیبانی 24 ساعته در خدمت شما هستیم </p>
      </div>
    </div>
  );
};

export default OurPolicy;
