import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
  color: { type: String, required: true },
  size: { type: String, required: true },
  count: { type: Number, required: true, default: 0 },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  discount: { type: Number },
  img: { type: Array },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  productType: { type: String },
  features: { type: [featureSchema], required: true },
  userSizeGuide: { type: Array, required: true },
  warehouseInventory: { type: Number, required: true },
  bestSeller: { type: Boolean, required: true },
  date: { type: String, required: true },
  discountStartDate: { type: String },
  discountStartTime: { type: String },
  discountEndDate: { type: String },
  discountEndTime: { type: String },
  isPublish: { type: Boolean, default: true },
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
