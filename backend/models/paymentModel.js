import { required } from "joi";
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
      required: true,
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
    userData: {
      name: {
        type: String,
        required: true,
        trim: true, // حذف فاصله‌های اضافه
      },
      family: {
        type: String,
        required: true,
        trim: true,
      },
      phoneNumber: {
        type: String,
        required: true,
        // match: /^09[0-9]{9}$/, // اعتبارسنجی شماره تلفن
        index: true,
      },
      address: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true, // اضافه شدن createdAt و updatedAt به صورت خودکار
  }
);

// ایندکس ترکیبی برای پرکاربردترین کوئری‌ها
paymentSchema.index({ userId: 1, paymentState: 1 });
paymentSchema.index({ authority: 1, paymentState: 1 });
paymentSchema.index({ createdAt: -1 }); // برای سورت بر اساس جدیدترین پرداخت‌ها

const paymentModel =
  mongoose.models.payment || mongoose.model("payment", paymentSchema);

export default paymentModel;
