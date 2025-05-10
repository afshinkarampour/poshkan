import React from "react";
import { assets } from "../assets/assets";
import { MdOutlinePhoneIphone } from "react-icons/md";
import { BsInstagram } from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-slate-800 text-white py-2">
      <div className="px-8 flex flex-col sm:grid grid-cols-[1fr_1fr_1fr] gap-14 text-sm py-2">
        <div>
          <p className="mt-2 font-bold text-2xl mb-2">پوشکــــان</p>
          {/* <img src={assets.logo} className="mb-5 w-32" alt="" /> */}
          <div className="flex gap-2 items-center mr-5 mt-5">
            <MdOutlinePhoneIphone size={23} className="" />
            <p className=""> تلفن پشیبانی : 09121234567</p>
          </div>
          <div className="flex gap-2 items-center mr-5 mt-5">
            <BsInstagram size={23} className="" />
            <p className=""> آدرس صفحه اینستاگرام : poshkan@</p>
          </div>
          <div className="flex gap-2 items-center mr-5 mt-5">
            <FaTelegramPlane size={23} className="" />
            <p className=""> آدرس کانال تلگرام : poshkan@</p>
          </div>
        </div>
        <div>
          <p className="mt-2 font-bold text-2xl mb-5">لینک‌های مفید</p>
          <ul className="flex flex-col gap-4 mr-5">
            <li>صفحه‌اصلی</li>
            <li>درباره ما</li>
            <li>تحویل شده‌ها</li>
            <li>حریم خصوصی</li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5"></p>
          <ul className="flex flex-col gap-1 text-gray-600"></ul>
        </div>
        <div>
          <a
            referrerpolicy="origin"
            target="_blank"
            href="https://trustseal.enamad.ir/?id=608445&Code=WithKEsnlIqb6LgUn7pcIzwNEXMumHhp"
          >
            <img
              referrerpolicy="origin"
              src="https://trustseal.enamad.ir/logo.aspx?id=608445&Code=WithKEsnlIqb6LgUn7pcIzwNEXMumHhp"
              alt=""
              style={{ cursor: "pointer" }}
              code="WithKEsnlIqb6LgUn7pcIzwNEXMumHhp"
            />
          </a>
        </div>
      </div>
      <div className="px-0">
        <hr />
        <p className="pt-3 text-xs sm:text-sm text-center">
          تمامی حقوق برای فروشگاه اینترنتی پوشکان محفوظ می‌باشد.
        </p>
      </div>
    </div>
  );
};

export default Footer;
