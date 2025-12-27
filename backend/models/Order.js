const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Based on your screenshot showing 'items: Array (2)'
    items: [
      {
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        // Optional: Reference back to the Product model if needed
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    // Default fields that might not be in your screenshot yet but are good practice
    paymentMethod: {
      type: String,
      default: "COD",
    },
    deliveryAddress: {
      type: Object,
    },
  },
  { timestamps: true } // This automatically handles 'createdAt' seen in your image
);

module.exports = mongoose.model("Order", orderSchema);