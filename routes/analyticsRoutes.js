const express = require("express");
const router = express.Router();
const {
  getNetIncome,
  getAverageSales,
  getCanceledOrders,
  getTotalOrders,
} = require("../controllers/analyticsController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/net-income", authMiddleware, getNetIncome);
router.get("/total-orders", authMiddleware, getTotalOrders);
router.get("/average-sales", authMiddleware, getAverageSales);
router.get("/canceled-orders", authMiddleware, getCanceledOrders);

module.exports = router;
