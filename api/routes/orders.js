const express = require("express");
const router = express.Router();

// Middleware import
const checkAuth = require("../middleware/check-auth");

// Controller imports
const OrdersController = require("../controllers/orders");

// Handle incoming GET requests to /orders
router.get("/", checkAuth, OrdersController.orders_get_all);

// Handle incoming POST requests to /orders
router.post("/", checkAuth, OrdersController.orders_create_order);

// Handle incoming GET requests for single order
router.get("/:orderId", checkAuth, OrdersController.orders_get_order);

// Handle incoming DELETE order requests
router.delete("/:orderId", checkAuth, OrdersController.orders_delete_order);

module.exports = router;