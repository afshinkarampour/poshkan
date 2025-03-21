import mongoose from "mongoose";

const coponSchema = new mongoose.Schema({
  codeName: { type: String, required: true, unique: true },
  codeDiscount: { type: Number, required: true },
  startDate: { type: String, required: true }, // OTP expires in 1 minutes
  endDate: { type: String, required: true }, // OTP expires in 1 minutes
});

const coponModel =
  mongoose.models.copon || mongoose.model("copon", coponSchema);

export default coponModel;
