const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Map endpoints to controller functions
router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);

module.exports = router;
