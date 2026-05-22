class ApiError extends Error {
  constructor(message, statusCode = 500, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends ApiError {
  constructor(message = "Bad request", errors = []) {
    super(message, 400, errors);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

class NotFoundError extends ApiError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

class ConflictError extends ApiError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

module.exports = {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
