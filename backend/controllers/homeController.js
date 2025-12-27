const Category = require("../models/Category");
const Banner = require("../models/Banner");

// 1. Fetch Home Data (Categories + Banners)
const getHomeData = async (req, res) => {
  try {
    // Fetch active categories sorted by priority
    const categories = await Category.find({ isActive: true }).sort({
      priority: -1,
    });

    // Fetch active banners
    const banners = await Banner.find({ isActive: true }).populate(
      "linkedCategory"
    );;

    // Filter banners in memory (efficient for small datasets)
    const heroBanner = banners.find((b) => b.type === "hero");
    const secondaryBanners = banners.filter((b) => b.type === "secondary");

    res.status(200).json({
      success: true,
      data: {
        heroBanner,
        secondaryBanners,
        categories,
      },
    });
  } catch (error) {
    console.error("Error fetching home data:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// 2. Create a new Category
const createCategory = async (req, res) => {
  try {
    const { name, image, alt, priority, isActive } = req.body;

    const newCategory = new Category({
      name,
      image,
      alt: alt || name,
      priority: priority || 0,
      isActive,
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category added!",
      category: newCategory,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
};

// get all category

const getCategory = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getHomeData,
  createCategory,
  getCategory,
};
