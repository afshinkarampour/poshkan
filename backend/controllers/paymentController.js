import axios from "axios";
import Joi from "joi";
import Payment from "../models/paymentModel.js";

const ZARINPAL_BASE_URL =
  process.env.ZARINPAL_SANDBOX === "true"
    ? "https://sandbox.zarinpal.com/pg/rest/WebGate/"
    : "https://api.zarinpal.com/pg/rest/WebGate/";

// اعتبارسنجی درخواست پرداخت
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
    address: Joi.string().optional(),
  })
    .required()
    .messages({
      "object.base": "اطلاعات کاربر باید به صورت آبجکت باشد",
      "any.required": "اطلاعات کاربر الزامی است",
    }),
});

// اعتبارسنجی تایید پرداخت
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

    // 1. ارسال درخواست به زرین‌پال
    const response = await axios.post(
      `${ZARINPAL_BASE_URL}PaymentRequest.json`,
      {
        MerchantID: process.env.ZARINPAL_MERCHANT_ID,
        Amount: amount,
        CallbackURL: process.env.ZARINPAL_CALLBACK_URL,
        Description: description.substring(0, 255),
      },
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    // بررسی پاسخ زرین‌پال
    if (response.data.Status !== 100) {
      console.error("خطا در پاسخ زرین‌پال:", response.data);
      return res.status(400).json({
        success: false,
        message: "خطا در اتصال به درگاه پرداخت",
        errorCode: response.data.Status,
      });
    }

    // 2. ایجاد رکورد پرداخت پس از دریافت پاسخ موفق از زرین‌پال
    const payment = await Payment.create({
      userId: userData.phoneNumber,
      amount,
      description,
      paymentState: false,
      authority: response.data.Authority,
      refId: null,
      verifiedAt: null,
      verificationError: null,
      userData: {
        name: userData.name,
        family: userData.family,
        phoneNumber: userData.phoneNumber,
        address: userData.address || null,
      },
    });

    res.json({
      success: true,
      paymentUrl: `https://${
        process.env.ZARINPAL_SANDBOX === "true" ? "sandbox" : "www"
      }.zarinpal.com/pg/StartPay/${response.data.Authority}`,
      authority: response.data.Authority,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error("خطا در ایجاد درخواست پرداخت:", error);

    // مدیریت خطاهای خاص
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "تراکنش تکراری",
        error: "DUPLICATE_TRANSACTION",
      });
    }

    if (error.response) {
      console.error("خطا در پاسخ زرین‌پال:", error.response.data);
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
      console.error("خطا در اعتبارسنجی تایید پرداخت:", error.details);
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/failed?reason=invalid_parameters`
      );
    }

    const { Authority, Status } = value;

    // بررسی وضعیت اولیه
    if (Status !== "OK") {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/failed?reason=payment_cancelled`
      );
    }

    // یافتن پرداخت در دیتابیس
    const payment = await Payment.findOne({ authority: Authority });

    if (!payment) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/failed?reason=payment_not_found`
      );
    }

    // بررسی پرداخت‌های تکراری
    if (payment.paymentState) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/success?refId=${payment.refId}&paymentId=${payment._id}&alreadyVerified=true`
      );
    }

    // بررسی مبلغ پرداخت
    if (payment.amount < 1000) {
      payment.verificationError = {
        code: -1000,
        message: "مبلغ پرداخت نامعتبر است",
        details: { amount: payment.amount },
      };
      await payment.save();
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/failed?reason=invalid_amount`
      );
    }

    // تایید پرداخت با زرین‌پال
    const verifyResponse = await axios.post(
      `${ZARINPAL_BASE_URL}PaymentVerification.json`,
      {
        MerchantID: process.env.ZARINPAL_MERCHANT_ID,
        Amount: payment.amount,
        Authority: Authority,
      },
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    // بررسی پاسخ تایید پرداخت
    if (
      verifyResponse.data.Status !== 100 &&
      verifyResponse.data.Status !== 101
    ) {
      console.error("خطا در تایید پرداخت:", verifyResponse.data);

      // ذخیره خطا
      payment.verificationError = {
        code: verifyResponse.data.Status,
        message: verifyResponse.data.Message || "خطای ناشناخته از زرین‌پال",
        details: verifyResponse.data,
      };
      await payment.save();

      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/failed?reason=verification_failed&code=${verifyResponse.data.Status}`
      );
    }

    // بروزرسانی وضعیت پرداخت
    payment.paymentState = true;
    payment.refId = verifyResponse.data.RefID;
    payment.verifiedAt = new Date();
    payment.verificationError = null;
    await payment.save();

    // ریدایرکت به صفحه موفقیت
    res.redirect(
      `${process.env.FRONTEND_URL}/payment/success?refId=${verifyResponse.data.RefID}&paymentId=${payment._id}`
    );
  } catch (error) {
    console.error("خطا در تایید پرداخت:", error);

    // ذخیره خطا در صورت امکان
    if (error.response?.data) {
      console.error("پاسخ خطا از زرین‌پال:", error.response.data);
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
    // اعتبارسنجی شناسه پرداخت
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

    // یافتن پرداخت
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
      userData: payment.userData,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };

    // اطلاعات اضافی برای پرداخت‌های تایید شده
    if (payment.paymentState) {
      response.refId = payment.refId;
      response.verifiedAt = payment.verifiedAt;
    } else if (payment.verificationError) {
      response.error = payment.verificationError;
    }

    res.json(response);
  } catch (error) {
    console.error("خطا در دریافت وضعیت پرداخت:", error);

    // مدیریت خطاهای خاص
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "شناسه پرداخت نامعتبر است",
      });
    }

    res.status(500).json({
      success: false,
      message: "خطای سرور در دریافت وضعیت پرداخت",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export { requestPayment, verifyPayment, getPaymentStatus };
