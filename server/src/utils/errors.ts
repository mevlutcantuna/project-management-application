import { ZodError } from "zod";

export type ErrorIssue = { field?: string; message: string; code?: string };
export type ErrorResponseBody = {
  error: string;
  message?: string;
  issues?: ErrorIssue[];
};

export class AppError extends Error {
  public status: number;
  public code: string;
  public issues?: ErrorIssue[];
  public isOperational: boolean;

  constructor(
    message: string,
    status: number,
    code: string,
    issues?: ErrorIssue[]
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
    this.issues = issues;
    this.isOperational = true;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", issues?: ErrorIssue[]) {
    super(message, 400, "BadRequestError", issues);
  }
}

export class ValidationError extends AppError {
  constructor(err: ZodError) {
    const issues: ErrorIssue[] = err.issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
      code: i.code,
    }));
    super("Validation failed", 400, "ValidationError", issues);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UnauthorizedError");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404, "NotFoundError");
  }
}

export class ConflictError extends AppError {
  constructor(field: string, message: string) {
    super(message, 409, "ConflictError", [
      { field, message, code: "conflict" },
    ]);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, 500, "InternalServerError");
  }
}

export function toErrorResponse(err: unknown): {
  status: number;
  body: ErrorResponseBody;
} {
  if (err instanceof AppError) {
    return {
      status: err.status,
      body: { error: err.code, message: err.message, issues: err.issues },
    };
  }

  if (err instanceof ZodError) {
    const v = new ValidationError(err);
    return {
      status: v.status,
      body: { error: v.code, message: v.message, issues: v.issues },
    };
  }

  if (err instanceof NotFoundError) {
    return {
      status: 404,
      body: { error: "NotFoundError", message: err.message },
    };
  }

  if (err instanceof UnauthorizedError) {
    return {
      status: 401,
      body: { error: "UnauthorizedError", message: err.message },
    };
  }

  if (err instanceof ConflictError) {
    return {
      status: 409,
      body: { error: "ConflictError", message: err.message },
    };
  }

  if (err instanceof BadRequestError) {
    return {
      status: 400,
      body: { error: "BadRequestError", message: err.message },
    };
  }

  if (err instanceof InternalServerError) {
    return {
      status: 500,
      body: { error: "InternalServerError", message: err.message },
    };
  }

  return {
    status: 500,
    body: { error: "InternalServerError", message: "Unexpected error" },
  };
}
