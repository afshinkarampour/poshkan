import express from "express";
import { torobProducts } from "../controllers/productController";

const torobRouter = express.Router();

// route for torob
torobRouter.post("/products", async (req, res) => {
  try {
    const { page_unique, page_url, page = 1 } = req.body;
    const result = await torobProducts({ page_unique, page_url, page });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "خطای سرور" });
  }
});

export default torobRouter;
