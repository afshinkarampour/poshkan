import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1000,
    },
    paymentState: {
      type: Boolean,
      default: false,
      index: true, // ایندکس برای فیلتر کردن پرداخت‌های موفق/ناموفق
    },
    description: {
      type: String,
      required: true,
      maxlength: 255,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    //برای ذخیره تاریخ شمسی
    faDate: {
      type: String,
    },
    authority: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    refId: {
      type: String,
      index: true,
    },
    verifiedAt: {
      type: Date,
    },
    verificationError: {
      code: { type: Number }, // کد خطای زرین پال
      message: { type: String }, // پیام خطا
      details: { type: Object }, // اطلاعات تکمیلی خطا
    },
    status: { type: String, default: "تایید" },
    items: { type: Object, default: {} },
    userData: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      family: {
        type: String,
        required: true,
        trim: true,
      },
      phoneNumber: {
        type: String,
        required: true,
        index: true,
      },
      province: { type: String },
      city: { type: String },
      address: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// ایندکس ترکیبی برای پرکاربردترین کوئری‌ها
paymentSchema.index({ userId: 1, paymentState: 1 });
paymentSchema.index({ authority: 1, paymentState: 1 });
paymentSchema.index({ createdAt: -1 }); // برای سورت بر اساس جدیدترین پرداخت‌ها

const paymentModel =
  mongoose.models.payment || mongoose.model("payment", paymentSchema);

export default paymentModel;
