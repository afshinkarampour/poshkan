import Joi from "joi";
import coponModel from "../models/coponModle.js";

// add copon
const addCopon = async (req, res) => {
  try {
    const schema = Joi.object({
      codeName: Joi.string().required(),
      codeDiscount: Joi.number().min(100).required(),
      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { codeName, codeDiscount, startDate, endDate } = req.body;
    const coponData = {
      codeName,
      codeDiscount,
      startDate,
      endDate,
    };

    const newCopon = new coponModel(coponData);
    await newCopon.save();

    res.status(201).json({ success: true, message: "Copon Added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//get all copons
const getCopons = async (req, res) => {
  try {
    const copons = await coponModel.find();
    if (copons) {
      res.status(200).json({ success: true, copons });
    } else res.status(404).json({ success: false, message: "Nothing founded" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//remove an copon
const removeCopon = async (req, res) => {
  try {
    const schema = Joi.object({
      coponId: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { coponId } = req.body;

    await coponModel.findByIdAndDelete(coponId);
    res.status(200).json({ success: true, message: "Copon Removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const verifyCopon = async (req, res) => {
  const schema = Joi.object({
    code: Joi.string().min(2).max(50).required().messages({
      "string.min": "مقدار کد حداقل باید 2 کاراکتر باشد",
      "string.max": "مقدار کد نمی‌تواند بیش از 50 کاراکتر باشد",
      "any.required": "مقدار کد اجباری است",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const { code } = req.body;

  try {
    const copon = await coponModel.findOne({ codeName: code });
    if (copon) {
      res.status(200).json({ success: true, copon });
    } else
      res.status(404).json({ success: false, message: "کد تخفیف پیدا نشد" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { addCopon, getCopons, removeCopon, verifyCopon };
