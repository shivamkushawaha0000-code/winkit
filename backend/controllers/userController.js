const User = require("../models/User");

// @desc    Get User Profile (with addresses)
// @route   GET /api/user/profile
exports.getUserProfile = async (req, res) => {
  try {
    // req.user.id comes from the auth middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user, // Frontend accesses data.user.savedAddresses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Add a new address
// @route   POST /api/user/address
exports.addAddress = async (req, res) => {
  try {
    const { address } = req.body; // Frontend sends { address: { ... } }

    if (!address) {
      return res
        .status(400)
        .json({ success: false, message: "No address provided" });
    }

    // Use $push to add to the embedded array
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { savedAddresses: address } },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Address saved successfully",
      // Frontend specifically expects 'addresses' in the response to update state
      addresses: updatedUser.savedAddresses,
    });
  } catch (error) {
    console.error("Error saving address:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete an address
// @route   DELETE /api/user/address/:addressId
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    // Use $pull to remove the specific address sub-document by its _id
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $pull: { savedAddresses: { _id: addressId } } 
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted",
      addresses: updatedUser.savedAddresses, // Return updated list
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update an existing address
// @route   PUT /api/user/address/:addressId
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { address } = req.body;

    // Find the user and the specific address, then update it
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id, "savedAddresses._id": addressId },
      {
        $set: {
          // The '$' represents the index of the address we found above
          "savedAddresses.$": { ...address, _id: addressId }
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      addresses: updatedUser.savedAddresses,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/user/all-users
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users, sorted by creation date (newest first)
    const users = await User.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};