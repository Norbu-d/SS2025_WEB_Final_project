// server.js
require('dotenv').config();
const http = require('http');
const app = require('./app'); // This now properly imports the Express app
const { PrismaClient } = require('@prisma/client');
const logger = require('./utils/logger');

const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('✅ Database connected via Prisma');

    // Attach Prisma to app
    app.locals.prisma = prisma;

    const server = http.createServer(app);

    // Graceful shutdown handler
    const gracefulShutdown = async () => {
      await prisma.$disconnect();
      server.close(() => {
        logger.info('🔌 Server closed');
        process.exit(0);
      });
    };

    // Process event handlers
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