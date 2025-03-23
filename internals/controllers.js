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

  const token = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit token
  const expiryTime = Date.now() + 15 * 60 * 1000; // Token expires in 15 minutes

  // Check if the user exists
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    // Store the reset token in the database
    db.query("UPDATE users SET reset_token = ? WHERE email = ?", [token, email], (err) => {
      if (err) return res.status(500).json({ message: "Error saving reset token" });

      // Send email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        to: email,
        subject: "Password Reset",
        text: `Your password reset code is: ${token}. This code expires in 15 minutes.`,
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) return res.status(500).json({ message: "Error sending email" });
        res.json({ message: "Password reset email sent" });
      });
    });
  });
};

// Reset password functionality
exports.resetPassword = (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ message: "Invalid request" });

  // Check if the token is valid
  db.query("SELECT * FROM users WHERE reset_token = ?", [token], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(400).json({ message: "Invalid or expired token" });

    const user = results[0];

    // Hash the new password
    bcrypt.hash(newPassword, 10, (err, hash) => {
      if (err) return res.status(500).json({ message: "Error hashing password" });

      // Update the password and clear the reset token
      db.query("UPDATE users SET password = ?, reset_token = NULL WHERE reset_token = ?", [hash, token], (err) => {
        if (err) return res.status(500).json({ message: "Error updating password" });
        res.json({ message: "Password updated successfully" });
      });
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

// Add a new property
exports.addProperty = (req, res) => {
  const {name, phone, email, address, propertyType, price, description } = req.body;
  const photos = req.file ? req.file.buffer : null;

  const query = `INSERT INTO properties (name, phone, email, address, property_type, price, description, photos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [name, phone, email, address, propertyType, price, description, photos];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error adding property:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Property added successfully", propertyId: result.insertId });
  });
};


// Get paginated properties for the dashboard
exports.getProperties = (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  db.query(`SELECT id, name, phone, email, address, property_type, price, description FROM properties LIMIT ? OFFSET ?`, [parseInt(limit), offset], (err, results) => {
    if (err) {
      console.error("Error fetching properties:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};



// Update property (only by owner)
exports.updateProperty = (req, res) => {
  const { id } = req.params;
  const { name, phone, email, address, propertyType, price, description } = req.body;
  const userId = req.user.id; // Retrieved from authentication middleware

  db.query(`UPDATE properties SET name=?, phone=?, email=?, address=?, property_type=?, price=?, description=? WHERE id=? AND user_id=?`, 
    [name, phone, email, address, propertyType, price, description, id, userId], 
    (err, result) => {
      if (err) {
        console.error("Error updating property:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.affectedRows === 0) return res.status(403).json({ error: "Unauthorized or property not found" });
      res.json({ message: "Property updated successfully" });
    }
  );
};

// Delete property (only by owner)
exports.deleteProperty = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.query(`DELETE FROM properties WHERE id=? AND user_id=?`, [id, userId], (err, result) => {
    if (err) {
      console.error("Error deleting property:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) return res.status(403).json({ error: "Unauthorized or property not found" });
    res.json({ message: "Property deleted successfully" });
  });
};
