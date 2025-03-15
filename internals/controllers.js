const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const { username, phone, email, password, role } = req.body;
  if (!username || !phone || !email || !password || !role) {
    return res.status(400).json({ message: "All fields required" });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: "Error hashing password" });

    const sql = "INSERT INTO users (username, phone, email, password, role) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [username, phone, email, hash, role], (err) => {
      if (err) return res.status(500).json({ message: "User already exists or DB error" });
      res.json({ message: "User created" });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ message: "Invalid credentials" });

    const user = results[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (!match) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    });
  });
};