const express = require("express");
const router = express.Router();

// Middleware import
const checkAuth = require("../middleware/check-auth");

// Schema imports
const User = require("../models/user");

// Controller import
const UserController = require("../controllers/users");

// Create user requests
router.post("/signup", checkAuth, UserController.user_signup);

// Login user requests
router.post("/login", UserController.user_login);

// DELETE user requests
router.delete("/:userId", checkAuth, UserController.user_delete);

module.exports = router;