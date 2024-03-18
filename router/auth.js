import express from "express";
import { User } from "../models/user.js";
import crypto from "crypto-js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: crypto.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(401).json(err);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const checkUser = await User.findOne({ username }).select("+password");
    if (!checkUser) {
      res.status(400).json({
        success: false,
        message: "Invalid username or password",
      });
    }
    const hashPassword = crypto.AES.decrypt(
      checkUser.password,
      process.env.PASS_SECRET
    );
    const OriginalPassword = hashPassword.toString(crypto.enc.Utf8);
    if (OriginalPassword !== password) {
      res.status(401).json({
        message: "Wrong password",
      });
    }
    const accessToken = jwt.sign(
      {
        _id: checkUser._id,
        isAdmin: checkUser.isAdmin,
      },
      process.env.JWT_SEC
    );
    const { password: pword, ...others } = checkUser._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
