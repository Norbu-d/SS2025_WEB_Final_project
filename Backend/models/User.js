const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  static async create({ username, email, password, full_name }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (username, email, password, full_name)
       VALUES (?, ?, ?, ?)`,
      [username, email, hashedPassword, full_name]
    );
    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT id, username, email, full_name, bio, profile_picture 
       FROM users WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  static async updateProfile(id, { full_name, bio, website }) {
    await pool.query(
      `UPDATE users 
       SET full_name = ?, bio = ?, website = ?
       WHERE id = ?`,
      [full_name, bio, website, id]
    );
    return this.findById(id);
  }

  static async updateProfilePicture(id, profile_picture) {
    await pool.query(
      'UPDATE users SET profile_picture = ? WHERE id = ?',
      [profile_picture, id]
    );
    return this.findById(id);
  }

  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
  }

  static async verifyPassword(userId, password) {
    const [rows] = await pool.query(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );
    if (rows.length === 0) return false;
    return bcrypt.compare(password, rows[0].password);
  }
}

module.exports = User;