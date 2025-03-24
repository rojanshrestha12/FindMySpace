const express = require("express");
const propertyController = require("../controllers/propertyController");

const multer = require("multer");
const path = require("path");


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage: storage });

const router = express.Router();


// Apply multer middleware to the /addProperty route
router.post("/addProperty", upload.array("photos", 10), propertyController.addProperty); // Allow up to 10 files

router.get("/properties", propertyController.getProperties);
// router.put("/properties/:id", propertyController.updateProperty);
// router.delete("/properties/:id", propertyController.deleteProperty);
module.exports = router;