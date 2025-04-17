const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDB() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        bio TEXT,
        profile_picture VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

module.exports = initializeDB;