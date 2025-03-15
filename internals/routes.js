const express = require("express");
const { signup, login } = require("./controllers");

const router = express.Router();
router.post("/register", register);
router.post("/login", login);

module.exports = router;