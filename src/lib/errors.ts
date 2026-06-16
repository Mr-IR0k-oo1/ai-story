export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code: string = "INTERNAL_ERROR"
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends AppError {
  constructor() {
    super("Too many requests. Please slow down.", 429, "RATE_LIMIT_ERROR");
    this.name = "RateLimitError";
  }
}

export class AIError extends AppError {
  constructor(message: string, public readonly retryable: boolean = true) {
    super(message, 502, "AI_ERROR");
    this.name = "AIError";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function toErrorResponse(error: unknown) {
  if (isAppError(error)) {
    return {
      error: error.message,
      code: error.code,
      status: error.statusCode,
    };
  }
  return {
    error: "An unexpected error occurred",
    code: "INTERNAL_ERROR",
    status: 500,
  };
}
