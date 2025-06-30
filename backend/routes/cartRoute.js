import express from "express";
import {
  addToCart,
  getUserCart,
  updateCart,
  // clearCart,
} from "../controllers/cartController.js";
import authUser from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.get("/get", authUser, getUserCart);
cartRouter.post("/add", authUser, addToCart);
cartRouter.post("/update", authUser, updateCart);
// cartRouter.post("/clearCart", authUser, clearCart);

export default cartRouter;
