const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  transactionId: String,
  from: String,
  to: String,
  amount: Number,
  status: {
    type: String,
    enum: ["COMPLETED", "CANCELED", "PENDING"],
    default: "PENDING",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
