const db = require("../config/db");
const { saveUser } = require("../controllers/usersController");

// Create Properties Table
const createPropertiesTable = `
  CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    property_type ENUM('House', 'Apartment', 'Flat', 'Room') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    photos TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`;

db.query(createPropertiesTable, (err) => {
  if (err) throw err;
  console.log("Properties table ready");
});

module.exports = db;
