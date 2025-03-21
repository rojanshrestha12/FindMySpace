const express = require("express");
const { signup, login, saveUser, forgotPassword, resetPassword } = require("./controllers");

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/saveUser", saveUser);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);

module.exports = router;