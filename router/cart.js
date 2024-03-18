import express from "express";
import { Cart } from "../models/cart.js";
import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuth,
} from "./verifyToken.js";

const router = express.Router();

router.post("/creating", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Updating the cart
router.put("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Product has been deleted",
    });
  } catch {
    res.status(500).json({
      message: "You are not an admin",
    });
  }
});

//Get the user cart data
router.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
  try {
    const getCart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json({ getCart });
  } catch {
    res.status(500).json({
      message: "You are not an admin",
    });
  }
});

//Get all Products data
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const getCarts = await Cart.find();
    res.status(200).json(getCarts);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
