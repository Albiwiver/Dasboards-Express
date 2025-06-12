const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getIntegrations } = require("../controllers/integrationsController");

router.get("/", authMiddleware, getIntegrations);

module.exports = router;
