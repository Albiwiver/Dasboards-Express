// scripts/addAvatars.js

const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");
const Customer = require("../models/Customer");

// Conexión a tu base de datos
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function addAvatars() {
  try {
    // Añadir avatar por defecto a los usuarios
    await User.updateMany(
      { avatar: { $exists: false } },
      {
        $set: {
          avatar:
            "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v123456/default-user.png",
        },
      }
    );

    // Añadir avatar por defecto a los clientes
    await Customer.updateMany(
      { avatar: { $exists: false } },
      {
        $set: {
          avatar:
            "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v123456/default-customer.png",
        },
      }
    );

    console.log("Avatares añadidos correctamente.");
    process.exit();
  } catch (err) {
    console.error("Error actualizando avatares:", err);
    process.exit(1);
  }
}

addAvatars();
