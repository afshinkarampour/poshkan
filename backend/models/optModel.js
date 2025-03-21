import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "5m" }, // OTP expires in 5 minutes
});

const optModel = mongoose.models.opt || mongoose.model("opt", otpSchema);

export default optModel;
