require("dotenv").config();
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import "./queues/orderQueue"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import orderRoutes from "./routes/orderRoutes";

app.use("/api/orders", orderRoutes);

mongoose.connect(process.env.DATABASE_URL!).then(() => {
  console.log("Order service database connected successfully");
});

app.listen(process.env.PORT||3001, () => {
  console.log("Order service listening on port 3001");
});
