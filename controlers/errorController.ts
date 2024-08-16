import { Response } from "express";

const AppError = require("../utils/AppError");

interface CastError extends Error {
  path: string;
  value: any;
}

const handleCastErrorDB = (err: CastError) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: CastError) => {
  const value = err.keyValue.name;
  const message = `Duplicate field values: ${value} Please use another value`;

  return new AppError(message, 400);
};

const sendErrorDev = (err: CastError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err.message,
  });
};
