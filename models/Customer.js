const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    avatar: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);
