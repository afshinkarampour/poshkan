import express from "express";
import { torobProducts } from "../controllers/productController.js";

const torobRouter = express.Router();

torobRouter.use(express.urlencoded({ extended: true }));

torobRouter.route("/products").post(async (req, res) => {
  try {
    console.log("دریافت درخواست ترب - Body:", req.body);

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
