const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getIntegrations,
  updateIntegrationStatus,
} = require("../controllers/integrationsController");

router.get("/", authMiddleware, getIntegrations);
router.put("/:integrationId", authMiddleware, updateIntegrationStatus);

module.exports = router;
