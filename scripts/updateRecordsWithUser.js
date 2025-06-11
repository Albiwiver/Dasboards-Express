const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Order = require("../models/Order");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

const userId = "6846f5db13ae3b8b608807c9";

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Order.updateMany({}, { $set: { user: userId } });

    await Customer.updateMany({}, { $set: { user: userId } });

    await Product.updateMany({}, { $set: { user: userId } });

    console.log("Todos los registros fueron actualizados correctamente.");
    process.exit(0);
  } catch (err) {
    console.error("Error actualizando los registros:", err);
    process.exit(1);
  }
})();
