const pool = require('../config/db');

class Post {
    static async create({ user_id, image_url, caption }) {
        const [result] = await pool.query(
            'INSERT INTO posts (user_id, image_url, caption) VALUES (?, ?, ?)',
            [user_id, image_url, caption]
        );
        return this.findById(result.insertId);
    }

    static async findById(id) {
        const [rows] = await pool.query(`
            SELECT p.*, u.username, u.profile_picture 
            FROM posts p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.id = ?
        `, [id]);
        return rows[0];
    }

    static async findByUserId(user_id) {
        const [rows] = await pool.query(`
            SELECT p.*, u.username, u.profile_picture 
            FROM posts p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.user_id = ? 
            ORDER BY p.created_at DESC
        `, [user_id]);
        return rows;
    }

    static async delete(id, user_id) {
        await pool.query('DELETE FROM posts WHERE id = ? AND user_id = ?', [id, user_id]);
    }

    static async getFeed(user_id, limit = 10, offset = 0) {
        const [rows] = await pool.query(`
            SELECT p.*, u.username, u.profile_picture 
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id IN (
                SELECT following_id FROM followers WHERE follower_id = ?
            )
            OR p.user_id = ?
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?
        `, [user_id, user_id, limit, offset]);
        return rows;
    }

    static async getAll(limit = 10, offset = 0) {
        const [rows] = await pool.query(`
            SELECT p.*, u.username, u.profile_picture 
            FROM posts p 
            JOIN users u ON p.user_id = u.id 
            ORDER BY p.created_at DESC 
            LIMIT ? OFFSET ?
        `, [limit, offset]);
        return rows;
    }
}

module.exports = Post;