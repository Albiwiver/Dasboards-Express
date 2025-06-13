const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  updateUser,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/update", authMiddleware, upload.single("avatar"), updateUser);
module.exports = router;
