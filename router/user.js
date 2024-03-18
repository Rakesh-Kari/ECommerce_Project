import express from "express";
import { verifyTokenAndAdmin, verifyTokenAndAuth } from "./verifyToken.js";
import { User } from "../models/user.js";
import CryptoJS from "crypto-js";

const router = express.Router();

//Updating the user
router.put("/:id", verifyTokenAndAuth, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Deleting the user
router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "User has been deleted",
    });
  } catch {
    res.status(500).json({
      message: "You are not an admin",
    });
  }
});

//Getting the details of a particular user using the id
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const getUser = await User.findById(req.params.id);
    const { password, ...others } = getUser._doc;
    res.status(200).json({ ...others });
  } catch {
    res.status(500).json({
      message: "You are not an admin",
    });
  }
});

//Get all Users
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: "You are not an admin",
    });
  }
});

//Get USER stats
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group by month extracted from createdAt
          total: { $sum: 1 }, // Count the documents in each group
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
