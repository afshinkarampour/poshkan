import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getPaymentStatus } from "../services/paymentService";

const PaymentVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const searchParams = new URLSearchParams(location.search);
      const paymentId = searchParams.get("paymentId");
      const refId = searchParams.get("refId");
      const reason = searchParams.get("reason");

      if (reason) {
        handlePaymentFailure(reason);
        return;
      }

      if (!paymentId) {
        navigate("/", { replace: true });
        return;
      }

      try {
        const response = await getPaymentStatus(paymentId);

        if (!response.success) {
          throw new Error(response.message || "پرداخت یافت نشد");
        }

        setPayment(response);

        if (response.paymentState) {
          toast.success("پرداخت با موفقیت انجام شد");
        } else {
          toast.warning("پرداخت هنوز تایید نشده است");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setError(err.message || "خطا در بررسی وضعیت پرداخت");
        toast.error(err.message || "خطا در بررسی وضعیت پرداخت");
      } finally {
        setLoading(false);
      }
    };

    const handlePaymentFailure = (reason) => {
      setLoading(false);
      setError(getErrorMessage(reason));
      toast.error(getErrorMessage(reason));
    };

    verifyPayment();
  }, [location, navigate]);

  const getErrorMessage = (reason) => {
    const messages = {
      payment_cancelled: "پرداخت توسط کاربر لغو شد",
      payment_not_found: "اطلاعات پرداخت یافت نشد",
      verification_failed: "تایید پرداخت ناموفق بود",
      server_error: "خطای سرور در پردازش پرداخت",
      invalid_parameters: "پارامترهای پرداخت نامعتبر است",
      default: "پرداخت ناموفق بود",
    };

    return messages[reason] || messages.default;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">در حال بررسی وضعیت پرداخت...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      {error ? (
        <div className="text-center text-red-600">
          <h2 className="text-xl font-bold mb-4">{error}</h2>
          <button
            onClick={() => navigate("/cart")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            بازگشت به سبد خرید
          </button>
        </div>
      ) : payment?.paymentState ? (
        <div className="text-center text-green-600">
          <h2 className="text-xl font-bold mb-2">پرداخت موفقیت آمیز بود</h2>
          <div className="space-y-2 text-left my-4">
            <p>
              <span className="font-semibold">شماره پیگیری:</span>{" "}
              {payment.refId}
            </p>
            <p>
              <span className="font-semibold">مبلغ:</span>{" "}
              {payment.amount.toLocaleString()} ریال
            </p>
            <p>
              <span className="font-semibold">تاریخ:</span>{" "}
              {new Date(payment.date).toLocaleString("fa-IR")}
            </p>
          </div>
          <button
            onClick={() => navigate("/orders")}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            مشاهده سفارشات
          </button>
        </div>
      ) : (
        <div className="text-center text-yellow-600">
          <h2 className="text-xl font-bold mb-4">وضعیت پرداخت نامشخص</h2>
          <p className="mb-4">
            پرداخت شما هنوز تایید نشده است. ممکن است تا چند دقیقه دیگر وضعیت به
            روزرسانی شود.
          </p>
          <button
            onClick={() => navigate("/cart")}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
          >
            بازگشت به سبد خرید
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentVerify;
