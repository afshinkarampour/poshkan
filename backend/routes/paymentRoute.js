import express from "express";

import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  requestPayment,
  verifyPayment,
  getPaymentStatus,
  getPaymentByUserId,
  getAllPayments,
  updateStatus,
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/request", authUser, requestPayment);
paymentRouter.get("/verify", authUser, verifyPayment);
paymentRouter.get("/status/:paymentId", getPaymentStatus);
paymentRouter.get("/userpayments", authUser, getPaymentByUserId);
paymentRouter.get("/allPayments", adminAuth, getAllPayments);
paymentRouter.post("/updateStatus", adminAuth, updateStatus);

export default paymentRouter;
