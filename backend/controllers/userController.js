import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import userModel from "../models/userModel.js";
import tokenModel from "../models/tokenModel.js";
import adminTokenModel from "../models/adminTokenModel.js";
import optModel from "../models/optModel.js";
import crypto from "crypto";
import https from "https";
import axios from "axios";

const createToken = (id, name) => {
  return jwt.sign({ id, name }, process.env.JWT_SECRET, {
    expiresIn: "14m",
  });
};

const createRefreshToken = (id, name) => {
  return jwt.sign({ id, name }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "24h",
  });
};

//Route for user registration
const registerUser = async (req, res) => {
  try {
    const registerValidationSchema = Joi.object({
      name: Joi.string().min(2).max(50).required().messages({
        "string.base": "نام باید یک رشته باشد",
        "string.min": "نام حداقل باید ۲ کاراکتر باشد",
        "string.max": "نام نمی‌تواند بیش از ۵۰ کاراکتر باشد",
        "any.required": "نام اجباری است",
      }),
      family: Joi.string().min(2).max(50).required().messages({
        "string.base": "نام خانوادگی باید یک رشته باشد",
        "string.min": "نام خانوادگی حداقل باید ۲ کاراکتر باشد",
        "string.max": "نام خانوادگی نمی‌تواند بیش از ۵۰ کاراکتر باشد",
        "any.required": "نام خانوادگی اجباری است",
      }),
      phoneNumber: Joi.string()
        .pattern(/^09\d{9}$/)
        .required()
        .messages({
          "string.pattern.base": "شماره تلفن باید بین ۱۰ تا ۱۵ رقم باشد",
          "any.required": "شماره تلفن اجباری است",
        }),
      password: Joi.string().min(8).max(100).required().messages({
        "string.min": "رمز عبور حداقل باید 8 کاراکتر باشد",
        "string.max": "رمز عبور نمی‌تواند بیش از ۱۰۰ کاراکتر باشد",
        "any.required": "رمز عبور اجباری است",
      }),
    });
    const { error } = registerValidationSchema.validate(req.body);
    if (error)
      return res.json({
        success: false,
        message: error.details[0].message,
      });

    const { name, family, phoneNumber, password } = req.body;
    //cheching user already exists or nit
    const exists = await userModel.findOne({ phoneNumber });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash Password
    const saltRounds = Number(process.env.SALT) || 10; // Default to 10 if not set
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new userModel({
      name,
      family,
      phoneNumber,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ success: true, message: "Registration Successful" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Route for user login
//در این تابع قسمت هایی که به کامنت تبدیل شده، برای کپچا می‌باشد
const loginUser = async (req, res) => {
  const schema = Joi.object({
    phoneNumber: Joi.string()
      .pattern(/^09\d{9}$/)
      .required()
      .messages({
        "string.pattern.base": "شماره تلفن باید بین ۱۰ تا ۱۵ رقم باشد",
        "any.required": "شماره تلفن اجباری است",
      }),
    password: Joi.string().required().messages({
      "any.required": "رمز عبور اجباری است",
    }),
    captchaToken: Joi.optional(),
    //   "any.required": "کپچا اجباری می‌باشد.",
    // }),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });

  const { phoneNumber, password, captchaToken } = req.body;

  // if (!captchaToken) {
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "کپچا اجباری است." });
  // }

  try {
    if (captchaToken) {
      const response = await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        null,
        {
          params: {
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: captchaToken,
          },
        }
      );
      if (!response.data.success) {
        console.log("Captcha Verification Failed:", response.data);
        return res
          .status(400)
          .json({ success: false, message: "کپچا نامعتبر است." });
      }
    }

    //check if phone number exist
    const user = await userModel.findOne({ phoneNumber });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "نام کابری یا رمز عبور اشتباه می باشد",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const accessToken = createToken(user._id, user.name);
      const refreshToken = createRefreshToken(user._id, user.name);

      //saving refresh token in DB
      await tokenModel.deleteOne({ _id: user._id });
      await new tokenModel({ _id: user._id, token: refreshToken }).save();

      // ذخیره Access Token در کوکی
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 14 * 60 * 1000, // 14 دقیقه
        sameSite: "Strict",
      });

      // ذخیره Refresh Token در کوکی
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 روز
        sameSite: "Strict",
      });

      res
        .status(200)
        .json({ success: true, message: "ورود با موفقیت انجام شد" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "نام کاربری یا رمز عبور اشتباه است" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Route for user Refreshtoken
const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; // Access the refresh token from cookies

    if (!refreshToken) {
      return res
        .status(403)
        .json({ success: false, message: "Refresh Token not provided" });
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const tokenDetail = await tokenModel.findById(payload.id);

    if (!tokenDetail || tokenDetail.token !== refreshToken) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid Refresh Token" });
    }

    const accessToken = createToken(tokenDetail._id, payload.name);

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 14 * 60 * 1000, // 14 minutes
      sameSite: "Strict",
    });

    res.json({ success: true, accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Route for admin Refreshtoken
const adminRefreshAccessToken = async (req, res) => {
  try {
    const adminRefreshToken = req.cookies.adminRefreshToken; // Access the refresh token from cookies

    if (!adminRefreshToken) {
      return res
        .status(403)
        .json({ success: false, message: "Refresh Token not provided" });
    }

    const payload = jwt.verify(
      adminRefreshToken,
      process.env.JWT_ADMIN_REFRESH_SECRET
    );

    const email = payload.email;
    const tokenDetail = await adminTokenModel.findOne();

    if (!tokenDetail || tokenDetail.token !== adminRefreshToken) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid Refresh Token" });
    }

    const adminAccessToken = jwt.sign(
      { email },
      process.env.JWT_AMIN_ACCESS_SECRET,
      {
        expiresIn: "14m",
      }
    );
    // createToken(tokenDetail._id, payload.name);

    res.cookie("adminAccessToken", adminAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 14 * 60 * 1000, // 14 minutes
      sameSite: "Strict",
    });

    res.json({ success: true, adminAccessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Route for Logout
const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; // Access the refresh token from cookies

    if (!refreshToken) {
      res.clearCookie("jwt");
      res.clearCookie("refreshToken");
      return res
        .status(403)
        .json({ success: false, message: "Refresh Token not provided" });
    }
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const tokenDetail = await tokenModel.findById(payload.id);
    if (!tokenDetail || tokenDetail.token !== refreshToken)
      return res.json({ success: false, message: "Invalid Refresh Token" });
    //Delete Refresh Tokne
    await tokenModel.deleteOne({ _id: tokenDetail._id });
    res.clearCookie("jwt");
    res.clearCookie("refreshToken");
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Route for admin login
const adminLogin = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    captchaToken: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.json({
      success: false,
      message: error.details[0].message,
    });

  const { email, password, captchaToken } = req.body;

  if (!captchaToken) {
    return res
      .status(400)
      .json({ success: false, message: "کپچا اجباری است." });
  }

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: captchaToken,
        },
      }
    );
    if (!response.data.success) {
      console.log("Captcha Verification Failed:", response.data);
      return res
        .status(400)
        .json({ success: false, message: "کپچا نامعتبر است." });
    }

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const adminAccessToken = jwt.sign(
        { email },
        process.env.JWT_AMIN_ACCESS_SECRET,
        {
          expiresIn: "14m",
        }
      );
      const adminRefreshToken = jwt.sign(
        { email },
        process.env.JWT_ADMIN_REFRESH_SECRET,
        {
          expiresIn: "24h",
        }
      );
      //saving refresh token in DB
      await adminTokenModel.deleteOne();
      await new adminTokenModel({ token: adminRefreshToken }).save();

      // ذخیره Access Token در کوکی
      res.cookie("adminAccessToken", adminAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 14 * 60 * 1000, // 14 دقیقه
      });

      // ذخیره Refresh Token در کوکی
      res.cookie("adminRefreshToken", adminRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 روز
      });

      res.json({ success: true, message: "Login successful" });
    } else {
      res.json({ success: false, message: "Invalid Eamil or Password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Route for Admin Logout
const logoutAdmin = async (req, res) => {
  try {
    const adminRefreshToken = req.cookies.adminRefreshToken; // Access the refresh token from cookies

    if (!adminRefreshToken) {
      res.clearCookie("adminAccessToken");
      res.clearCookie("adminRefreshToken");
      return res
        .status(403)
        .json({ success: false, message: "Refresh Token not provided" });
    }
    const payload = jwt.verify(
      adminRefreshToken,
      process.env.JWT_ADMIN_REFRESH_SECRET
    );
    const tokenDetail = await adminTokenModel.findOne();

    if (!tokenDetail || tokenDetail.token !== adminRefreshToken)
      return res.json({ success: false, message: "Invalid Refresh Token" });
    //Delete Refresh Tokne
    await adminTokenModel.deleteMany();
    res.clearCookie("adminAccessToken");
    res.clearCookie("adminRefreshToken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserInfo = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User is logged out. Please log in again.",
      });
    }
    const userInfo = await userModel
      .findById(req.user?._id)
      .select("-password");
    return res.json({ success: true, data: userInfo });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const data = await userModel.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Account Removed Seccessfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const findAllUsers = async (req, res) => {
  try {
    const data = await userModel.find().select("-password");
    return res.json({ success: true, data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // اعتبارسنجی شماره موبایل
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res
        .status(400)
        .send({ success: false, message: "شماره موبایل نامعتبر است" });
    }

    const phone = await optModel.find({ phoneNumber });
    if (phone) {
      await optModel.deleteOne({ phoneNumber });
    }

    // تولید کد OTP (6 رقمی)
    const otp = crypto.randomInt(100000, 999999).toString();

    // ذخیره OTP در MongoDB با انقضا (مثلاً 3 دقیقه)
    const otpRecord = new optModel({
      phoneNumber,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await otpRecord.save();

    // ارسال OTP به ملی‌پیامک
    const data = JSON.stringify({
      bodyId: 289852,
      to: phoneNumber,
      args: [otp],
    });

    const options = {
      hostname: "console.melipayamak.com",
      port: 443,
      path: "/api/send/shared/e64408f0be194e8faad7fe65f36525a4",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
    };

    const sendRequest = () =>
      new Promise((resolve, reject) => {
        const request = https.request(options, (response) => {
          let responseData = "";

          response.on("data", (chunk) => {
            responseData += chunk;
          });

          response.on("end", () => {
            if (response.statusCode === 200) {
              resolve(responseData);
            } else {
              reject(new Error("Failed to send OTP"));
            }
          });
        });

        request.on("error", (error) => {
          reject(error);
        });

        request.write(data);
        request.end();
      });

    await sendRequest();

    res.status(200).send({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Failed to send OTP" });
  }
};

// Endpoint for verifying OTP
const verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  // Find OTP record from database
  const otpRecord = await optModel.findOne({ phoneNumber, otp });

  if (!otpRecord) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid or expired OTP" });
  }

  await optModel.deleteOne({ phoneNumber, otp });

  res.status(200).send({ success: true, message: "OTP verified successfully" });
};

//Endpoint for Updating Password
const forgotPassword = async (req, res) => {
  const schema = Joi.object({
    phoneNumber: Joi.string()
      .pattern(/^09\d{9}$/)
      .required()
      .messages({
        "string.pattern.base": "شماره تلفن باید  11 رقم باشد و با 09 شروع شود",
        "any.required": "شماره تلفن اجباری است",
      }),
    password: Joi.string().min(8).max(100).required().messages({
      "string.min": "رمز عبور حداقل باید 8 کاراکتر باشد",
      "string.max": "رمز عبور نمی‌تواند بیش از ۱۰۰ کاراکتر باشد",
      "any.required": "رمز عبور اجباری است",
    }),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.json({
      success: false,
      message: error.details[0].message,
    });

  try {
    const { phoneNumber, password } = req.body;

    const user = await userModel.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "کاربری با این شماره تلفن یافت نشد",
      });
    }

    const saltRounds = Number(process.env.SALT) || 10; // Default to 10 if not set
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await userModel.updateOne(
      { phoneNumber },
      { $set: { password: hashedPassword } }
    );

    return res.status(200).json({
      success: true,
      message: "رمز عبور با موفقیت تغییر کرد",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({
      success: false,
      message: "خطایی در سرور رخ داد. لطفاً بعداً دوباره امتحان کنید",
    });
  }
};

const updateUserInfo = async (req, res) => {
  const schema = Joi.object({
    gender: Joi.string().valid("آقا", "خانم").optional().allow(null, ""),
    phoneNumber: Joi.string()
      .pattern(/^09\d{9}$/)
      .required()
      .messages({
        "string.pattern.base": "شماره تلفن باید 11 رقم باشد و با 09 شروع شود",
        "any.required": "شماره تلفن اجباری است",
      }),
    name: Joi.string().min(2).max(50).required().messages({
      "string.min": "نام حداقل باید  2 کاراکتر باشد",
      "string.max": "نام نمی‌تواند بیش از 50 کاراکتر باشد",
      "any.required": "نام اجباری است",
    }),
    family: Joi.string().min(2).max(50).required().messages({
      "string.min": "فامیلی حداقل باید  2 کاراکتر باشد",
      "string.max": "فامیلی نمی‌تواند بیش از 50 کاراکتر باشد",
      "any.required": "فامیلی اجباری است",
    }),
    postalCode: Joi.string().max(10).optional().allow(null, ""),
    province: Joi.string().max(50).optional().allow(null, ""),
    city: Joi.string().max(50).optional().allow(null, ""),
    address: Joi.string().max(150).optional().allow(null, ""),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res.json({
      success: false,
      message: error.details[0].message,
    });

  try {
    const {
      gender,
      name,
      family,
      phoneNumber,
      postalCode,
      province,
      city,
      address,
    } = req.body;

    const user = await userModel.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "کاربری با این شماره تلفن یافت نشد",
      });
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { phoneNumber },
      {
        $set: {
          gender,
          name,
          family,
          province,
          postalCode,
          city,
          address,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "اطلاعات کاربری با موفقیت تغییر کرد",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({
      success: false,
      message: "خطایی در سرور رخ داد. لطفاً دوباره امتحان کنید",
    });
  }
};

const updatePassword = async (req, res) => {
  const schema = Joi.object({
    phoneNumber: Joi.string()
      .pattern(/^09\d{9}$/)
      .required()
      .messages({
        "string.pattern.base": "شماره تلفن باید 11 رقم باشد و با 09 شروع شود",
        "any.required": "شماره تلفن اجباری است",
      }),
    currentPassword: Joi.string().required().messages({
      "any.required": "رمز عبور فعلی اجباری است",
    }),
    newPassword: Joi.string().min(8).max(50).required().messages({
      "string.min": "رمز عبور جدید حداقل 8 کاراکتر باشد",
      "string.max": "رمز عبور جدید نمی‌تواند بیش از ۵۰ کاراکتر باشد",
      "any.required": "رمز عبور جدید اجباری است",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  // const userId = req.user.id; // از توکن JWT استخراج میشه
  // console.log("id: ", userId);

  const { phoneNumber, currentPassword, newPassword } = req.body;

  try {
    const user = await userModel.findOne({ phoneNumber });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "کاربر یافت نشد" });
    }

    // بررسی صحت رمز عبور فعلی
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "رمز عبور فعلی نادرست است" });
    }

    // تغییر رمز عبور
    const saltRounds = Number(process.env.SALT) || 10; // Default to 10 if not set
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await userModel.updateOne(
      { phoneNumber },
      { $set: { password: hashedPassword } }
    );

    return res
      .status(200)
      .json({ success: true, message: "رمز عبور با موفقیت تغییر کرد" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "خطای سرور" });
  }
};

export {
  loginUser,
  registerUser,
  refreshAccessToken,
  logoutUser,
  adminLogin,
  logoutAdmin,
  adminRefreshAccessToken,
  getUserInfo,
  findAllUsers,
  deleteUser,
  sendOtp,
  verifyOtp,
  forgotPassword,
  updateUserInfo,
  updatePassword,
};
