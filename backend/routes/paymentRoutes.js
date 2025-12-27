const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripeController");
const { protect } = require("../middleware/authMiddleware");

// Route matched in StripeCheckout.jsx: /api/payment/create-payment-intent
router.post("/create-payment-intent", protect, stripeController.createPaymentIntent);
router.post("/confirm-order", protect, stripeController.confirmOrder);

module.exports = router;