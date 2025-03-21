import userModel from "../models/userModel.js";
import Joi from "joi";

// add products to user cart
const addToCart = async (req, res) => {
  try {
    const schema = Joi.object({
      itemId: Joi.string().hex().length(24).required(),
      size: Joi.string().max(10).required(),
      color: Joi.string().max(10).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { itemId, size, color } = req.body;
    const userId = req.user._id;

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      {
        $inc: {
          [`cartData.${itemId}.${color},${size}`]: 1,
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Added to Cart",
      cart: updatedUser.cartData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// const addToCart = async (req, res) => {
//   try {
//     const schema = Joi.object({
//       itemId: Joi.string().hex().length(24).required(),
//       size: Joi.string().max(10).required(),
//       color: Joi.string().max(10).required(),
//     });
//     const { error } = schema.validate(req.body);
//     if (error)
//       return res.json({
//         success: false,
//         message: error.details[0].message,
//       });

//     const { itemId, size, color } = req.body;
//     const userId = req.user._id;

//     const userData = await userModel.findById(userId);

//     let cartData = await userData.cartData;

//     if (cartData[itemId]) {
//       if (cartData[itemId][`${color},${size}`]) {
//         cartData[itemId][`${color},${size}`] += 1;
//       } else {
//         cartData[itemId][`${color},${size}`] = 1;
//       }
//     } else {
//       cartData[itemId] = {};
//       cartData[itemId][`${color},${size}`] = 1;
//     }

//     await userModel.findByIdAndUpdate(userId, { cartData });

//     res.json({ success: true, message: "Added To Cart" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// update user cart
const updateCart = async (req, res) => {
  try {
    const schema = Joi.object({
      itemId: Joi.string().hex().length(24).required(),
      size: Joi.string().max(20).required(),
      quantity: Joi.number().min(0).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { itemId, size, quantity } = req.body;
    const userId = req.user._id;

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          [`cartData.${itemId}.${size}`]: quantity,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Cart Updated",
      cart: updatedUser.cartData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// const updateCart = async (req, res) => {
//   try {
//     const schema = Joi.object({
//       itemId: Joi.string().hex().length(24).required(),
//       size: Joi.string().max(20).required(),
//       quantity: Joi.number().required(),
//     });
//     const { error } = schema.validate(req.body);
//     if (error) {
//       console.log(error);

//       return res.json({
//         success: false,
//         message: error.details[0].message,
//       });
//     }

//     const { itemId, size, quantity } = req.body;
//     const userId = req.user._id;
//     const userData = await userModel.findById(userId);
//     console.log(userData);

//     let cartData = await userData.cartData;

//     cartData[itemId][size] = quantity;

//     await userModel.findByIdAndUpdate(userId, { cartData });

//     res.json({ success: true, message: "Cart Updated" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// get user cart
const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const userData = await userModel.findById(userId, "cartData");

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({ success: true, cartData: userData.cartData || {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// const getUserCart = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const userData = await userModel.findById(userId);

//     let cartData = await userData.cartData;

//     res.json({ success: true, cartData });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

export { addToCart, updateCart, getUserCart };
