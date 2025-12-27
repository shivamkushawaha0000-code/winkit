const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

// GET request to fetch data for the React Home page
// Endpoint: /api/home
router.get("/home", homeController.getHomeData);

// POST requests to add data (use Postman for these)
// Endpoint: /api/category
router.post("/category", homeController.createCategory);
router.get('/category', homeController.getCategory);

module.exports = router; 