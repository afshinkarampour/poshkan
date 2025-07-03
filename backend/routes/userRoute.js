import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  refreshAccessToken,
  logoutUser,
  getUserInfo,
  deleteUser,
  logoutAdmin,
  adminRefreshAccessToken,
  findAllUsers,
  sendOtp,
  verifyOtp,
  forgotPassword,
  updateUserInfo,
  updatePassword,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginLimiter, loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/adminlogout", logoutAdmin);
userRouter.post("/refresh", refreshAccessToken);
userRouter.post("/adminrefresh", adminRefreshAccessToken);
userRouter.post("/logout", logoutUser);
userRouter.post("/send-otp", sendOtp);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/updateforgotedPassword", forgotPassword);
userRouter.post("/updateUserInfo", authUser, updateUserInfo);
userRouter.post("/updateNewPassword", authUser, updatePassword);
userRouter.get("/me", authUser, getUserInfo);
userRouter.get("/users", findAllUsers);
userRouter.delete("/:id", adminAuth, deleteUser);

export default userRouter;
