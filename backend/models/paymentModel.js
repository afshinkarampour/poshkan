import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentState: { type: Boolean, default: false },
  description: { type: String, required: true },
  date: { type: String, required: true },
  authority: { type: String, unique: true },
  refId: { type: String },
  userInfo: {
    name: { type: String, required: true },
    family: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    address: { type: String },
  },
});

const paymentModel =
  mongoose.models.payment || mongoose.model("payment", paymentSchema);

export default paymentModel;
