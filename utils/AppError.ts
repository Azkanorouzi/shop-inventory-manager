export default class AppError extends Error {
  statusCode: string;
  isOperational: boolean;
  constructor(message: string, statusCode: string) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

