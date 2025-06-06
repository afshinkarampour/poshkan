import axios from "axios";
import Joi from "joi";
import Payment from "../models/paymentModel.js";

// تنظیم آدرس API زرین‌پال
const ZARINPAL_BASE_URL =
  process.env.ZARINPAL_SANDBOX === "true"
    ? "https://sandbox.zarinpal.com/pg/v4/payment"
    : "https://api.zarinpal.com/pg/v4/payment";

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
    phoneNumber: Joi.string().required().messages({
      "any.required": "شماره تلفن الزامی است",
    }),
    address: Joi.string().optional(),
    email: Joi.string().email().optional(),
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
  Status: Joi.string().valid("OK", "NOK").default("OK").messages({
    "any.only": "Status باید OK یا NOK باشد",
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

    // ساخت درخواست پرداخت
    const response = await axios.post(
      `${ZARINPAL_BASE_URL}/request.json`,
      {
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        amount: amount,
        callback_url: process.env.ZARINPAL_CALLBACK_URL,
        description: description.substring(0, 255),
        currency: "IRR",
        metadata: {
          mobile: userData.phoneNumber,
          email: userData.email || "no-reply@poshkan.ir",
        },
      },
      {
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const result = response.data;

    // بررسی خطا - نسخه اصلاح شده
    if (result.errors && result.errors.length > 0) {
      console.error("خطا در پاسخ زرین‌پال:", result.errors);
      return res.status(400).json({
        success: false,
        message: "خطا در اتصال به درگاه پرداخت",
        errorCode: result.errors[0]?.code,
        errorMessage: result.errors[0]?.message,
      });
    }

    // بررسی موفقیت آمیز بودن تراکنش
    if (!result.data || result.data.code !== 100) {
      console.error("پاسخ نامعتبر از زرین‌پال:", result.data);
      return res.status(400).json({
        success: false,
        message: result.data?.message || "درخواست پرداخت توسط زرین‌پال رد شد",
        code: result.data?.code,
      });
    }

    // ذخیره اطلاعات پرداخت
    const payment = await Payment.create({
      userId: userData.phoneNumber,
      amount,
      description,
      paymentState: false,
      authority: result.data.authority,
      refId: null,
      verifiedAt: null,
      verificationError: null,
      userData: {
        name: userData.name,
        family: userData.family,
        phoneNumber: userData.phoneNumber,
        email: userData.email || null,
        address: userData.address || null,
      },
    });

    // پاسخ به کلاینت
    res.json({
      success: true,
      paymentUrl: `https://${
        process.env.ZARINPAL_SANDBOX === "true" ? "sandbox" : "www"
      }.zarinpal.com/pg/StartPay/${result.data.authority}`,
      authority: result.data.authority,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error("خطا در ایجاد درخواست پرداخت:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

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
    const { error, value } = paymentVerifySchema.validate(req.query, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      console.error("خطا در اعتبارسنجی تایید پرداخت:", error.details);
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/failed?reason=invalid_parameters`
      );
    }

    const { Authority, Status } = value;

    if (Status !== "OK") {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/failed?reason=user_canceled`
      );
    }

    const payment = await Payment.findOne({ authority: Authority });
    if (!payment) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/failed?reason=not_found`
      );
    }

    const verifyResponse = await axios.post(
      "https://api.zarinpal.com/pg/v4/payment/verify.json",
      {
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        amount: payment.amount,
        authority: Authority,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = verifyResponse.data;

    if (!result.data || typeof result.data.code === "undefined") {
      payment.verificationError = {
        message: "پاسخ نامعتبر از زرین‌پال دریافت شد",
        rawResponse: result,
      };
      await payment.save();
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/failed?reason=invalid_response`
      );
    }

    if (result.data.code !== 100 && result.data.code !== 101) {
      payment.verificationError = {
        code: result.data.code,
        message: result.data.message || "کد تأیید نامعتبر",
      };
      await payment.save();
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/failed?reason=invalid_code&code=${result.data.code}`
      );
    }

    // ✅ پرداخت تایید شده، ذخیره اطلاعات کامل
    payment.isPaid = true;
    payment.paymentState = true; // ⬅️ این خط اضافه شده
    payment.verifiedAt = new Date(); // ⬅️ این خط اضافه شده
    payment.refId = result.data.ref_id;
    payment.cardPan = result.data.card_pan || null;
    payment.cardHash = result.data.card_hash || null;
    payment.paidAt = new Date();

    await payment.save();

    res.redirect(
      `${process.env.FRONTEND_URL}/payment/success?ref_id=${payment.refId}`
    );
  } catch (error) {
    console.error("خطا در تایید پرداخت:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    const authority = req.query.Authority;
    const payment = await Payment.findOne({ authority });

    if (payment) {
      payment.verificationError = {
        message: error.response?.data?.errors?.message || error.message,
        rawResponse: error.response?.data || null,
      };
      await payment.save();
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
      userData: payment.userData,
      createdAt: payment.createdAt,
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
    console.error("خطا در دریافت وضعیت پرداخت:", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "خطای سرور در دریافت وضعیت پرداخت",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export { requestPayment, verifyPayment, getPaymentStatus };
