import mongoose from "mongoose";

export const connectdb = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "Ecommerce_App",
    })

    .then(() => console.log("Database is working"))
    .catch((e) => console.log(e));
};
