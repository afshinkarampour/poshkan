import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axiosInstance from "../services/axiosInstance";
import ReCAPTCHA from "react-google-recaptcha";

//در این فایل قسمت هایی که به کامنت تبدیل شده، برای کپچا می‌باشد

const SignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [value, setValue] = useState("");
  const [errors, setErrors] = useState({});

  const { setCurrentState, backendUrl, setLogin } = useContext(ShopContext);

  const handleCaptchaVerify = (token) => {
    setCaptchaToken(token);
  };

  const validateInputs = () => {
    let newErrors = {};
    const phoneRegex = /^09\d{9}$/;

    if (!phoneRegex.test(phoneNumber))
      newErrors.phoneNumber = "شماره همراه نامعتبر است";
    if (password.length < 1)
      newErrors.password = "رمز عبور نمی‌تواند خالی باشد";
    if (value) {
      if (!captchaToken) {
        alert("Please verify the reCAPTCHA");
        return;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (validateInputs()) {
      try {
        const response = await axiosInstance.post(
          backendUrl + "/api/user/login",
          {
            phoneNumber,
            password,
            captchaToken,
          }
        );

        if (response.data.success) {
          setLogin(true);
          toast.success("به پوشکان خوش آمدید");
          localStorage.setItem("isLogin", true);
          navigate("/");
          // window.location.href = "/";
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error(error.response?.data?.message || "خطا در ورود به سیستم");
      }
    }
  };

  return (
    <div className="flex items-center justify-center w-full my-16 bg-white">
      <div className="bg-slate-50 shadow-md rounded-lg px-8 py-6 max-w-md">
        <form onSubmit={onSubmitHandler} className="">
          <div className="flex items-center justify-center gap-2 mb-2 mt-10">
            <p className="prata-regular text-lg font-bold mb-4">
              ورود به پوشکان
            </p>
          </div>
          <div className="w-[300px]">
            <p>شماره همراه</p>
            <input
              onChange={(e) => setPhoneNumber(e.target.value)}
              value={phoneNumber}
              type="text"
              className="w-full px-3 py-2 my-2 border rounded-md border-gray-500"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
            )}
          </div>
          <div className="w-[300px]">
            <p>کلمه‌عبور</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="w-full px-3 py-2 my-2 border rounded-md border-gray-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>
          <div className="w-[300px] hidden">
            <p>کلمه‌عبور</p>
            <input
              onChange={(e) => setValue(e.target.value)}
              value={value}
              type="password"
              outoComplete="off"
              className="w-full px-3 py-2 my-2 border rounded-md border-gray-500"
            />
          </div>
          {value && (
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaVerify}
            />
          )}
          <button
            type="submit"
            className="bg-[#15224c] text-white w-full rounded-md font-light px-8 py-2 mt-4"
          >
            ورود
          </button>
          <div className="flex justify-between mt-1">
            <p
              className="cursor-pointer underline"
              onClick={() => setCurrentState("SignUp")}
            >
              ثبت‌نام
            </p>
            <p
              className="cursor-pointer underline"
              onClick={() => setCurrentState("ForgetPassword")}
            >
              فراموشی کلمه‌عبور
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
