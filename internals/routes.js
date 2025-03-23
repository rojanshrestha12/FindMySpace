const express = require("express");
const propertyController = require("./controllers");
const { signup, login, saveUser, forgotPassword, resetPassword} = require("./controllers");
const multer = require("multer");
const upload = multer();

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/saveUser", saveUser);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);
router.post("/addProperty", upload.single("photo"), propertyController.addProperty); // Updated endpoint
router.get("/properties", propertyController.getProperties);
router.put("/properties/:id", propertyController.updateProperty);
router.delete("/properties/:id", propertyController.deleteProperty);

module.exports = router;