const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "CANCELED", "PAID", "UNFULFILLED"],
      default: "PENDING",
    },
    subtotal: Number,
    shippingCost: Number,
    tax: Number,
    total: Number,
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    note: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
