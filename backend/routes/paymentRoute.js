import express from "express";

import authUser from "../middleware/auth.js";
import {
  requestPayment,
  verifyPayment,
  getPaymentStatus,
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/request", requestPayment);
paymentRouter.get("/verify", verifyPayment);
paymentRouter.get("/status/:paymentId", getPaymentStatus);

export default paymentRouter;
