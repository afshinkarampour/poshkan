import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axiosInstance from "../services/axiosInstance";
import Title from "./Title";

const Orders = () => {
  const { backendUrl, formatAmount, convertToPersianDigits } =
    useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrderData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        backendUrl + "/api/payment/userpayments"
      );
      if (response.data.success) {
        setOrderData(response.data.userOrderInfo);
      }
    } catch (error) {
      setError("خطا در دریافت سفارشات. لطفا دوباره تلاش کنید.");
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, []);

  if (loading)
    return <div className="text-center mt-10">در حال دریافت سفارشات...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (orderData.length === 0)
    return (
      <div className="text-center mt-10">شما هنوز سفارشی ثبت نکرده‌اید.</div>
    );

  return (
    <div className="px-4">
      <div className="text-2xl mb-4">
        <Title text1="سفارش‌های" text2="من" />
      </div>
      <div className="space-y-6">
        {orderData.map((order) => {
          const step1Active = true;
          const step2Active =
            order.status.includes("بسته") || order.status === "ارسال";
          const step3Active = order.status === "ارسال";

          return (
            <div
              key={order.refId}
              className="border border-gray-300 rounded-xl p-4 shadow-sm"
            >
              {/* Order Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-700 mb-4 gap-2">
                <p>
                  شماره سفارش:{" "}
                  <span className="font-semibold">{order.refId}</span>
                </p>
                <p>
                  تاریخ سفارش: <span>{order.faDate}</span>
                </p>
                <p>
                  مبلغ:{" "}
                  <span>
                    {convertToPersianDigits(formatAmount(order.amount))} ریال
                  </span>
                </p>
              </div>

              {/* Stepper */}
              <div className="mb-4">
                <ol className="flex items-center justify-center sm:justify-start w-full text-sm text-gray-500 font-medium">
                  {[
                    { title: "تایید", active: step1Active },
                    { title: "بسته‌بندی", active: step2Active },
                    { title: "ارسال", active: step3Active },
                  ].map((step, index) => (
                    <li
                      key={index}
                      className={`flex items-center ${
                        index < 2
                          ? 'after:w-3 sm:after:w-8 after:h-1 after:mx-1 sm:after:mx-2 after:content-[""] after:border-b after:border-gray-400 after:inline-block'
                          : ""
                      } ${step.active ? "text-pink-600" : "text-gray-400"}`}
                    >
                      <span
                        className={`w-6 h-6 mr-2 ${
                          step.active ? "bg-pink-600 text-white" : "bg-gray-200"
                        } rounded-full flex items-center justify-center`}
                      >
                        {index + 1}
                      </span>
                      {step.title}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Order Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center border rounded-md p-2 gap-4"
                  >
                    <img
                      className="w-20 h-20 object-cover rounded-md border"
                      src={`${backendUrl}/uploads/${item?.image}`}
                      alt={item?.name}
                    />
                    <div className="flex-1 space-y-1 text-sm">
                      <p className="font-semibold">{item?.name}</p>
                      <p>سایز و رنگ: {item?.size}</p>
                      <p>تعداد: {item?.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
