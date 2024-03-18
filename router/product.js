import { Product } from "../models/product.js";
import express from "express";
import { verifyTokenAndAdmin, verifyTokenAndAuth } from "./verifyToken.js";

const router = express.Router();

//Creating the prodcuts
router.post("/see", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Updating the product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Deleting the user
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Product has been deleted",
    });
  } catch {
    res.status(500).json({
      message: "You are not an admin",
    });
  }
});

//Get the product data
router.get("/find/:id", async (req, res) => {
  try {
    const getProduct = await Product.findById(req.params.id);
    res.status(200).json({ getProduct });
  } catch {
    res.status(500).json({
      message: "You are not an admin",
    });
  }
});

//Get all Products data
router.get("/data", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({
      message: "There is an errror",
    });
  }
});

export default router;
