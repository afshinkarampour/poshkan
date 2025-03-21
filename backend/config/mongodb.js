import mongoose from "mongoose";

const connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(console.log("DB Connected."))
    .catch((err) => {
      console.log(err.errmsg);
    });
};

export default connectDB;
