const express = require("express");
const router = express.Router();

const multer = require("multer");

// Middleware imports
const checkAuth = require("../middleware/check-auth");

// Controllers imports
const ProductController = require("../controllers/products-ctrl")

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }    
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// Handle all GET requests to /products
router.get("/", ProductController.products_get_all);

// Handle create product requests
router.post("/",checkAuth, upload.single("productImage"), ProductController.products_create_product);

// Handle GET single product requests
router.get("/:productId", ProductController.products_get_product);

// Handle PATCH requests for single product
router.patch("/:productId", checkAuth, ProductController.products_update_product);

// Handle DELETE product requests 
router.delete("/:productId", checkAuth, ProductController.products_delete_product);

module.exports = router;