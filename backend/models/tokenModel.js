import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  _id: { type: String, auto: false },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 24 * 60 * 60 },
});

const tokenModel =
  mongoose.models.token || mongoose.model("token", tokenSchema);

export default tokenModel;
