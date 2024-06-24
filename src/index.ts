import dotenv from 'dotenv';
import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'reflect-metadata';

dotenv.config({ path: '.env' });

import routes from './routes';
import { ErrorResponse } from './core/error.response';
import mssqlConnection from './db/mssql.connect';
import { ERROR_MESSAGE } from './constants';

const app = express();
const allowedOrigins = [
  'http://localhost:2024',
  'http://127.0.0.1:2024',
  'http://localhost:3050',
  'http://localhost:9900',
];
const corsOptions = {
  credentials: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  origin: function (origin: any, callback: any) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

/**
 * App Configuration
 */
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);

/**
 * Handle error
 */
app.all('*', (req, res, next) => {
  next(new ErrorResponse(`Can't not find ${req.originalUrl} on this server`, 404));
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
app.use((error: Error | any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = error.status || 500;

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    error.message = ERROR_MESSAGE.INVALID_TOKEN_PLEASE_LOGIN_AGAIN;
  }

  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    error.message = ERROR_MESSAGE.INVALID_TOKEN_PLEASE_LOGIN_AGAIN;
  }

  if (error.name === 'QueryFailedError') {
    if (error.message.includes('The DELETE statement conflicted with the REFERENCE constraint')) {
      statusCode = 409;
      error.message = 'Không thể xóa dữ liệu vì nó đang được tham chiếu trong một bảng khác.';
    }
  }

  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: error.stack,
    message: error.message || ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
  });
});

/**
 * Database initialize
 */
mssqlConnection
  .initialize()
  .then(async connection => {
    console.log('Connected Mssql Success');

    // Create a query
    try {
      const result = await connection.query('SELECT 1 + 1 AS number');
      console.log('Query successful, result:', result);
    } catch (error) {
      console.log('Query failed:', error);
    }
  })
  .catch(error => console.log(error));

/**
 * Server activation
 */
const PORT = process.env.PORT || 3050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
