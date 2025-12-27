const User = require("../models/User"); // Assuming your schema is in models/User.js
const jwt = require("jsonwebtoken");

// Helper to generate 4 digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

exports.sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber || phoneNumber.length !== 10) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid phone number" });
    }

    // 1. Generate OTP
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 1 * 60 * 1000); // 1 minutes from now

    // 2. Upsert User (Create if new, Update if exists)
    // We use findOneAndUpdate with upsert: true 
    await User.findOneAndUpdate(
      { phoneNumber },
      {
        verifyOtp: otp,
        verifyOtpExpireAt: expiry,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 3. In Real App: Send SMS via Twilio/Fast2SMS here
    console.log(`[DEV MODE] OTP for ${phoneNumber} is: ${otp}`);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // 1. Find User (Explicitly select verifyOtp because we set select: false in schema)
    const user = await User.findOne({ phoneNumber }).select("+verifyOtp");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // 2. Check if OTP matches
    if (user.verifyOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // 3. Check if Expired
    if (new Date() > user.verifyOtpExpireAt) {
      return res.status(400).json({ success: false, message: "OTP Expired" });
    }

    // 4. Success: Clear OTP fields and Mark Verified
    user.verifyOtp = undefined;
    user.verifyOtpExpireAt = undefined;
    user.isPhoneVerified = true;
    await user.save();

    // 5. Generate JWT Token
    const token = jwt.sign(
      { id: user._id, phone: user.phoneNumber, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};