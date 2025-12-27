const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
    trim: true,
  },
  alt: {
    type: String,
  },
  // 'hero' for the top big image, 'secondary' for the row of 3
  type: {
    type: String,
    enum: ["hero", "secondary"],
    required: true,
  },
  // Where should the user go when they click this banner?
  targetUrl: {
    type: String,
    default: "#",
  },
  // FIXED: Added 'linkedCategory' so .populate('linkedCategory') works
  linkedCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Must match the model name in Category.js
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Banner", bannerSchema);