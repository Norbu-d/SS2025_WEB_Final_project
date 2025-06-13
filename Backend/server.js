// server.js
require('dotenv').config();
const http = require('http');
const app = require('./app'); // Import the Express app
const { PrismaClient } = require('@prisma/client');
const logger = require('./utils/logger');

const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to the database
    await prisma.$connect();
    logger.info('✅ Database connected via Prisma');

    // Attach Prisma to app locals
    app.locals.prisma = prisma;

    const server = http.createServer(app);

    // Graceful shutdown
    const gracefulShutdown = async () => {
      await prisma.$disconnect();
      server.close(() => {
        logger.info('🔌 Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    process.on('uncaughtException', (err) => {
      logger.error('⚠️ Uncaught Exception:', err);
      gracefulShutdown();
    });

    server.listen(port, () => {
      logger.info(`🚀 Server running on port ${port}`);
    });

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
