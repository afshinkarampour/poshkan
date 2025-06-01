import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { MdOutlineDiscount } from "react-icons/md";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { requestPayment } from "../services/paymentService";
import axiosInstance from "../services/axiosInstance";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const PlaceOrder = () => {
  const {
    products,
    currency,
    cartItems,
    formatAmount,
    navigate,
    convertToPersianDigits,
    userInfo,
    backendUrl,
    getCartAmount,
    delivery_fee,
  } = useContext(ShopContext);

  const { totalAmountWithDiscount, totalAmount, benefit } = getCartAmount();

  const [cartData, setCartData] = useState([]);
  const [errors, setErrors] = useState({});
  const [code, setCode] = useState("");
  const [today, setToday] = useState(new DateObject());
  const [codeDiscountPrice, setCodeDiscountPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyCodeInput = () => {
    let newErrors = {};
    if (!code.trim()) newErrors.code = "کد تخفیف نمی‌تواند خالی باشد";
    if (code.length > 20) newErrors.code = "کد تخفیف طولانی";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onCodeSubmitHandle = async (e) => {
    e.preventDefault();
    if (verifyCodeInput()) {
      try {
        const response = await axiosInstance.post(
          backendUrl + "/api/copon/verifyCopon",
          { code }
        );
        if (response.data.success) {
          const todayShamsi = today.format("YYYY/MM/DD");
          const { startDate } = response.data.copon;
          const { endDate } = response.data.copon;
          const { codeDiscount } = response.data.copon;
          if (todayShamsi < startDate || endDate < todayShamsi) {
            toast.error("کد نخفیف نامعتبر است");
          } else {
            if (!codeDiscountPrice) {
              setCodeDiscountPrice(codeDiscount);
              setCode("");
              toast.success("کد تخفیف برای شما اعمال گردید.");
            } else {
              toast.error("یکبار می‌توان از کد تخفیف استفاده کرد");
            }
          }
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    if (totalAmountWithDiscount !== 0) {
      if (codeDiscountPrice) {
        totalPrice =
          totalAmountWithDiscount - Number(codeDiscountPrice) + delivery_fee;
      } else {
        totalPrice = totalAmountWithDiscount + delivery_fee;
      }
      return totalPrice;
    }
  };

  // اضافه کردن این تابع برای اعتبارسنجی
  const validateBeforePayment = () => {
    if (!userInfo?.phoneNumber || !userInfo?.address) {
      toast.error("لطفا اطلاعات تماس و آدرس را تکمیل کنید");
      return false;
    }

    if (calculateTotalPrice() <= 0) {
      toast.error("مبلغ پرداخت معتبر نیست");
      return false;
    }

    return true;
  };

  const onPaymentHandle = async () => {
    if (!validateBeforePayment()) return;

    try {
      setLoading(true);
      toast.dismiss(); // بستن تمام toastهای قبلی

      const amount = calculateTotalPrice() * 10; //تبدیل به ریال

      if (amount < 1000) {
        toast.error("حداقل مبلغ پرداخت ۱۰۰۰ ريال می‌باشد");
        return;
      }

      const description = `پرداخت برای سفارش ${userInfo.name} ${userInfo.family} - ${userInfo.phoneNumber}`;

      const userData = {
        name: userInfo.name,
        family: userInfo.family,
        phoneNumber: userInfo.phoneNumber,
        email: userInfo.email || "",
        address: userInfo.address || "",
      };

      toast.info("در حال اتصال به درگاه پرداخت...", { autoClose: false });

      const response = await requestPayment(amount, description, userData);
      window.location.href = response.paymentUrl;
    } catch (error) {
      console.error("Payment error:", error);

      if (error.errors) {
        error.errors.forEach((err) => toast.error(err.message));
      } else {
        toast.error(error.message || "خطا در اتصال به درگاه پرداخت");
      }

      if (error.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  return (
    <div>
      <div className="w-full border flex justify-center py-2 bg-slate-100 text-xl text-[#15224c]">
        مشخصات سفارش
      </div>
      <div className="pb-5">
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );
          return (
            <div key={index}>
              <div className="flex items-center justify-between gap-2 py-1 px-4 md:px-20 sm:gap-6">
                <img
                  className="w-20 sm:w-32"
                  src={
                    `${backendUrl}/uploads/${productData.img[0]}`
                    // assets.product1 ||
                    // productData.img[0].substring(
                    //   0,
                    //   productData.img[0].indexOf("?")
                    // )
                  }
                  alt=""
                />

                <div className="my-auto">
                  <div className="flex justify-center">
                    <p className="text-xs md:text-base lg:text-lg font-bold">
                      {convertToPersianDigits(productData.name)}
                    </p>
                  </div>
                  <div className="flex flex-col justify-between items-center gap-1 sm:gap-2 mt-2">
                    <div className="text-xs md:text-sm lg:text-base flex gap-1">
                      قیمت واحد :
                      <p>
                        {productData.discount
                          ? convertToPersianDigits(
                              formatAmount(productData.discount)
                            )
                          : convertToPersianDigits(
                              formatAmount(productData.price)
                            )}{" "}
                        {currency}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center text-xs md:text-sm lg:text-base">
                  <div className="flex items-center">
                    <p className="font-bold">تعداد :</p>
                    <p className="px-1 py-1">
                      {convertToPersianDigits(item.quantity)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <p className="font-bold">رنگ و سایز :</p>
                    <p className="">{item.size}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full border flex justify-center py-2 bg-slate-100 text-xl text-[#15224c]">
        گیرنده سفارش
      </div>
      <div className="md:px-20 text-sm md:text-base">
        <div className="flex gap-1 px-5 py-1 md:py-3">
          <p>
            {userInfo.gender === "آقا"
              ? userInfo.gender + "ی"
              : userInfo.gender}
          </p>
          <p>{userInfo.name}</p>
          <p>{userInfo.family}</p>
        </div>
        <div className="flex gap-1 px-5 pb-1 md:pb-3">
          <p>همراه : </p>
          <p>{userInfo.phoneNumber}</p>
        </div>
        <div className="flex gap-1 px-5 pb-1 md:pb-3">
          <p>استان : </p>
          <p>{userInfo.province}</p>
        </div>
        <div className="flex gap-1 px-5 pb-1 md:pb-3">
          <p>شهرستان : </p>
          <p>{userInfo.city}</p>
        </div>
        <div className="flex gap-1 px-5 pb-1 md:pb-3">
          <p>آدرس : </p>
          <p>{userInfo.address}</p>
        </div>
        <div className="flex gap-1 px-5 pb-1 md:pb-3">
          <p>کدپستی : </p>
          <p>{userInfo.postalCode}</p>
        </div>
      </div>

      <div className="w-full border flex justify-center py-2 bg-slate-100 text-xl text-[#15224c]">
        کد تخفیف
      </div>
      <form
        onSubmit={onCodeSubmitHandle}
        className="flex flex-col justify-center"
      >
        <div className="flex gap-2 w-[90%] lg:w-1/2 justify-around items-center px-2 py-2 my-2 mx-5 border rounded-lg lg:mx-auto">
          <div className="flex gap-2 items-center">
            <MdOutlineDiscount size={18} />
            <p className="text-sm lg:text-base">کد تخفیف :</p>
          </div>
          <input
            type="text"
            className="w-[50%] outline-none bg-inherit"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button className="px-4 py-1 border rounded-md bg-[#26cc5d] text-white">
            اعمال
          </button>
        </div>
        {errors.code && <p className="text-red-500 text-xs">{errors.code}</p>}
      </form>
      {/*این یک بخش مخفی است که فقط میخوام تاریخ امروز رو ذخیره کنم */}
      <div className="hidden">
        <DatePicker
          value={today}
          onChange={setToday}
          calendar={persian}
          locale={persian_fa}
          calendarPosition="bottom-left"
        />
      </div>

      <div className="w-full border flex justify-center py-2 bg-slate-100 text-xl text-[#15224c]">
        جمع کل
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm px-5 lg:w-1/2 lg:mx-auto">
        <div className="py-2 flex justify-between items-center">
          <p>قیمت کالاها</p>
          <div className="flex">
            <p className="ml-1">
              {convertToPersianDigits(formatAmount(totalAmount))}{" "}
            </p>{" "}
            <p>{currency} </p>
          </div>
        </div>
        <hr />
        <div className="py-2 flex justify-between items-center">
          <p>جمع سبد خرید</p>
          <div className="flex">
            <p>
              {convertToPersianDigits(formatAmount(totalAmountWithDiscount))}
            </p>
            <p className="mr-1">{currency}</p>
          </div>
        </div>
        <hr />
        <div
          style={{ display: benefit > 0 ? "flex" : "none" }}
          className="py-2 justify-between items-center text-red-500"
        >
          <p>سود شما از خرید</p>
          <div className="flex">
            <p>{convertToPersianDigits(formatAmount(benefit))}</p>
            <p className="mr-1">{currency}</p>
          </div>
        </div>
        <hr style={{ display: benefit > 0 ? "block" : "none" }} />
        <div className="py-2 flex justify-between items-center">
          <p>هزینه ارسال</p>
          <div className="flex">
            <p>{convertToPersianDigits(formatAmount(delivery_fee))}</p>
            <p className="mr-1">{currency}</p>
          </div>
        </div>
        <hr />
        <div className="py-2 flex justify-between items-center">
          <b>جمع کل</b>
          <b>
            {convertToPersianDigits(formatAmount(calculateTotalPrice()))}{" "}
            {currency}
          </b>
        </div>
      </div>
      <div className="flex justify-center gap-28 mt-2 my-2 text-sm px-5 lg:w-1/2 lg:mx-auto">
        <button
          onClick={onPaymentHandle}
          disabled={loading}
          className="px-10 py-2 rounded-md bg-[#15224c] text-white disabled:opacity-50"
        >
          {loading ? "در حال اتصال به درگاه..." : "پرداخت"}
        </button>
        <button
          type="button"
          className="px-10 py-2 rounded-md bg-[#15224c] text-white"
          onClick={() => navigate(-1)}
        >
          مرحله قبل
        </button>
      </div>
    </div>
  );
};

export default PlaceOrder;
