const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// User signup
exports.signup = (req, res) => {
  const { username, phone, email, password} = req.body;
  if (!username || !phone || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: "Error hashing password" });

    const sql = "INSERT INTO users (username, phone, email, password) VALUES (?, ?, ?, ?)";
    db.query(sql, [username, phone, email, hash], (err) => {
      if (err) return res.status(500).json({ message: "User already exists or DB error" });
      res.json({ message: "User created" });
    });
  }); 
};

// User login
exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ message: "Invalid credentials" });

    const user = results[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (!match) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    });
  });
};

// Forgot password functionality
exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const token = crypto.randomBytes(32).toString("hex");
  db.query("UPDATE users SET reset_token = ? WHERE email = ?", [token, email], (err) => {
    if (err) return res.status(500).json({ message: "Error generating reset token" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: email,
      subject: "Password Reset",
      text: `Click the link to reset your password: http://localhost:3000/resetpassword/${token}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return res.status(500).json({ message: "Error sending email" });
      res.json({ message: "Password reset email sent" });
    });
  });
};

// Reset password
exports.resetPassword = (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ message: "Invalid request" });

  bcrypt.hash(newPassword, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: "Error hashing password" });

    db.query("UPDATE users SET password = ?, reset_token = NULL WHERE reset_token = ?", [hash, token], (err) => {
      if (err) return res.status(500).json({ message: "Error updating password" });
      res.json({ message: "Password updated successfully" });
    });
  });
};


exports.saveUser = (req, res) => {
  const { email, name, google_id } = req.body;
  if (!email || !name || !google_id) {
    return res.status(400).json({ message: "All fields required" });
  }

  const query = `
    INSERT INTO users (email, username, google_id)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE username = VALUES(username), google_id = VALUES(google_id)
  `;
  db.query(query, [email, name, google_id], (err) => {
    if (err) return res.status(500).json({ message: "Error saving user" });
    res.json({ message: "User saved" });
  });
}