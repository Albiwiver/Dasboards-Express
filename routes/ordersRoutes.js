const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const ordersController = require("../controllers/ordersController");
const upload = require("../middlewares/upload");

router.get("/", authMiddleware, ordersController.getOrders);
router.post(
  "/upload-csv",
  authMiddleware,
  upload.single("file"),
  ordersController.uploadOrdersCSV
);

module.exports = router;
