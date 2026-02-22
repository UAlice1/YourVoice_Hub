require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./config/db");
const { errorHandler, notFound } = require("./middleware/error");

// Route imports
const authRoutes  = require("./routes/auth");
const caseRoutes  = require("./routes/cases");
const aiRoutes    = require("./routes/ai");
const ngoRoutes   = require("./routes/ngo");
const adminRoutes = require("./routes/admin");

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Health Check ───────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "YourVoice Hub API is running 🚀",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use("/api/auth",  authRoutes);   // POST /api/auth/register, /api/auth/login, GET /api/auth/me
app.use("/api/cases", caseRoutes);   // POST /api/cases, GET /api/cases, etc.
app.use("/api/ai",    aiRoutes);     // POST /api/ai/chat, GET /api/ai/history
app.use("/api/ngo",   ngoRoutes);    // GET /api/ngo/cases, /api/ngo/reports, etc.
app.use("/api/admin", adminRoutes);  // Admin-only: user management & referrals

// ── Error Handling ─────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 YourVoice Hub API running on http://localhost:${PORT}`);
    console.log(`📋 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`\nAvailable endpoints:`);
    console.log(`  POST   /api/auth/register`);
    console.log(`  POST   /api/auth/login`);
    console.log(`  GET    /api/auth/me`);
    console.log(`  POST   /api/cases         (+ file upload)`);
    console.log(`  GET    /api/cases`);
    console.log(`  POST   /api/ai/chat`);
    console.log(`  GET    /api/ngo/cases`);
    console.log(`  GET    /api/ngo/reports`);
    console.log(`  GET    /api/admin/users`);
  });
};

start();