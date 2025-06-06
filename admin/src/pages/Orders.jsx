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
      const response = await axiosInstance.post(backendUrl + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axiosInstance.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value }
      );
      if (response.data.success) {
        await fetchAllorders();
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
            <option value="تایید سفارش">تایید سفارش</option>
            <option value="ارسال سفارش">ارسال سفارش</option>
            <option value="تحویل داده شده">تحویل داده شده</option>
            <option value="لغو شده">لغو شده</option>
          </select>
        </div>
      </div>
      <div>
        <div>
          {showOrders.map((order, index) => (
            <div
              className="grid grid-cols-1 sm:grig-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gary-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700 bg-white"
              key={index}
            >
              <AiFillProduct className="w-12 " size={50} />
              {/* <img src="" alt="" /> */}
              <div>
                <div>
                  <span className="ml-2"> مشخصات محصول سفارش شده:</span>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return (
                        <div>
                          <p className="py-0.5" key={index}>
                            {item.name} / {item.quantity} /
                            <span className="ml-2">{item.size}</span> ,
                          </p>
                        </div>
                      );
                    } else {
                      return (
                        <div>
                          {/* <span className="ml-2"> مشخصات محصول:</span> */}
                          <p className="py-0.5" key={index}>
                            {item.name} / {item.quantity} /
                            <span className="ml-2">{item.size}</span>
                          </p>
                        </div>
                      );
                    }
                  })}
                </div>
                <p className="mt-3 mb-2 font-medium">
                  <p className="ml-2">نام و نام خانوادگی:</p>
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div>
                  <p>آدرس پستی:</p>
                  <p>{order.address.street + ","}</p>
                  <p>
                    {order.address.city +
                      ", " +
                      order.address.state +
                      ", " +
                      order.address.country +
                      ", " +
                      order.address.zipCode}
                  </p>
                </div>
                <p>
                  <span className="ml-2">همراه: </span>
                  {order.address.phone}
                </p>
              </div>
              <div>
                <p className="text-sm sm:text-[15px]">
                  تعداد سفارش: {order.items.length}
                </p>
                {/* <p className="mt-3">Method : {order.paymentMethod}</p> */}
                {/* <p>
                  پرداخت شده{order.payment ? "پرداخت انجام شد" : "درحال پرداخت"}
                </p> */}
                <p>تاریخ پرداخت: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className="text-sm sm:text-[15px]">
                <span className="ml-2">مبلغ پرداخت شده:</span>
                <div className="flex gap-1">
                  <p>{order.amount}</p>
                  <p>{currency}</p>
                </div>
              </p>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="p-2 font-semibold"
              >
                <option value="تایید سفارش">تایید سفارش</option>
                <option value="ارسال سفارش">ارسال سفارش</option>
                <option value="تحویل داده شده">تحویل داده شده</option>
                <option value="لغو شده">لغو شده</option>
              </select>
            </div>
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
