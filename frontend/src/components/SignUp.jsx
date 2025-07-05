import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const SignUp = () => {
  const [sendingCodeState, setSendingCodeState] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [family, setFamily] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(70); // اضافه کردن تایمر برای ارسال مجدد

  const { setCurrentState, backendUrl } = useContext(ShopContext);

  const MAX_OTP_ATTEMPTS = 3; // حداکثر دفعات مجاز ارسال
  const OTP_BLOCK_DURATION = 24 * 60 * 60 * 1000;

  const validateInputs = () => {
    let newErrors = {};
    const phoneRegex = /^09\d{9}$/;

    if (!name.trim()) newErrors.name = "نام نمی‌تواند خالی باشد";
    if (!family.trim()) newErrors.family = "نام خانوادگی نمی‌تواند خالی باشد";
    if (!phoneRegex.test(phoneNumber))
      newErrors.phoneNumber = "شماره همراه نامعتبر است";
    if (password.length < 8)
      newErrors.password = "رمز عبور باید حداقل ۸ کاراکتر باشد";
    if (password !== repeatPassword)
      newErrors.repeatPassword = "رمز عبور و تکرار آن مطابقت ندارند";

    setErrors(newErrors);
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

  const onClickHandler = async () => {
    const lastOtpData = JSON.parse(localStorage.getItem("otpData")) || {};
    const { count = 0, lastSent = 0 } = lastOtpData;
    const now = Date.now();

    // بررسی اینکه آیا کاربر بیش از حد مجاز درخواست داده است
    if (count >= MAX_OTP_ATTEMPTS && now - lastSent < OTP_BLOCK_DURATION) {
      toast.error(
        "شما بیش از حد مجاز کد دریافت کرده‌اید. لطفاً بعد از ۲۴ ساعت دوباره امتحان کنید."
      );
      return;
    }

    if (validateInputs()) {
      try {
        const response = await axios.post(backendUrl + "/api/user/send-otp", {
          phoneNumber,
        });
        if (response.data.success) {
          setSendingCodeState(true);
          setTimer(70);
          localStorage.setItem(
            "otpData",
            JSON.stringify({
              count: count + 1,
              lastSent: now,
            })
          );
          toast.success("کد برای شما ارسال گردید.");
        } else {
          toast.error("ارسال کد با خطا مواجه شد. لطفاً مجدداً ارسال کنید.");
        }
      } catch (error) {
        toast.error("خطای شبکه رخ داده است. لطفاً دوباره تلاش کنید.");
        console.error("Error sending OTP:", error);
      }
    }
  };

  const resendOtpHandler = async () => {
    const lastOtpData = JSON.parse(localStorage.getItem("otpData")) || {};
    const { count = 0, lastSent = 0 } = lastOtpData;
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
            "otpData",
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

  const submithandler = async (e) => {
    e.preventDefault();
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
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          family,
          phoneNumber,
          password,
        });
        if (response.data.success) {
          toast.success("اطلاعات شما ثبت شد. لطفاً وارد شوید.");
          setCurrentState("SignIn");
        }
      } else {
        toast.error("کد وارد شده صحیح نمی‌باشد.");
      }
    } catch (error) {
      toast.error("خطایی رخ داده است. لطفاً دوباره تلاش کنید.");
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen my-16 bg-white">
      <div className="bg-slate-50 shadow-md rounded-lg px-8 py-3 w-[300px]">
        <form onSubmit={submithandler}>
          <div className="flex items-center justify-center gap-2 mb-2 mt-10">
            <p className="prata-regular text-lg font-bold mb-4">
              ثبت نام در پوشکان
            </p>
          </div>
          <div className={sendingCodeState ? "hidden" : "block"}>
            <div className="mb-2">
              <p>نام</p>
              <input
                onChange={(e) => setName(e.target.value.trim())}
                value={name}
                type="text"
                className="w-full px-3 py-2 border rounded-md border-gray-500"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
            </div>
            <div className="mb-2">
              <p>نام‌خانوادگی</p>
              <input
                onChange={(e) => setFamily(e.target.value.trim())}
                value={family}
                type="text"
                className="w-full px-3 py-2 border rounded-md border-gray-500"
              />
              {errors.family && (
                <p className="text-red-500 text-xs">{errors.family}</p>
              )}
            </div>
            <div className="mb-2">
              <p>شماره همراه</p>
              <input
                onChange={(e) => setPhoneNumber(e.target.value.trim())}
                value={phoneNumber}
                type="text"
                className="w-full px-3 py-2 border rounded-md border-gray-500"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
              )}
            </div>
            <div className="mb-2">
              <p>کلمه‌عبور (حداقل ۸ کاراکتر)</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                className="w-full px-3 py-2 border rounded-md border-gray-500"
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>
            <div className="mb-2">
              <p>تکرار کلمه‌عبور</p>
              <input
                onChange={(e) => setRepeatPassword(e.target.value)}
                value={repeatPassword}
                type="password"
                className="w-full px-3 py-2 border rounded-md border-gray-500"
              />
              {errors.repeatPassword && (
                <p className="text-red-500 text-xs">{errors.repeatPassword}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClickHandler}
              disabled={sendingCodeState}
              className={`w-full rounded-md font-light px-8 py-2 mt-4 
    ${
      sendingCodeState
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#15224c] text-white"
    }`}
            >
              ثبت‌ نام
            </button>
            <p
              className="cursor-pointer underline"
              onClick={() => setCurrentState("SignIn")}
            >
              عضو هستم
            </p>
          </div>
          <div className={sendingCodeState ? "block" : "hidden"}>
            <div className="mb-2">
              <p>کد دریافت شده</p>
              <input
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                type="text"
                className="w-full px-3 py-2 border rounded-md border-gray-500"
              />
            </div>
            <div className="flex justify-between gap-2">
              <button
                type="submit"
                className="bg-[#528f20] text-white w-full rounded-md font-light px-1 py-2 mt-4"
              >
                ثبت نهایی
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
        </form>
      </div>
    </div>
  );
};

export default SignUp;
