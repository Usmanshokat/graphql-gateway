class AppError extends Error {
  constructor(message, code = "INTERNAL_SERVER_ERROR") {
    super(message);

    this.code = code;
  }
}

export default AppError;