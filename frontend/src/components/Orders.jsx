import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import axios from "axios";
import axiosInstance from "../services/axiosInstance";

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
      //each person many orders and each order many Items
      if (response.data.success) {
        // let allOrdersItem = [];
        // response.data.userOrderInfo.map((order) => {
        // order.items.map((item) => {
        //   item["status"] = order.status;
        //   item["payment"] = order.payment;
        //   item["paymentMethod"] = order.paymentMethod;
        //   item["date"] = order.date;
        //   allOrdersItem.push(item);
        // });
        // });
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

  if (loading) return <div>در حال دریافت سفارشات...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (orderData.length === 0) return <div>شما هنوز سفارشی ثبت نکرده‌اید.</div>;

  return (
    <div>
      <div className="text-2xl">
        <Title text1={"سفارش‌های"} text2={"من"} />
      </div>
      <div className="">
        {orderData.map((item) => (
          <div
            key={item._id}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <p>
                شماره سفارش: <span>{item.refId}</span>
              </p>
              <p>
                مبلغ سفارش:{" "}
                <span>{convertToPersianDigits(formatAmount(item.amount))}</span>{" "}
                ریال
              </p>
              <p>
                تاریخ سفارش: <span>{item.faDate}</span>
              </p>
            </div>
            <div>
              {item.items?.map((item) => (
                <div className="flex justify-around">
                  <img
                    className="w-20 sm:w-32"
                    src={`${backendUrl}/uploads/${item?.image}`}
                    alt=""
                  />
                  <p>{item?.name}</p>
                  <p>تعداد : {item?.quantity}</p>
                  <p>سایز و رنگ : {item?.size}</p>
                </div>
              ))}
            </div>
            {/* <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">{item.status}</p>
              </div>
              <button
                onClick={loadOrderData}
                className="border px-4 py-2 text-sm font-medium rounded-sm"
              >
                Track Order
              </button>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
