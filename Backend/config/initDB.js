const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDB() {
    let connection;
    try {
        // Create connection without specifying database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        // Create database if not exists
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`Database ${process.env.DB_NAME} created or already exists`);
        
        // Switch to the database
        await connection.query(`USE ${process.env.DB_NAME}`);
        
        // Create tables in proper order (parents before children)
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
            )
        `);
        console.log('Users table created');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                image_url VARCHAR(255) NOT NULL,
                caption TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Posts table created');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS comments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                post_id INT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
            )
        `);
        console.log('Comments table created');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS likes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                post_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                UNIQUE KEY unique_like (user_id, post_id)
            )
        `);
        console.log('Likes table created');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS followers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                follower_id INT NOT NULL,
                following_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_follow (follower_id, following_id)
            )
        `);
        console.log('Followers table created');

        // Optional tables
        await connection.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                sender_id INT NOT NULL,
                post_id INT,
                type ENUM('like', 'comment', 'follow') NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL
            )
        `);
        console.log('Notifications table created');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sender_id INT NOT NULL,
                receiver_id INT NOT NULL,
                content TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Messages table created');

        console.log('All tables created successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

initializeDB();