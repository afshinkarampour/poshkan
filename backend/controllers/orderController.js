import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Joi from "joi";

//Placing order using COD Method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Placing order using stripe Method
const placeOrderStripe = async (req, res) => {};

//All orders data for admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//User order data for frontend
const userOrders = async (req, res) => {
  try {
    const userOrdersSchema = Joi.object({
      userId: Joi.string().required(), // اطمینان از اینکه userId ارائه شده است
    });
    const { error } = userOrdersSchema.validate({ userId: req.user._id });
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const userId = req.user._id;
    const orders = await orderModel.find({ userId });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Update orders status from admin panel
const updateStatus = async (req, res) => {
  try {
    const updateStatusSchema = Joi.object({
      orderId: Joi.string().required(), // بررسی شناسه سفارش
      status: Joi.string()
        .valid("تایید سفارش", "ارسال سفارش", "تحویل داده شده", "لغو شده")
        .required(), // بررسی وضعیت مجاز
    });

    const { error } = updateStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { orderId, status } = req.body;
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Status updated", order: updatedOrder });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus };
