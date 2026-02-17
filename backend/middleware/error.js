// ── Global Error Handler ──────────────────────────────────────────────────────
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "File size exceeds the 10MB limit.";
  }
  if (err.code === "LIMIT_FILE_COUNT") {
    statusCode = 400;
    message = "Too many files. Maximum 5 files per submission.";
  }

  // MySQL duplicate entry
  if (err.code === "ER_DUP_ENTRY") {
    statusCode = 409;
    message = "A record with this value already exists.";
  }

  if (process.env.NODE_ENV === "development") {
    console.error("🔴 Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// ── 404 Not Found ─────────────────────────────────────────────────────────────
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };