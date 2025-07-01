import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Modal from "./Modal";

const UserGuideAfterAddedToCart = () => {
  const { isLogin, navigate, showDialogBox, setShowDialogBox, userInfo } =
    useContext(ShopContext);

  return (
    <div className="text-center block p-8 m-auto z-10">
      <Modal isOpen={showDialogBox}>
        <div className={isLogin ? "block" : "hidden"}>
          <img src={assets.logo} alt="" className="w-16 mx-auto" />
          <div className="mt-5 mb-8 flex flex-col gap-3">
            <p>{userInfo ? userInfo.name : "کاربر"} عزیز</p>
            <p>محصول به سبد خرید شما افزوده شد. </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                navigate("/collection");
                setShowDialogBox(false);
              }}
              className="py-1 px-3 text-white bg-lime-400"
            >
              ادامه فرایند خرید
            </button>
            <button
              onClick={() => {
                navigate("/cart");
                setShowDialogBox(false);
              }}
              className="py-1 px-3 text-white bg-fuchsia-400"
            >
              مشاهده سبد خرید
            </button>
          </div>
        </div>
        <div className={!isLogin ? "block" : "hidden"}>
          <img src={assets.logo} alt="" className="w-16 mx-auto" />
          <div className="mt-5 mb-8 flex flex-col gap-3">
            <p>کاربر گرامی</p>
            <p>لطفاً نسبت به ورود به سایت اقدام فرمائید.</p>
          </div>
          <div>
            <button
              onClick={() => {
                localStorage.setItem("previousPageUrl", window.location.href);
                navigate("/login");
                setShowDialogBox(false);
              }}
              className="py-1 px-3 text-white bg-fuchsia-400"
            >
              ورود به سایت
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserGuideAfterAddedToCart;
