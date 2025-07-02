// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import axiosInstance from "../services/axiosInstance";
// import Title from "./Title";

// const Orders = () => {
//   const { backendUrl, formatAmount, convertToPersianDigits } =
//     useContext(ShopContext);

//   const [orderData, setOrderData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const loadOrderData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axiosInstance.get(
//         backendUrl + "/api/payment/userpayments"
//       );
//       //each person many orders and each order many Items
//       if (response.data.success) {
//         setOrderData(response.data.userOrderInfo);
//       }
//     } catch (error) {
//       setError("خطا در دریافت سفارشات. لطفا دوباره تلاش کنید.");
//       console.error("Error loading orders:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadOrderData();
//   }, []);

//   if (loading) return <div>در حال دریافت سفارشات...</div>;
//   if (error) return <div className="text-red-500">{error}</div>;
//   if (orderData.length === 0) return <div>شما هنوز سفارشی ثبت نکرده‌اید.</div>;

//   return (
//     <div>
//       <div className="text-2xl">
//         <Title text1={"سفارش‌های"} text2={"من"} />
//       </div>
//       <div className="mt-4">
//         {orderData.map((item) => {
//           const step1Active = true; // همیشه مرحله 1 فعال هست
//           const step2Active =
//             item.status.includes("بسته") || item.status === "ارسال";
//           const step3Active = item.status === "ارسال";
//           return (
//             <div
//               key={item.refId}
//               className="py-4 grid grid-cols-3 grid-rows-5 gap-1 border-b border-t border-gray-400 mb-4 lg:justify-items-center"
//             >
//               <div className="col-span-3">
//                 <div className="flex items-start gap-6 text-sm">
//                   <p>
//                     شماره سفارش: <span>{item.refId}</span>
//                   </p>
//                   <p>
//                     مبلغ سفارش:{" "}
//                     <span>
//                       {convertToPersianDigits(formatAmount(item.amount))}
//                     </span>{" "}
//                     ریال
//                   </p>
//                   <p>
//                     تاریخ سفارش: <span>{item.faDate}</span>
//                   </p>
//                 </div>
//               </div>
//               {/* starting state stepper */}
//               <div className="col-span-3 row-start-2">
//                 <ol className="flex items-center w-full text-sm text-gray-500 font-medium sm:text-base">
//                   <li
//                     className={`flex md:w-full items-center ${
//                       step1Active ? "text-[#f01b87]" : "text-gray-600"
//                     } sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-400 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8`}
//                   >
//                     <div className="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2">
//                       <span
//                         className={`w-6 h-6 ml-1 ${
//                           step1Active
//                             ? "bg-[#f01b87] border-indigo-200 text-white"
//                             : "bg-gray-100 border-gray-200"
//                         } rounded-full flex justify-center items-center mr-3 text-sm lg:w-8 lg:h-8`}
//                       >
//                         1
//                       </span>{" "}
//                       تایید
//                     </div>
//                   </li>
//                   <li
//                     className={`flex md:w-full items-center ${
//                       step2Active ? "text-[#f01b87]" : "text-gray-600"
//                     } sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-400 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8`}
//                   >
//                     <div className="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2">
//                       <span
//                         className={`w-6 h-6 ml-1 ${
//                           step2Active
//                             ? "bg-[#f01b87] border-indigo-200 text-white"
//                             : "bg-gray-100 border-gray-200"
//                         } rounded-full flex justify-center items-center mr-3 lg:w-8 lg:h-8`}
//                       >
//                         2
//                       </span>{" "}
//                       بسته‌بندی
//                     </div>
//                   </li>
//                   <li
//                     className={`flex md:w-full items-center ${
//                       step3Active ? "text-[#f01b87]" : "text-gray-600"
//                     }`}
//                   >
//                     <div className="flex items-center">
//                       <span
//                         className={`w-6 h-6 ml-1 ${
//                           step3Active
//                             ? "bg-[#f01b87] border-indigo-200 text-white"
//                             : "bg-gray-100 border-gray-200"
//                         } rounded-full flex justify-center items-center mr-3 lg:w-8 lg:h-8`}
//                       >
//                         3
//                       </span>{" "}
//                       ارسال
//                     </div>
//                   </li>
//                 </ol>
//               </div>
//               {/* end stepper */}
//               {item.items?.map((item) => (
//                 <>
//                   <div className="row-span-3 col-start-3 row-start-3">
//                     <img
//                       className="w-20 sm:w-32"
//                       src={`${backendUrl}/uploads/${item?.image}`}
//                       alt=""
//                     />
//                   </div>
//                   <div className="col-span-2 col-start-1 row-start-3">
//                     <p>{item?.name}</p>
//                   </div>
//                   <div className="col-span-2 row-start-4">
//                     <p>سایز و رنگ : {item?.size}</p>
//                   </div>
//                   <div className="col-span-2 row-start-5 pb-1 border-b">
//                     <p>تعداد: {item?.quantity}</p>
//                   </div>
//                 </>
//               ))}
//             </div>

//             // <div
//             //   key={item._id}
//             //   className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
//             // >
//             //
//             //   <div>
//             //     {item.items?.map((item) => (
//             //       <div className="flex justify-around">
//             //         <img
//             //           className="w-20 sm:w-32"
//             //           src={`${backendUrl}/uploads/${item?.image}`}
//             //           alt=""
//             //         />
//             //         <p>{item?.name}</p>
//             //         <p>تعداد : {item?.quantity}</p>
//             //         <p>سایز و رنگ : {item?.size}</p>
//             //       </div>
//             //     ))}
//             //   </div>
//             //   {/* <div className="md:w-1/2 flex justify-between">
//             //     <div className="flex items-center gap-2">
//             //       <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
//             //       <p className="text-sm md:text-base">{item.status}</p>
//             //     </div>
//             //     <button
//             //       onClick={loadOrderData}
//             //       className="border px-4 py-2 text-sm font-medium rounded-sm"
//             //     >
//             //       Track Order
//             //     </button>
//             //   </div> */}
//             // </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Orders;

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
                          ? 'after:w-8 after:h-1 after:mx-2 after:content-[""] after:border-b after:border-gray-400 after:inline-block'
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
