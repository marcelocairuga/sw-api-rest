import { Request, Response, NextFunction } from 'express';
import { APIError } from '../errors/api-error'; 

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
   console.error(err);
   let statusCode = 500;
   let message = 'Internal Server Error';

   if (err instanceof APIError) {
      statusCode = err.statusCode;
      message = err.message;
   }

   res.status(statusCode).json({ error: message });
}