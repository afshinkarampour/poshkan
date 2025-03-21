import React, { useState, useEffect, useContext } from "react";
import { FaMale, FaFemale, FaGlobe } from "react-icons/fa";
import { RiUserFill } from "react-icons/ri";
import { IoIosPhonePortrait } from "react-icons/io";
import { FaMountainCity } from "react-icons/fa6";
import { IoLockClosed, IoLocationSharp } from "react-icons/io5";
import { MdSyncLock } from "react-icons/md";
import { BsSignpostSplit } from "react-icons/bs";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axiosInstance from "../services/axiosinstance";

const UserInfo = () => {
  const { backendUrl, userInfo } = useContext(ShopContext);

  const [errors, setErrors] = useState({});
  const [passwordFormErrors, setPasswordFormErrors] = useState({});

  const [gender, setGender] = useState(userInfo?.gender || "");
  const [name, setName] = useState(userInfo?.name || "");
  const [family, setFamily] = useState(userInfo?.family || "");
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phoneNumber || "");
  const [postalCode, setPostalCode] = useState(userInfo?.postalCode || "");
  const [province, setProvince] = useState(userInfo?.province || "");
  const [city, setCity] = useState(userInfo?.city || "");
  const [address, setAddress] = useState(userInfo?.address || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");

  useEffect(() => {
    if (userInfo) {
      setGender(userInfo.gender || "");
      setName(userInfo.name || "");
      setFamily(userInfo.family || "");
      setPhoneNumber(userInfo.phoneNumber || "");
      setPostalCode(userInfo.postalCode || "");
      setProvince(userInfo.province || "");
      setCity(userInfo.city || "");
      setAddress(userInfo.address || "");
    }
  }, [userInfo]);

  const validateUserInfoInputs = () => {
    let newErrors = {};
    const phoneRegex = /^09\d{9}$/;

    if (!name.trim()) newErrors.name = "نام نمی‌تواند خالی باشد";
    if (name.length > 50)
      newErrors.name = "طول نام نیمتواند بیش از 50 کاراکتر باشد";
    if (!family.trim()) newErrors.family = "نام خانوادگی نمی‌تواند خالی باشد";
    if (family.length > 50)
      newErrors.family = "طول نام خانوادگی نیمتواند بیش از 50 کاراکتر باشد";
    if (!phoneRegex.test(phoneNumber))
      newErrors.phoneNumber = "شماره همراه نامعتبر است";
    if (postalCode.length !== 10)
      newErrors.province = "کد پستی باید 10 رقم باشد.";
    if (province.length > 50) newErrors.province = "طول رشته طولانی است";
    if (city.length > 50) newErrors.city = "طول رشته طولانی است";
    if (address.length > 150) newErrors.address = "طول رشته طولانی است";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onUserInfoSubmit = async (e) => {
    e.preventDefault();
    if (validateUserInfoInputs()) {
      try {
        const updatedUser = await axiosInstance.post(
          backendUrl + "/api/user/updateUserInfo",
          {
            gender,
            name,
            family,
            phoneNumber,
            postalCode,
            province,
            city,
            address,
          }
        );
        if (updatedUser.data.success) {
          toast.success("اطلاعات شما با موفقیت بروزرسانی شد.");
        } else {
          toast.error(updatedUser.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const validateChangePasswordInputs = () => {
    let newErrors = {};
    if (currentPassword.length < 1)
      newErrors.currentPassword = "رمز عبور فعلی را وارد کنید";
    if (newPassword.length < 8)
      newErrors.newPassword = "رمز عبور جدید باید حداقل ۸ کاراکتر باشد";
    if (newPassword !== repeatNewPassword)
      newErrors.repeatNewPassword = "رمز عبور جدید و تکرار آن مطابقت ندارند";

    setPasswordFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (validateChangePasswordInputs()) {
      try {
        const response = await axiosInstance.post(
          backendUrl + "/api/user/updateNewPassword",
          { phoneNumber, currentPassword, newPassword }
        );
        if (response.data.success) {
          toast.success("کلمه‌عبور شما با موفقیت بروزرسانی شد.");
          setCurrentPassword("");
          setNewPassword("");
          setRepeatNewPassword("");
        } else {
          toast.error(response.data.response.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:gap-4">
      <div className="w-full lg:p-4 ">
        <div className="w-full border flex justify-center pl-16 py-2 bg-slate-100 text-xl text-[#15224c]">
          اطلاعات شخصی
        </div>
        <div>
          <form onSubmit={onUserInfoSubmit}>
            <div className="flex flex-col text-[#15224c]">
              <div className="flex gap-5 py-4 px-7 text-sm">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="آقا"
                    onChange={(e) => setGender(e.target.value)}
                    name="gender"
                    checked={gender === "آقا"}
                  />
                  <FaMale size={17} />
                  آقا
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="خانم"
                    onChange={(e) => setGender(e.target.value)}
                    name="gender"
                    checked={gender === "خانم"}
                  />
                  <FaFemale size={17} />
                  خانم
                </label>
              </div>
              <div>
                <div className="flex gap-2 items-center px-2 py-2 my-2 mx-5 border rounded-lg">
                  <RiUserFill />
                  <p className="text-sm">نام :</p>
                  <input
                    type="text"
                    className="w-[60%] outline-none bg-inherit"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
              </div>
              <div>
                <div className="flex gap-2 items-center px-2 py-2 my-2 mx-5 border rounded-lg">
                  <RiUserFill />
                  <p className="text-sm">نام‌خانوادگی :</p>
                  <input
                    type="text"
                    className="w-[60%] outline-none bg-inherit"
                    value={family}
                    onChange={(e) => setFamily(e.target.value)}
                  />
                </div>
                {errors.family && (
                  <p className="text-red-500 text-xs">{errors.family}</p>
                )}
              </div>
              <div>
                <div className="flex gap-2 items-center px-2 py-2 my-2 mx-5 border rounded-lg">
                  <IoIosPhonePortrait size={20} />
                  <p className="text-sm">همراه :</p>
                  <input
                    type="text"
                    className="w-[60%] outline-none bg-inherit"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
                )}
              </div>
              <div>
                <div className="flex gap-2 items-center px-2 py-2 my-2 mx-5 border rounded-lg">
                  <BsSignpostSplit size={20} />
                  <p className="text-sm">کدپستی :</p>
                  <input
                    type="text"
                    className="w-[60%] outline-none bg-inherit"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
                {errors.postalCode && (
                  <p className="text-red-500 text-xs">{errors.postalCode}</p>
                )}
              </div>
              <div>
                <div className="flex gap-2 items-center px-2 py-2 my-2 mx-5 border rounded-lg">
                  <FaGlobe size={20} />
                  <p className="text-sm">استان :</p>
                  <input
                    type="text"
                    className="w-[60%] outline-none bg-inherit"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                  />
                </div>
                {errors.province && (
                  <p className="text-red-500 text-xs">{errors.province}</p>
                )}
              </div>
              <div>
                <div className="flex gap-2 items-center px-2 py-2 my-2 mx-5 border rounded-lg">
                  <FaMountainCity size={20} />
                  <p className="text-sm">شهر :</p>
                  <input
                    type="text"
                    className="w-[60%] outline-none bg-inherit"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                {errors.city && (
                  <p className="text-red-500 text-xs">{errors.city}</p>
                )}
              </div>
              <div>
                <div className="flex gap-2  px-2 py-2 my-2 mx-5 border rounded-lg">
                  <IoLocationSharp size={20} />
                  <p className="text-sm">آدرس :</p>
                  <textarea
                    type="text"
                    rows="6"
                    className="w-[60%] outline-none bg-inherit"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                {errors.address && (
                  <p className="text-red-500 text-xs">{errors.address}</p>
                )}
              </div>
              <button className="bg-[#15224c] text-white mx-5 my-3 py-1 rounded-lg">
                ویرایش اطلاعات
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="w-full mt-5 lg:mt-0 lg:p-4">
        <div className="w-full border flex justify-center pl-16 py-2 bg-slate-100 text-xl text-[#15224c]">
          تغییر کلمه عبور
        </div>
        <form onSubmit={onChangePasswordSubmit} className="text-[#15224c] mt-4">
          <div>
            <div className="flex gap-2 items-center px-1 py-2 mx-5 lg:my-0 border rounded-lg">
              <IoLockClosed size={20} />
              <p className="text-sm">کلمه‌عبور فعلی :</p>
              <input
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                type="password"
                className="w-[55%] outline-none bg-inherit"
              />
            </div>
            {passwordFormErrors.currentPassword && (
              <p className="text-red-500 text-xs">
                {passwordFormErrors.currentPassword}
              </p>
            )}
          </div>
          <div>
            <div className="flex gap-2 items-center px-1 py-2 my-4 mx-5 border rounded-lg">
              <IoLockClosed size={20} />
              <p className="text-sm">کلمه‌عبور جدید :</p>
              <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                className="w-[55%] outline-none bg-inherit"
              />
            </div>
            {passwordFormErrors.newPassword && (
              <p className="text-red-500 text-xs">
                {passwordFormErrors.newPassword}
              </p>
            )}
          </div>
          <div>
            <div className="flex gap-2 items-center px-1 py-2 my-2 mx-5 border rounded-lg">
              <MdSyncLock size={20} />
              <p className="text-sm">تکرار کلمه‌عبور :</p>
              <input
                value={repeatNewPassword}
                onChange={(e) => setRepeatNewPassword(e.target.value)}
                type="password"
                className="w-[55%] outline-none bg-inherit"
              />
            </div>
            {passwordFormErrors.repeatNewPassword && (
              <p className="text-red-500 text-xs">
                {passwordFormErrors.repeatNewPassword}
              </p>
            )}
          </div>
          <button className="bg-[#15224c] text-white w-[90%] mx-5 my-3 py-1 rounded-lg">
            تغییر کلمه‌عبور
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserInfo;
