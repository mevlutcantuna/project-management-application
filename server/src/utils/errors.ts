import { Response } from "express";
import { ZodError } from "zod";

export type ErrorIssue = { field?: string; message: string; code?: string };
export type ErrorResponseBody = {
  error: string;
  message?: string;
  issues?: ErrorIssue[];
};

// Send any error in one line
export function sendError(
  res: Response,
  status: number,
  body: ErrorResponseBody
) {
  return res.status(status).json(body);
}

export function sendZodError(res: Response, err: ZodError) {
  return sendError(res, 400, {
    error: "ValidationError",
    issues: err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
      code: issue.code,
    })),
  });
}

export const sendConflictError = (
  res: Response,
  field: string,
  message: string
) =>
  sendError(res, 409, {
    error: "ConflictError",
    issues: [{ field, message, code: "conflict" }],
  });

export const sendInternalError = (res: Response, message: string) =>
  sendError(res, 500, {
    error: "InternalServerError",
    message,
  });
