import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    products: {
      type: [String],
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    user: {
      type: String,
      // required: true,
    },
    userEmail: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);
