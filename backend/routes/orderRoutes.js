const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// Protect this route so we know WHO is asking for orders
router.get("/myorders", protect, orderController.getMyOrders);

module.exports = router;