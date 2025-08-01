import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { FaMale, FaFemale, FaGlobe } from "react-icons/fa";
import { IoIosPhonePortrait } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { BsSignpostSplit } from "react-icons/bs";
import { FaMountainCity } from "react-icons/fa6";
import { RiUserFill } from "react-icons/ri";
import { ShopContext } from "../context/ShopContext";
import axiosInstance from "../services/axiosInstance";

const OrderReciverInfo = () => {
  const { backendUrl, userInfo, navigate } = useContext(ShopContext);

  const [errors, setErrors] = useState({});
  const [gender, setGender] = useState(userInfo?.gender || "");
  const [name, setName] = useState(userInfo?.name || "");
  const [family, setFamily] = useState(userInfo?.family || "");
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phoneNumber || "");
  const [postalCode, setPostalCode] = useState(userInfo?.postalCode || "");
  const [province, setProvince] = useState(userInfo?.province || "");
  const [city, setCity] = useState(userInfo?.city || "");
  const [address, setAddress] = useState(userInfo?.address || "");

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
    if (!province.trim()) newErrors.province = "استان نمی‌تواند خالی باشد";
    if (province.length > 50) newErrors.province = "طول رشته طولانی است";
    if (!city.trim()) newErrors.city = "شهر نمی‌تواند خالی باشد";
    if (city.length > 50) newErrors.city = "طول رشته طولانی است";
    if (!address.trim()) newErrors.address = "آدرس نمی‌تواند خالی باشد";
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
          window.location.href = "/place-order";
        } else {
          toast.error(updatedUser.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div>
      <div className="w-full lg:w-1/2 lg:p-4 ">
        <div className="w-full border flex justify-center pl-16 py-2 bg-slate-100 text-xl text-[#15224c]">
          مشخصات گیرنده
        </div>
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
            <div className="lg:flex lg:justify-between">
              <div className="lg:w-[300px]">
                <div className="flex gap-2 items-center px-2 py-2 my-2 mx-5 border rounded-lg">
                  <RiUserFill />
                  <p className="text-sm">نام :</p>
                  <input
                    type="text"
                    className=" "
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
              </div>
              <div className="lg:w-[350px]">
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
              </div>
              {errors.family && (
                <p className="text-red-500 text-xs">{errors.family}</p>
              )}
            </div>
            <div className="lg:flex lg:justify-between">
              <div className="lg:w-[300px]">
                <div className="flex gap-2 items-center px-2 py-2 my-2 mx-5 border rounded-lg">
                  <IoIosPhonePortrait size={20} />
                  <p className="text-sm">همراه :</p>
                  <p className="w-[60%] outline-none bg-inherit">
                    {phoneNumber}
                  </p>
                  {/* <input
                    type="text"
                    className="w-[60%] outline-none bg-inherit"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  /> */}
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
                )}
              </div>
              <div className="lg:w-[350px]">
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
            </div>
            <div className="lg:flex lg:justify-between">
              <div className="lg:w-[300px]">
                <div className="flex gap-2 items-center px-2 py-2 my-2 mx-5  border rounded-lg">
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
              <div className="lg:w-[350px]">
                <div className="flex gap-2 items-center px-2 py-2 my-2 mx-5 border rounded-lg ">
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
            <div className="flex justify-center gap-28 mt-2 my-2 text-sm px-5 lg:w-1/2 lg:mx-auto">
              <button className="px-8 text-nowrap lg:px-16 py-2 rounded-md bg-[#15224c] text-white">
                ثبت و ادامه
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 lg:px-16 text-nowrap py-2 rounded-md bg-[#15224c] text-white"
              >
                مرحله قبل
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderReciverInfo;
