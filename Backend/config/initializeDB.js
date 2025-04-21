const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function initializeDB() {
  const prisma = new PrismaClient();

  try {
    // Test connection
    await prisma.$connect();
    console.log('Database connected via Prisma');
    
    return prisma;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

module.exports = initializeDB;