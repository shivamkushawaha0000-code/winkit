const Product = require("../models/Product");
const Category = require("../models/Category");

// --- GET: Get Products (Filter by Category OR Search) ---
exports.getProducts = async (req, res) => {
  try {
    const { categoryId, search } = req.query;

    let query = {};

    // 1. Filter by Category ID (Sidebar Click)
    if (categoryId) {
      query.category = categoryId;
    }

    // 2. Search Logic (Navbar Search)
    if (search) {
      // Step A: Find categories that match the search term
      const matchingCategories = await Category.find({
        name: { $regex: search, $options: "i" },
      });

      const matchingCategoryIds = matchingCategories.map((cat) => cat._id);

      // Step B: Find products that match the Name OR belong to matching Categories
      query.$or = [
        { name: { $regex: search, $options: "i" } }, // Match Product Name
        { category: { $in: matchingCategoryIds } }, // Match Category Name
      ];
    }

    const products = await Product.find(query).populate("category", "name");

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ---- Get Single Product by ID ----
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    // Handle invalid ID format (CastError) specially
    if (error.name === "CastError") {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// Update Product by id

exports.updateProductById = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );
    res.json({ success: true, data: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Product by id
exports.deleteProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};
