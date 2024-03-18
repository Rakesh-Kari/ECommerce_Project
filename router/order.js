import express from "express";
import { Order } from "../models/order.js";
import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuth,
} from "./verifyToken.js";

const router = express.Router();

router.post("/creating", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Updating the cart
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Order has been deleted",
    });
  } catch {
    res.status(500).json({
      message: "You are not an admin",
    });
  }
});

//Get the user order data
router.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
  try {
    const getOrder = await Order.find({ userId: req.params.userId });
    res.status(200).json({ getOrder });
  } catch {
    res.status(500).json({
      message: "You are not an admin",
    });
  }
});

//Get all Orders data
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const getOrders = await Order.find();
    res.status(200).json(getOrders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get the income stats
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
