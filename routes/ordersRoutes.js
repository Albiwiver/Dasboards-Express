const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getOrders,
  getOrderDetails,
  uploadOrdersCSV,
} = require("../controllers/ordersController");
const upload = require("../middlewares/upload");

router.get("/", authMiddleware, getOrders);
router.get("/:id", authMiddleware, getOrderDetails);
router.post(
  "/upload-csv",
  authMiddleware,
  upload.single("file"),
  uploadOrdersCSV
);

module.exports = router;
