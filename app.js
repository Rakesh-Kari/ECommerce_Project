import express from "express";
import { config } from "dotenv";
import userRouter from "./router/user.js";
import authRouter from "./router/auth.js";
import productRouter from "./router/product.js";
import cartRouter from "./router/cart.js";
import orderRouter from "./router/order.js";

export const app = express();

config({
  path: "./data/config.env",
});

app.use(express.json());

//Using routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
