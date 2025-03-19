const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "auth_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");

  const createTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255),
      google_id VARCHAR(255) UNIQUE NULL,
      reset_token VARCHAR(255) NULL
    )
  `;

  db.query(createTable, (err) => {
    if (err) throw err;
    console.log("Users table ready");
  });
});

module.exports = db;
