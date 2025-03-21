import mongoose from "mongoose";

const adminTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 24 * 60 * 60 },
});

const adminTokenModel =
  mongoose.models.adminToken || mongoose.model("adminToken", adminTokenSchema);

export default adminTokenModel;
