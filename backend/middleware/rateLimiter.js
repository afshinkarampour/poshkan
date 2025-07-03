// middleware/rateLimiter.js
import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // ۱۰ دقیقه
  max: 5, // حداکثر ۵ بار تلاش در بازه زمانی
  message: {
    success: false,
    message:
      "تعداد دفعات تلاش بیش از حد مجاز بود. لطفاً ۱۰ دقیقه دیگر تلاش کنید.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
