import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import Pagination from "../components/Pagination";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App";
import { AiFillProduct } from "react-icons/ai";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showOrders, setShowOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const applyFilter = () => {
    let copyOrders = orders.slice();
    if (selectedStatus !== "all") {
      copyOrders = copyOrders.filter((o) => o.status.includes(selectedStatus));
    }
    setFilteredOrders(copyOrders);
  };

  useEffect(() => {
    applyFilter();
  }, [orders, selectedStatus]);

  const fetchAllorders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        backendUrl + "/api/payment/allPayments"
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setError("خطا در دریافت سفارشات. لطفا دوباره تلاش کنید.");
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, paymentId) => {
    try {
      const newStatus = event.target.value;

      const response = await axiosInstance.post(
        backendUrl + "/api/payment/updateStatus",
        { paymentId, status: newStatus }
      );
      if (response.data.success) {
        const updatedOrders = orders.map((order) =>
          order._id === paymentId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);

        // حالا فیلتر بر اساس مقدار جدید اعمال می‌کنیم
        let filtered = updatedOrders;

        if (selectedStatus !== "all") {
          filtered = updatedOrders.filter((o) =>
            o.status.includes(selectedStatus)
          );
        }

        setFilteredOrders(filtered);

        // چون showOrders از filteredOrders ساخته می‌شه:
        const indexOfLastProduct = currentPage * itemsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
        const pageItems = filtered.slice(
          indexOfFirstProduct,
          indexOfLastProduct
        );

        setShowOrders(pageItems);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllorders();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const itemsPerPage = 15;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  //Pagination
  useEffect(() => {
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    setShowOrders(
      filteredOrders.slice(indexOfFirstProduct, indexOfLastProduct)
    );
  }, [filteredOrders, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus]);

  function convertToPersianDigits(input) {
    if (!input) return null;
    // Convert the input to a string to ensure replace works
    const inputStr = input.toString();
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return inputStr.replace(/\d/g, (digit) => persianDigits[digit]);
  }

  function formatAmount(amount) {
    // Check if the input is a valid number
    if (typeof amount !== "number" && typeof amount !== "string") {
      console.error(
        "Invalid input type. Input must be a number or a numeric string."
      );
      return "Invalid input";
    }
    // Convert input to a string
    const amountStr = amount.toString();
    // Validate if it's a numeric string
    if (!/^\d+$/.test(amountStr)) {
      console.error(
        "Input contains invalid characters. Only numbers are allowed."
      );
      return "Invalid input";
    }
    // Use regex to format with commas
    return amountStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if (loading) return <div>در حال دریافت سفارشات...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (showOrders.length === 0) return <div>سفارشی برای نمایش وجود ندارد.</div>;

  return (
    <div className="">
      <h3 className="text-center">صفحه سفارش‌ها</h3>
      <div className="text-xs border shadow-md p-1">
        <p className="font-bold">فیلتر سفارش‌ها</p>
        <div className="flex justify-center gap-2 items-center mb-2">
          <p>براساس وضعیت</p>
          <select
            onChange={(e) => {
              setSelectedStatus(e.target.value);
            }}
            name="status"
            className="w-full md:w-32 lg:w-48 py-1 bg-yellow-200"
          >
            <option value="all">همه‌ حالت‌ها</option>
            <option value="تایید">تایید</option>
            <option value="بسته‌ بندی">بسته‌ بندی</option>
            <option value="ارسال">ارسال</option>
          </select>
        </div>
      </div>
      <div>
        <div>
          {showOrders.map((order, index) => (
            <div className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 text-xs sm:text-sm text-gray-700 bg-white rounded-lg shadow-sm hover:shadow-md transition">
              <AiFillProduct className="w-12" size={50} />

              <div>
                <p className="font-bold mb-1">📦 مشخصات محصول:</p>
                <p className="py-0.5">
                  {order.items?.map(
                    (item, i) =>
                      `${item.name} / ${item.quantity} / ${item.size}` +
                      (i !== order.items.length - 1 ? " , " : "")
                  )}
                </p>

                <p className="mt-4 font-medium">
                  👤 نام: {order.userData.name + " " + order.userData.family}
                </p>
                <p>
                  📍 آدرس: {order.userData?.province} / {order.userData?.city}
                </p>
                <p>{order.userData.address}</p>
                <p>📱 {order.userData.phoneNumber}</p>
              </div>

              <div>
                <p>🔢 شماره سفارش: {order.refId}</p>
                <p>📅 تاریخ پرداخت: {order?.faDate}</p>
                <p>🧾 تعداد آیتم‌ها: {order.items?.length || 0}</p>
              </div>

              <div>
                <p className="font-semibold">💰 مبلغ پرداخت شده:</p>
                <div className="flex gap-1">
                  <p>{convertToPersianDigits(formatAmount(order.amount))}</p>
                  <p>ریال</p>
                </div>
              </div>

              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status || "تایید"}
                className="p-2 font-semibold bg-yellow-100 border border-gray-300 rounded-md"
              >
                <option value="تایید">تایید</option>
                <option value="بسته‌ بندی">بسته‌ بندی</option>
                <option value="ارسال">ارسال</option>
              </select>
            </div>

            // <div
            //   className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gary-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700 bg-white"
            //   key={index}
            // >
            //   <AiFillProduct className="w-12 " size={50} />
            //   <div>
            //     <div>
            //       <span className="ml-2">مشخصات محصول سفارش شده:</span>
            //       <p className="py-0.5">
            //         {Array.isArray(order?.items)
            //           ? order?.items
            //               .map(
            //                 (item) =>
            //                   `${item?.name} / ${item?.quantity} / ${item?.size}`
            //               )
            //               .join(" , ")
            //           : "بدون آیتم"}
            //       </p>
            //     </div>

            //     <p className="mt-3 mb-2 font-medium">
            //       <p className="ml-2">نام و نام خانوادگی:</p>
            //       {order.userData.name + " " + order.userData.family}
            //     </p>
            //     <div>
            //       <p>آدرس پستی:</p>
            //       <p>
            //         {order.userData?.province} / {order.userData?.city}
            //       </p>
            //       <p>{order.userData.address}</p>
            //     </div>
            //     <p>
            //       <span className="ml-2">همراه: </span>
            //       {order.userData.phoneNumber}
            //     </p>
            //   </div>
            //   <div>
            //     <p>شماره سفاره: {order.refId}</p>
            //     <p className="text-sm sm:text-[15px]">
            //       تعداد سفارش:{" "}
            //       {Array.isArray(order.items) ? order.items.length : 0}
            //     </p>
            //     {/* <p className="mt-3">Method : {order.paymentMethod}</p> */}
            //     {/* <p>
            //         پرداخت شده{order.payment ? "پرداخت انجام شد" : "درحال پرداخت"}
            //       </p> */}
            //     <p>تاریخ پرداخت: {order?.faDate}</p>
            //   </div>
            //   <p className="text-sm sm:text-[15px]">
            //     <span className="ml-2">مبلغ پرداخت شده:</span>
            //     <div className="flex gap-1">
            //       <p>{convertToPersianDigits(formatAmount(order.amount))}</p>
            //       <p>ریال</p>
            //     </div>
            //   </p>
            //   <select
            //     onChange={(event) => statusHandler(event, order._id)}
            //     value={order.status || "تایید"}
            //     className="p-2 font-semibold"
            //   >
            //     <option value="تایید">تایید</option>
            //     <option value="بسته‌ بندی">بسته‌ بندی</option>
            //     <option value="ارسال">ارسال</option>
            //     {/* <option value="لغو شده">لغو شده</option> */}
            //   </select>
            // </div>
          ))}
        </div>
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Orders;
