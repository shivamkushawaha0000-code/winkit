const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    alt: {
      type: String,
      default: "category-image",
    },
    // Optional: To control sort order on the UI
    priority: {
      type: Number,
      default: 0,
    },
    // Optional: To hide a category without deleting it
    isActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
