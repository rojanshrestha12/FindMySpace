const db = require("../config/db");

// Create Users Table
const createUsersTable = `
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

db.query(createUsersTable, (err) => {
  if (err) throw err;
  console.log("Users table ready");
});

// Save User (Google Sign-In)
const saveUser = (user, callback) => {
  const { email, name, google_id } = user;
  const query = `
    INSERT INTO users (email, username, google_id)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE username = VALUES(username), google_id = VALUES(google_id)
  `;
  db.query(query, [email, name, google_id], callback);
};

module.exports = { saveUser };
