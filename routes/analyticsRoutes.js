const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/net-income", authMiddleware, analyticsController.getNetIncome);
router.get("/total-orders", authMiddleware, analyticsController.getTotalOrders);
router.get(
  "/average-sales",
  authMiddleware,
  analyticsController.getAverageSales
);
router.get(
  "/canceled-orders",
  authMiddleware,
  analyticsController.getCanceledOrders
);

module.exports = router;
