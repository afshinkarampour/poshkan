import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { MdOutlinePhoneIphone } from "react-icons/md";
import { BsInstagram } from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"تماس"} text2={"با ما"} />
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img className="w-full md:max-w-[480px]" src={assets.bg3} alt="" />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">
            فروشگاه اینترنتی پوشکان
          </p>
          <div className="text-[#15224c]">
            {/* <p className="mt-2 font-bold text-2xl mb-2">پوشکــــان</p> */}
            {/* <img src={assets.logo} className="mb-5 w-32" alt="" /> */}
            <div className="flex gap-2 items-center mr-5 mt-5">
              <MdOutlinePhoneIphone size={23} className="" />
              <p className=""> تلفن پشیبانی : 09183279620</p>
            </div>
            <div className="flex gap-2 items-center mr-5 mt-5">
              <BsInstagram size={23} className="" />
              <p className=""> آدرس صفحه اینستاگرام : poshkan@</p>
            </div>
            {/* <div className="flex gap-2 items-center mr-5 mt-5">
              <FaTelegramPlane size={23} className="" />
              <p className=""> آدرس کانال تلگرام : poshkan@</p>
            </div> */}
          </div>
          {/* <p className="text-gray-500">
            Here your Address <br /> Sute 350, Kerend, Iran
          </p>
          <p className="text-gray-500">
            Tel: (+98) 0212256568 <br /> Email: info@poshkan.com
          </p>
          <p className="font-semibold text-xl text-gray-600">
            Careers at Forever
          </p>
          <p className="text-gray-500">Learn more about our team</p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white translate-all duration-500">
            Explore Jobs
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Contact;
