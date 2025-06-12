// scripts/uploadAllImages.js

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const User = require("../models/User");
const Integration = require("../models/Integration");

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const folders = [
  { folder: "products", model: Product, field: "imageUrl" },
  { folder: "customers", model: Customer, field: "avatar" },
  { folder: "users", model: User, field: "avatar" },
  { folder: "integrations", model: Integration, field: "image" },
];

async function uploadAndUpdate(folder, model, field) {
  const dir = path.join(__dirname, "..", "assets", folder);
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const id = path.parse(file).name;
    const filePath = path.join(dir, file);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `zoeshop/${folder}`,
        public_id: id,
      });

      await model.findByIdAndUpdate(id, { [field]: result.secure_url });
      console.log(`✅ ${folder}: ${id} actualizado con imagen`);
    } catch (error) {
      console.error(`❌ Error con ${folder}/${file}:`, error.message);
    }
  }
}

(async () => {
  for (const { folder, model, field } of folders) {
    console.log(`📤 Subiendo imágenes de ${folder}...`);
    await uploadAndUpdate(folder, model, field);
  }

  console.log("✅ Todos los archivos han sido procesados.");
  process.exit();
})();
