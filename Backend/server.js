require('dotenv').config();
const app = require('./app');
const http = require('http');
const initializeDB = require('./config/initializeDB');

const port = process.env.PORT || 5000;

initializeDB().then(() => {
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to initialize DB:', err);
  process.exit(1);
});