import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true, // اضافه شدن ایندکس برای جستجوی سریعتر
    },
    amount: {
      type: Number,
      required: true,
      min: 1000, // حداقل مبلغ پرداخت
    },
    paymentState: {
      type: Boolean,
      default: false,
      index: true, // ایندکس برای فیلتر کردن پرداخت‌های موفق/ناموفق
    },
    description: {
      type: String,
      required: true,
      maxlength: 255, // مطابق با محدودیت زرین پال
    },
    date: {
      type: Date, // تغییر از String به Date برای پردازش راحت‌تر
      required: true,
      default: Date.now, // مقدار پیش‌فرض خودکار
    },
    authority: {
      type: String,
      unique: true,
      sparse: true, // اجازه null برای مواردی که هنوز Authority دریافت نکرده‌اند
      index: true,
    },
    refId: {
      type: String,
      index: true, // ایندکس برای جستجوی سریع
    },
    verifiedAt: {
      type: Date, // زمان تایید پرداخت
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
        match: /^09[0-9]{9}$/, // اعتبارسنجی شماره تلفن
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
