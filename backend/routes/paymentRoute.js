import express from "express";

import authUser from "../middleware/auth.js";
import {
  requestPayment,
  verifyPayment,
  getPaymentStatus,
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/request", authUser, requestPayment);
paymentRouter.get("/verify", authUser, verifyPayment);
paymentRouter.get("/status/:paymentId", authUser, getPaymentStatus);

export default paymentRouter;
