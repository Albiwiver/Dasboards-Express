const mongoose = require("mongoose");

const userIntegrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    integration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Integration",
      required: true,
    },
    connected: {
      type: Boolean,
      default: false,
    },
    connectedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    unique: true,
  }
);

userIntegrationSchema.index({ user: 1, integration: 1 }, { unique: true });

module.exports = mongoose.model("UserIntegration", userIntegrationSchema);
