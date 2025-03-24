const db = require("../config/db");

exports.addProperty = (req, res) => {
    const { name, phone, email, address, propertyType, price, description } = req.body;
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No photos uploaded" });
    }
  
    // Map uploaded files to their paths
    const photoPaths = req.files.map((file) => `/uploads/${file.filename}`);
    console.log(name,phone,email,photoPaths)
  
  
    db.query(
      `INSERT INTO properties (name, phone, email, address, property_type, price, description, photos) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, phone, email, address, propertyType, price, description, JSON.stringify(photoPaths)],
      (err, result) => {
        if (err) {
          console.error("Error saving property:", err);
          return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Property added successfully!", id: result.insertId });
      }
    );
  };
  
  
  
  
  // Get paginated properties for the dashboard
  exports.getProperties = (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
  
    db.query(`SELECT id, name, phone, email, address, property_type, price, description,photos FROM properties LIMIT ? OFFSET ?`, [parseInt(limit), offset], (err, results) => {
      if (err) {
        console.error("Error fetching properties:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    });
  };
  