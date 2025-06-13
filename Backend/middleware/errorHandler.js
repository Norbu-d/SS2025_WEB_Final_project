// errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { JsonWebTokenError } from 'jsonwebtoken';
import { MongooseError } from 'mongoose';

interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: number;
  errors?: Record<string, any>;
  keyPattern?: Record<string, any>;
  path?: string;
  kind?: string;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error with colored output
  console.error('\x1b[31m', '[ERROR]', err.stack || err.message, '\x1b[0m');

  // Initialize response object
  const errorResponse = {
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      fullError: err
    })
  };

  // Handle different error types
  switch (true) {
    // Mongoose Validation Error
    case err.name === 'ValidationError':
      return res.status(400).json({
        ...errorResponse,
        message: 'Validation failed',
        errors: Object.values(err.errors || {}).map((e: any) => ({
          param: e.path,
          message: e.message,
          type: e.kind
        }))
      });

    // JWT Errors
    case err instanceof JsonWebTokenError:
      return res.status(401).json({
        ...errorResponse,
        message: 'Invalid authentication token'
      });

    // MongoDB Duplicate Key Error
    case err.code === 11000:
      return res.status(409).json({
        ...errorResponse,
        message: 'Duplicate field value',
        field: Object.keys(err.keyPattern || {})[0]
      });

    // Prisma Errors
    case err instanceof Prisma.PrismaClientKnownRequestError:
      return handlePrismaError(err, res);

    case err instanceof Prisma.PrismaClientValidationError:
      return res.status(400).json({
        ...errorResponse,
        message: 'Database validation failed'
      });

    // Custom Operational Errors
    case err.isOperational:
      return res.status(err.statusCode || 500).json(errorResponse);

    // Default 500 Error
    default:
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && {
          error: err.message
        })
      });
  }
};

// Helper function for Prisma errors
const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError, res: Response) => {
  const errorResponse = {
    success: false,
    message: 'Database operation failed'
  };

  switch (err.code) {
    case 'P2002':
      return res.status(409).json({
        ...errorResponse,
        message: 'Unique constraint violation',
        field: err.meta?.target?.[0]
      });
    case 'P2025':
      return res.status(404).json({
        ...errorResponse,
        message: 'Record not found'
      });
    case 'P2003':
      return res.status(400).json({
        ...errorResponse,
        message: 'Foreign key constraint failed'
      });
    default:
      return res.status(500).json(errorResponse);
  }
};

export default errorHandler;