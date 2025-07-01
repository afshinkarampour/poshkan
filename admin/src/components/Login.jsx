import React, { useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import axiosInstance from "../services/axiosInstance";
import ReCAPTCHA from "react-google-recaptcha";

const Login = ({ setLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleCaptchaVerify = (token) => {
    setCaptchaToken(token);
  };

  const validateInputs = () => {
    let newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) newErrors.email = "ایمیل نامعتبر است";
    if (password.length < 1)
      newErrors.password = "رمز عبور نمی‌تواند خالی باشد";
    if (!captchaToken) {
      alert("Please verify the reCAPTCHA");
      return;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (validateInputs()) {
      try {
        setLoading(true);
        const response = await axiosInstance.post(
          backendUrl + "/api/user/admin",
          {
            email,
            password,
            captchaToken,
          }
        );
        if (response.data.success) {
          localStorage.setItem("isLogin", true);
          setLogin(true);
        } else {
          localStorage.setItem("isLogin", false);
          toast.error(response.data.message);
          setLogin(false);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mr-[74px] mb-4"></h1>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">ایمیل</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="rounded w-full px-3 py-2 border border-gray-300 outline-none"
              type="email"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">کلمه عبور</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="rounded w-full px-3 py-2 border border-gray-300 outline-none"
              type="password"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaVerify}
          />
          <button
            className="mt-2 w-full py-2 px-4 rounded-md text-white bg-[#15224c]"
            type="submit"
            disabled={loading}
          >
            {" "}
            ورود
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
