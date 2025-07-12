import express from "express";
import multer from "multer";
import { torobProducts } from "../controllers/productController.js";

const torobRouter = express.Router();

// تعریف یک حافظه ساده برای دریافت فیلدهای form-data
const upload = multer();

// حالا به جای استفاده مستقیم از req.body، از upload.none() برای فرم بدون فایل استفاده کن
torobRouter.route("/products").post(upload.none(), async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "بدنه درخواست خالی است" });
    }

    const result = await torobProducts(req.body);
    res.json(result);
  } catch (error) {
    console.error("خطا:", error);
    res.status(500).json({ error: "خطای سرور داخلی" });
  }
});

export default torobRouter;
