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

// clear user cart
// const clearCart = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const updatedUser = await userModel.findByIdAndUpdate(
//       userId,
//       { cartData: {} }, // پاک کردن کل سبد خرید
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Cart has been cleared",
//       cart: updatedUser.cartData,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

export { addToCart, updateCart, getUserCart };
