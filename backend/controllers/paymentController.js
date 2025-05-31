import axios from "axios";
import Joi from "joi";
import Payment from "../models/paymentModel.js";

const ZARINPAL_BASE_URL =
  process.env.ZARINPAL_SANDBOX === "true"
    ? "https://sandbox.zarinpal.com/pg/rest/WebGate/"
    : "https://api.zarinpal.com/pg/rest/WebGate/";

// Schema برای اعتبارسنجی درخواست پرداخت
const paymentRequestSchema = Joi.object({
  amount: Joi.number().min(1000).required().messages({
    "number.base": "مبلغ پرداخت باید عدد باشد",
    "number.min": "حداقل مبلغ پرداخت ۱۰۰۰ ریال می‌باشد",
    "any.required": "مبلغ پرداخت الزامی است",
  }),
  description: Joi.string().min(5).max(255).required().messages({
    "string.base": "توضیحات باید متن باشد",
    "string.min": "توضیحات باید حداقل ۵ کاراکتر باشد",
    "string.max": "توضیحات حداکثر می‌تواند 255 کاراکتر باشد",
    "any.required": "توضیحات پرداخت الزامی است",
  }),
  userData: Joi.object({
    name: Joi.string().required().messages({
      "string.base": "نام باید متن باشد",
      "any.required": "نام کاربر الزامی است",
    }),
    family: Joi.string().required().messages({
      "string.base": "نام خانوادگی باید متن باشد",
      "any.required": "نام خانوادگی کاربر الزامی است",
    }),
    phoneNumber: Joi.string()
      .pattern(/^09[0-9]{9}$/)
      .required()
      .messages({
        "string.pattern.base": "شماره تلفن معتبر نیست",
        "any.required": "شماره تلفن الزامی است",
      }),
    email: Joi.string().email().optional().messages({
      "string.email": "ایمیل معتبر نیست",
    }),
    address: Joi.string().optional(),
  })
    .required()
    .messages({
      "object.base": "اطلاعات کاربر باید به صورت آبجکت باشد",
      "any.required": "اطلاعات کاربر الزامی است",
    }),
});

// Schema برای اعتبارسنجی تایید پرداخت
const paymentVerifySchema = Joi.object({
  Authority: Joi.string().required().messages({
    "string.base": "Authority باید متن باشد",
    "any.required": "Authority الزامی است",
  }),
  Status: Joi.string().valid("OK", "NOK").required().messages({
    "any.only": "Status باید OK یا NOK باشد",
    "any.required": "Status الزامی است",
  }),
});

/**
 * ایجاد درخواست پرداخت جدید
 */
const requestPayment = async (req, res) => {
  try {
    // اعتبارسنجی ورودی‌ها
    const { error, value } = paymentRequestSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: "خطا در اعتبارسنجی داده‌ها",
        errors,
      });
    }

    const { amount, description, userData } = value;

    // ذخیره اطلاعات پرداخت در دیتابیس
    const payment = await Payment.create({
      userId: userData.phoneNumber,
      amount,
      description,
      date: new Date().toISOString(),
      paymentState: false,
      userInfo: {
        name: userData.name,
        family: userData.family,
        phoneNumber: userData.phoneNumber,
        email: userData.email || null,
        address: userData.address || null,
      },
    });

    // درخواست به زرین پال
    const response = await axios.post(
      `${ZARINPAL_BASE_URL}PaymentRequest.json`,
      {
        MerchantID: process.env.ZARINPAL_MERCHANT_ID,
        Amount: amount,
        CallbackURL: process.env.ZARINPAL_CALLBACK_URL,
        Description: description.substring(0, 255), // زرین پال حداکثر 255 کاراکتر می‌پذیرد
      },
      {
        timeout: 10000, // 10 ثانیه timeout
      }
    );

    if (response.data.Status !== 100) {
      await Payment.findByIdAndDelete(payment._id);
      console.error("Zarinpal payment request error:", response.data);

      return res.status(400).json({
        success: false,
        message: "خطا در اتصال به درگاه پرداخت",
        errorCode: response.data.Status,
      });
    }

    // بروزرسانی payment با authority
    payment.authority = response.data.Authority;
    await payment.save();

    res.json({
      success: true,
      paymentUrl: `https://${
        process.env.ZARINPAL_SANDBOX === "true" ? "sandbox" : "www"
      }.zarinpal.com/pg/StartPay/${response.data.Authority}`,
      authority: response.data.Authority,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error("Payment request error:", error);

    if (error.response) {
      console.error("Zarinpal response error:", error.response.data);
    }

    res.status(500).json({
      success: false,
      message: "خطای سرور در ایجاد درخواست پرداخت",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * تایید پرداخت
 */
const verifyPayment = async (req, res) => {
  try {
    // اعتبارسنجی پارامترهای ورودی
    const { error, value } = paymentVerifySchema.validate(req.query, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      console.error("Payment verification validation error:", error.details);
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/failed?reason=invalid_parameters`
      );
    }

    const { Authority, Status } = value;

    if (Status !== "OK") {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/failed?reason=payment_cancelled`
      );
    }

    // پیدا کردن پرداخت در دیتابیس
    const payment = await Payment.findOne({ authority: Authority });

    if (!payment) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/failed?reason=payment_not_found`
      );
    }

    // اگر پرداخت قبلاً تایید شده باشد
    if (payment.paymentState) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/success?refId=${payment.refId}&paymentId=${payment._id}&alreadyVerified=true`
      );
    }

    // تایید پرداخت با زرین پال
    const response = await axios.post(
      `${ZARINPAL_BASE_URL}PaymentVerification.json`,
      {
        MerchantID: process.env.ZARINPAL_MERCHANT_ID,
        Amount: payment.amount,
        Authority: Authority,
      },
      {
        timeout: 10000, // 10 ثانیه timeout
      }
    );

    // بررسی وضعیت پاسخ زرین پال
    if (response.data.Status !== 100 && response.data.Status !== 101) {
      console.error("Zarinpal verification error:", response.data);

      // ذخیره خطای تایید پرداخت
      payment.verificationError = {
        code: response.data.Status,
        message: response.data.Message || "خطای ناشناخته از زرین پال",
      };
      await payment.save();

      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/failed?reason=verification_failed&code=${response.data.Status}`
      );
    }

    // بروزرسانی وضعیت پرداخت
    payment.paymentState = true;
    payment.refId = response.data.RefID;
    payment.verifiedAt = new Date();
    await payment.save();

    // ریدایرکت به صفحه موفقیت آمیز
    res.redirect(
      `${process.env.FRONTEND_URL}/payment/success?refId=${response.data.RefID}&paymentId=${payment._id}`
    );
  } catch (error) {
    console.error("Payment verification error:", error);

    if (error.response) {
      console.error("Zarinpal response error:", error.response.data);
    }

    res.redirect(
      `${process.env.FRONTEND_URL}/payment/failed?reason=server_error`
    );
  }
};

/**
 * دریافت وضعیت پرداخت
 */
const getPaymentStatus = async (req, res) => {
  try {
    // اعتبارسنجی paymentId
    const { error } = Joi.string()
      .hex()
      .length(24)
      .required()
      .validate(req.params.paymentId);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "شناسه پرداخت معتبر نیست",
      });
    }

    const payment = await Payment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "پرداخت یافت نشد",
      });
    }

    // ساخت پاسخ
    const response = {
      success: true,
      paymentState: payment.paymentState,
      amount: payment.amount,
      description: payment.description,
      date: payment.date,
      userInfo: payment.userInfo,
    };

    // اگر پرداخت تایید شده باشد
    if (payment.paymentState) {
      response.refId = payment.refId;
      response.verifiedAt = payment.verifiedAt;
    }

    res.json(response);
  } catch (error) {
    console.error("Get payment status error:", error);

    res.status(500).json({
      success: false,
      message: "خطای سرور در دریافت وضعیت پرداخت",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export { requestPayment, verifyPayment, getPaymentStatus };
