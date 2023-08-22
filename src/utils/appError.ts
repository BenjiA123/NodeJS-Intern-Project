class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public status?: string,
    public isOperational?: boolean
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
