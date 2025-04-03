const express = require("express");
const { saveUser } = require("../models/userModel");

const router = express.Router();

router.post("/google-signin", (req, res) => {
  const user = req.body; // Expecting { email, name, google_id }
  saveUser(user, (err, result) => {
    if (err) {
      console.error("Error saving user:", err);
      return res.status(500).json({ error: "Failed to save user" });
    }
    res.status(200).json({ message: "User saved successfully", result });
  });
});

module.exports = router;
