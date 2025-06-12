import express from "express";

import authUser from "../middleware/auth.js";
import {
  requestPayment,
  verifyPayment,
  getPaymentStatus,
  getPaymentByUserId,
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/request", authUser, requestPayment);
paymentRouter.get("/verify", authUser, verifyPayment);
paymentRouter.get("/status/:paymentId", getPaymentStatus);
paymentRouter.get("/userpayments", authUser, getPaymentByUserId);

export default paymentRouter;
