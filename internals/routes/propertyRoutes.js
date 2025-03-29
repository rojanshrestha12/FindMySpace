const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");
const multer  = require ("multer")
const path = require("path")
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file
  },
})
const upload = multer({ storage: storage })

// Add a new property
router.post("/addProperty",upload.array("photos",5), propertyController.addProperty);

// Get all properties
router.get("/properties", propertyController.getProperties);
// Filter properties
router.get("/filterProperties", propertyController.filterProperties);

module.exports = router;