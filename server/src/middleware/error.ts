import type { ErrorRequestHandler, RequestHandler } from "express";
import { toErrorResponse, NotFoundError } from "@/utils/errors";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res) => {
  const { status, body } = toErrorResponse(err);

  // In production, avoid leaking stack traces
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    console.error(err);
  }

  res.status(status).json(body);
};
