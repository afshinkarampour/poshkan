import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const ForgetPassword = () => {
  const [forgetPageState, setForgetPageState] = useState("sendOtp");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [phoneErrors, setPhoneErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [timer, setTimer] = useState(70);

  const { setCurrentState, backendUrl } = useContext(ShopContext);

  const MAX_OTP_ATTEMPTS = 3; // حداکثر دفعات مجاز ارسال
  const OTP_BLOCK_DURATION = 24 * 60 * 60 * 1000;

  const validatePhoneNumberInputs = () => {
    let newErrors = {};
    const phoneRegex = /^09\d{9}$/;

    if (!phoneRegex.test(phoneNumber))
      newErrors.phoneNumber = "شماره همراه نامعتبر است";

    setPhoneErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateUpdatePasswordInputs = () => {
    let newErrors = {};

    if (password.length < 8)
      newErrors.password = "رمز عبور باید حداقل ۸ کاراکتر باشد";
    if (password !== repeatPassword)
      newErrors.repeatPassword = "رمز عبور و تکرار آن مطابقت ندارند";

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const onSendOtpHandle = async () => {
    setForgetPageState("enterCode");
    const lastForgetOtpData =
      JSON.parse(localStorage.getItem("forgetOtpData")) || {};
    const { count = 0, lastSent = 0 } = lastForgetOtpData;
    const now = Date.now();

    // بررسی اینکه آیا کاربر بیش از حد مجاز درخواست داده است
    if (count >= MAX_OTP_ATTEMPTS && now - lastSent < OTP_BLOCK_DURATION) {
      toast.error(
        "شما بیش از حد مجاز کد دریافت کرده‌اید. لطفاً بعد از ۲۴ ساعت دوباره امتحان کنید."
      );
      return;
    }

    if (validatePhoneNumberInputs()) {
      try {
        const response = await axios.post(backendUrl + "/api/user/send-otp", {
          phoneNumber,
        });
        if (response.data.success) {
          setTimer(70);
          localStorage.setItem(
            "forgetOtpData",
            JSON.stringify({
              count: count + 1,
              lastSent: now,
            })
          );
          toast.success("کد برای شما ارسال گردید.");
        } else {
          setForgetPageState("sendOtp");
          toast.error("ارسال کد با خطا مواجه شد. لطفاً مجدداً ارسال کنید.");
        }
      } catch (error) {
        setForgetPageState("sendOtp");
        toast.error("خطای شبکه رخ داده است. لطفاً دوباره تلاش کنید.");
        console.error("Error sending OTP:", error);
      }
    } else {
      setForgetPageState("sendOtp");
    }
  };

  const resendOtpHandler = async () => {
    const lastForgetOtpData =
      JSON.parse(localStorage.getItem("forgetOtpData")) || {};
    const { count = 0, lastSent = 0 } = lastForgetOtpData;
    const now = Date.now();

    if (count >= MAX_OTP_ATTEMPTS && now - lastSent < OTP_BLOCK_DURATION) {
      toast.error(
        "شما بیش از حد مجاز کد دریافت کرده‌اید. لطفاً بعد از ۲۴ ساعت دوباره امتحان کنید."
      );
      return;
    }

    if (!phoneNumber.trim()) {
      toast.error("لطفاً شماره همراه را وارد کنید.");
      return;
    }

    if (phoneNumber && timer === 0) {
      setTimer(70);
      try {
        const response = await axios.post(backendUrl + "/api/user/send-otp", {
          phoneNumber,
        });

        if (response.data.success) {
          // setTimer(60); // ریست تایمر
          toast.success("کد مجدداً ارسال شد.");
          localStorage.setItem(
            "forgetOtpData",
            JSON.stringify({
              count: count + 1,
              lastSent: now,
            })
          );
        } else {
          toast.error("خطایی رخ داد، لطفاً دوباره امتحان کنید.");
          setTimer(0);
        }
      } catch (error) {
        setTimer(0);
        toast.error("خطای شبکه رخ داده است. لطفاً دوباره تلاش کنید.");
        console.error("Error resending OTP:", error);
      }
    }
  };

  const onEnterCodeHandle = async () => {
    if (!otp.trim()) {
      toast.error("لطفاً کد تأیید را وارد کنید.");
      return;
    }
    try {
      const otpVerify = await axios.post(backendUrl + "/api/user/verify-otp", {
        phoneNumber,
        otp,
      });
      if (otpVerify.data.success) {
        setForgetPageState("updatePassword");
      }
    } catch (error) {
      toast.error("خطایی رخ داده است. لطفاً دوباره تلاش کنید.");
      console.error("Error during resending code:", error);
    }
  };

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    if (validateUpdatePasswordInputs()) {
      try {
        const response = await axios.post(
          backendUrl + "/api/user/updateforgotedPassword",
          { phoneNumber, password }
        );

        if (response.data.success) {
          toast.success("کلمه عبور شما با موفیت ثبت گردد. لطفا وارد شوید.");
          setCurrentState("SignIn");
        } else {
          toast.error(response.data.message || "خطایی رخ داده است.");
        }
      } catch (error) {
        console.error("Error during updating password:", error);
        toast.error(
          error.response?.data?.message ||
            "خطایی رخ داده است. لطفاً دوباره تلاش کنید."
        );
      }
    }
  };

  return (
    <div className="flex items-center justify-center w-full my-16 bg-white">
      <div className="bg-slate-50 shadow-md rounded-lg px-8 py-6 max-w-md">
        <form onSubmit={onSubmitHandle}>
          <div className="flex items-center justify-center gap-2 mb-2 mt-10">
            <p className="prata-regular text-lg font-bold mb-4">
              فراموشی کلمه‌عبور
            </p>
          </div>
          {forgetPageState === "sendOtp" && (
            <div>
              <div className="w-[250px] sm:w-[300px]">
                <p>شماره همراه</p>
                <input
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  value={phoneNumber}
                  type="text"
                  className="w-full px-3 py-2 my-2 border rounded-md border-gray-500"
                />
                {phoneErrors.phoneNumber && (
                  <p className="text-red-500 text-xs">
                    {phoneErrors.phoneNumber}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onSendOtpHandle}
                disabled={forgetPageState !== "sendOtp" ? true : false}
                className={`w-full rounded-md font-light px-8 py-2 mt-4 ${
                  forgetPageState !== "sendOtp"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#15224c] text-white"
                }`}
              >
                تایید
              </button>
            </div>
          )}
          {forgetPageState === "enterCode" && (
            <div>
              <div className="w-[250px] sm:w-[300px]">
                <p>کد ارسال شده</p>
                <input
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                  type="text"
                  className="w-full px-3 py-2 my-2 border rounded-md border-gray-500"
                />
              </div>
              <div className="flex justify-between gap-2">
                <button
                  type="button"
                  onClick={onEnterCodeHandle}
                  disabled={forgetPageState !== "enterCode" ? true : false}
                  className={`w-full rounded-md font-light px-8 py-2 mt-4 ${
                    forgetPageState !== "enterCode"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#15224c] text-white"
                  }`}
                >
                  تایید
                </button>
                <button
                  type="button"
                  disabled={timer > 0} // اگر تایمر > 0 باشد، دکمه غیرفعال است
                  onClick={resendOtpHandler}
                  className={`w-full rounded-md font-light px-1 py-2 mt-4 
                    ${
                      timer > 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#15224c] text-white cursor-pointer"
                    }`}
                >
                  {timer > 0 ? ` ارسال مجدد کد (${timer}s)` : "ارسال مجدد کد"}
                </button>
              </div>
            </div>
          )}
          {forgetPageState === "updatePassword" && (
            <div>
              <div className="w-[250px] sm:w-[300px]">
                <p>کلمه عبور جدید</p>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  className="w-full px-3 py-2 my-2 border rounded-md border-gray-500"
                />
                {passwordErrors.password && (
                  <p className="text-red-500 text-xs">
                    {passwordErrors.password}
                  </p>
                )}
              </div>
              <div className="w-[250px] sm:w-[300px]">
                <p>تکرار کلمه عبور</p>
                <input
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  value={repeatPassword}
                  type="password"
                  className="w-full px-3 py-2 my-2 border rounded-md border-gray-500"
                />
                {passwordErrors.repeatPassword && (
                  <p className="text-red-500 text-xs">
                    {passwordErrors.repeatPassword}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={forgetPageState !== "updatePassword" ? true : false}
                className={`w-full rounded-md font-light px-8 py-2 mt-4 ${
                  forgetPageState !== "updatePassword"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#15224c] text-white"
                }`}
              >
                تغییر کلمه عبور
              </button>
            </div>
          )}
          <div>
            <p
              className="cursor-pointer underline"
              onClick={() => setCurrentState("SignIn")}
            >
              بازگشت به صفحه ورود
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
