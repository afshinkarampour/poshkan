import express from "express";
import {
  addCopon,
  getCopons,
  removeCopon,
  verifyCopon,
} from "../controllers/coponController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const coponRouter = express.Router();

coponRouter.post("/add", adminAuth, addCopon);
coponRouter.post("/remove", adminAuth, removeCopon);
coponRouter.post("/verifyCopon", authUser, verifyCopon);
coponRouter.get("/getAll", adminAuth, getCopons);

export default coponRouter;
