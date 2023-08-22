"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, statusCode, status, isOperational) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.status = status;
        this.isOperational = isOperational;
        this.statusCode = statusCode;
        this.isOperational = true;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
