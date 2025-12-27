const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

// Protected Routes (Requires Token)
router.get("/profile", protect, userController.getUserProfile);
router.post("/address", protect, userController.addAddress);
router.put("/address/:addressId", protect, userController.updateAddress);
router.delete("/address/:addressId", protect, userController.deleteAddress);

router.get("/all-users", protect, admin, userController.getAllUsers);
module.exports = router;