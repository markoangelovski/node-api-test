const express = require("express");
const router = express.Router();

// Middleware imports
const checkAuth = require("../middleware/check-auth");

// Controllers imports
const UserControler = require("../controllers/users-ctrl");

// Handles user signups
router.post("/signup", checkAuth, UserControler.user_signup);

// Handles user logins
router.post("/login", UserControler.user_login);

// Handles user deletes
router.delete("/:userId", checkAuth, UserControler.user_delete);

module.exports = router;