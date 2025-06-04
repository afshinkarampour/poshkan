import axios from "axios";
import axioxInstance from "./axiosInstance";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/payment`;

export const requestPayment = async (amount, description, userData) => {
  // if (!process.env.ZARINPAL_MERCHANT_ID || !process.env.ZARINPAL_CALLBACK_URL) {
  //   throw {
  //     status: 500,
  //     message: "پیکربندی درگاه پرداخت ناقص است",
  //   };
  // }
  try {
    const response = await axios.post(
      `${API_URL}/request`,
      {
        amount,
        description: description.substring(0, 255),
        userData,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Payment request error:", error);
    throw error.response?.data || { message: "خطا در اتصال به سرور" };
  }
};

export const getPaymentStatus = async (paymentId) => {
  try {
    const response = await axioxInstance.get(`${API_URL}/status/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error("Get payment status error:", error);
    throw error.response?.data || { message: "خطا در دریافت وضعیت پرداخت" };
  }
};
