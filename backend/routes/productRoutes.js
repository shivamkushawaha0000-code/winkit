const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// GET /api/products (can pass ?categoryId=...)
router.get("/products", productController.getProducts);

// GET /api/products/:id
router.get("/products/:id", productController.getProductById);

//PUT/ Update /api/products/:id
router.put("/products/:id", productController.updateProductById);

// POST /api/products
router.post("/products", productController.createProduct);


// DELETE/api/products/:id
router.delete("/products/:id", productController.deleteProductById);

module.exports = router;
