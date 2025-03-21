import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    family: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10,15}$/, "Please enter a valid phone number"],
    },
    password: { type: String, required: true },
    email: {
      type: String,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    gender: { type: String, enum: ["مرد", "زن"] },
    postalCode: { type: String },
    province: { type: String },
    city: { type: String },
    address: { type: String },
    cartData: { type: Object, default: {} },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
