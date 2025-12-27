const mongoose = require("mongoose");

// Sub-schema for Addresses
const addressSchema = new mongoose.Schema({
  label: { type: String, enum: ["Home", "Work", "Other"], default: "Home" },
  addressLine: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    // Identity
    phoneNumber: {
      type: String,
      required: true,
      unique: true, // This automatically creates an index
      trim: true,
    },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },

    // Authentication
    verifyOtp: { type: String, select: false },
    verifyOtpExpireAt: { type: Date },
    isPhoneVerified: { type: Boolean, default: false },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user", // Default to user so new sign-ups are not admins
    },                          

    // Commerce & Data
    savedAddresses: [addressSchema],
    // walletBalance: { type: Number, default: 0 },
    // FIXED: Added 'sparse: true'
    // This allows multiple users to have 'null' (no referral code).
    // 'unique: true' alone creates an error if more than one user has no code.
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    fcmToken: { type: String },
  },
  { timestamps: true }
);

userSchema.index({ "savedAddresses.location": "2dsphere" });

module.exports = mongoose.model("User", userSchema);