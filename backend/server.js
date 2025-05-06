import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import coponRouter from "./routes/coponRoute.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//App Config
const app = express();
const port = process.env.PORT || 4000;

// تنظیم هدر CORS
const allowedOrigins = [
  // "http://localhost:5174",
  // "http://localhost:5173",
  "https://poshkan.ir",
  "https://admin.poshkan.ir",
];
const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

connectDB();

//middlewares
app.use(express.json());
app.use(cors(corsOptions));

// تنظیم CORS برای همه درخواست‌ها
// app.options("*", (req, res) => {
//   res.header(
//     "Access-Control-Allow-Origin",
//     "http://localhost:5174",
//     "http://localhost:5173"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.sendStatus(200);
// });

app.use(cookieParser());

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); //for security

//api endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/copon", coponRouter);

// ارائه فایل‌های استاتیک از پوشه "uploads"
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log("Server Started on PORT : " + port);
});
