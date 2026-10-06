/**
 * middleware/errorHandler.ts
 * Merkezi hata yakalama middleware'i.
 * Express'te tüm route'lardan sonra kayit edilmeli.
 *
 * Kullanim (server.ts icinde):
 *   import errorHandler from './middleware/errorHandler';
 *   app.use(errorHandler);
 */
import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  status?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err.status || 500;
  const isDev = process.env.NODE_ENV !== 'production';

  console.error(`[ErrorHandler] ${status} — ${err.message}`, isDev ? err.stack : '');

  res.status(status).json({
    success: false,
    error: err.message || 'Sunucu hatasi olustu.',
    code: err.code || 'INTERNAL_SERVER_ERROR',
    ...(isDev && { stack: err.stack })
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: 'Istenen endpoint bulunamadi.',
    code: 'NOT_FOUND'
  });
}