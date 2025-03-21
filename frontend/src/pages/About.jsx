import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { RiExchangeFundsLine } from "react-icons/ri";
import { BsFillClipboardCheckFill } from "react-icons/bs";
import { BiSupport } from "react-icons/bi";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"درباره"} text2={"پوشکان"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img className="w-full md:max-w-[450px] " src={assets.bg3} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-[#15224c]">
          <p>
            {" "}
            فروشگاه اینترنتی پوشکان آماده ارائه انواع پوشکان مردانه، زنانه و
            بچگانه به هم‌وطن‌های عزیز می‌باشد.
          </p>
          <p>
            {" "}
            پوشکان همواره خود را در ارائه پوشاک‌های با کیفیت مسئول می‌داند و در
            این زمینه تمامی تلاش خود را در ارائه محصول باکیفیت و جذب رضایت
            مشتری‌های عزیز انجام می‌دهد.
          </p>
        </div>
      </div>
      <div className="text-xl py-4">
        <Title text1={"با انتخاب"} text2={"پوشکان "} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20 text-[#15224c]">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <BsFillClipboardCheckFill className="mx-auto" size={30} />
          <b className="text-center">تضمین بهترین کیفیت</b>
          <p>ما محصــولات با کیفیتی را به شما ارائه می‌دهیم</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <RiExchangeFundsLine className="mx-auto" size={30} />
          <b className="text-center">تحویل سریع کالا</b>
          <p> ما در سریع‌ترین زمان ممکن محصول را به دستان شما می‌رسانیم</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <BiSupport className="mx-auto" size={30} />
          <b className="text-center">پشتیبانی 24 ساعته</b>
          <p> با پشتیبانی 24 ساعته در خدمت شما هستیم</p>
        </div>
      </div>
    </div>
  );
};

export default About;
