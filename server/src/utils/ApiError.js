export default class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);

    this.statusCode = statusCode; // ✅ REQUIRED
    this.status = "error"; // optional but useful
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
