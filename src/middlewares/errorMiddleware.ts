import { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError';

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): Response => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  return res.status(500).json({ error: 'Internal Server Error' });
};

export default errorMiddleware;
