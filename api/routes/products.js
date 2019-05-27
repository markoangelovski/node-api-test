const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Middleware import
const checkAuth = require("../middleware/check-auth");

// Controller imports
const ProductsController = require("../controllers/products");

// Schema imports
const Product = require("../models/product");

// Handle GET requests to /products
router.get("/", checkAuth, ProductsController.products_get_all);

// Handle POST requests to /products
router.post("/", checkAuth, ProductsController.products_post_product);

// Handle GET single product requests
router.get("/:productId", checkAuth, ProductsController.products_get_product);

// Handle PATCH product requests
router.patch("/:productId", checkAuth, ProductsController.products_update_product);

// Handle DELETE product requests
router.delete("/:productId", checkAuth, ProductsController.products_delete_product);

module.exports = router;