import axioxInstance from "./axiosInstance";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/payment`;

export const requestPayment = async (amount, description, userDate) => {
  try {
    const response = await axioxInstance.post(`${API_URL}/request`, {
      amount,
      description: description.substring(0, 255),
      userDate,
    });
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
