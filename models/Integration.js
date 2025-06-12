const mongoose = require("mongoose");

const integrationSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Integration", integrationSchema);
