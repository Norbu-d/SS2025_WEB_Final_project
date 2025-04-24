const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
  typeCast: function(field, next) {
    if (field.type === 'TINY' && field.length === 1) {
      return field.string() === '1';
    }
    return next();
  }
});

// Enhanced connection test
const testConnection = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('✅ Database connected successfully');
    
    // Verify tables exist
    const [tables] = await conn.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `, [process.env.DB_NAME]);
    
    console.log(`📊 Database contains ${tables.length} tables`);
    if (!tables.some(t => t.TABLE_NAME === 'users')) {
      console.warn('⚠️ "users" table not found!');
    }
  } catch (err) {
    console.error('❌ Database connection failed:');
    console.error('- Verify MySQL server is running');
    console.error('- Check DB credentials in .env');
    console.error('- Error details:', err.message);
    process.exit(1);
  } finally {
    if (conn) conn.release();
  }
};

testConnection();

module.exports = pool;