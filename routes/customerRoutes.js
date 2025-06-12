const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getAllCustomers,
  getCustomer,
} = require("../controllers/customerController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createCustomer);
router.get("/:id", authMiddleware, getCustomer);
router.get("/", authMiddleware, getAllCustomers);

module.exports = router;
