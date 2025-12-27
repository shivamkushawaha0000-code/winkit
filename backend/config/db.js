const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  try {
    // Use MONGODB_URI from .env, or fallback to local DB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected");
  } catch (err) {
    console.log("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;