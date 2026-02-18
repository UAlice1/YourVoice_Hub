const { pool } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const AiLog = {
  // ── Create a log entry ────────────────────────────────────────────────────────
  async create({ userId, sessionId, sessionText, responseText }) {
    const [result] = await pool.query(
      `INSERT INTO ai_guidance_logs (user_id, session_id, session_text, response_text)
       VALUES (?, ?, ?, ?)`,
      [userId, sessionId, sessionText, responseText]
    );
    return result.insertId;
  },

  // ── Get all log entries for a user (paginated) ────────────────────────────────
  async findByUserId(userId, { limit = 20, offset = 0 } = {}) {
    const [rows] = await pool.query(
      `SELECT session_id, session_text, response_text, timestamp
       FROM ai_guidance_logs
       WHERE user_id = ?
       ORDER BY timestamp DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return rows;
  },

  // ── Get all messages within a session ─────────────────────────────────────────
  async findBySession(userId, sessionId) {
    const [rows] = await pool.query(
      `SELECT session_text, response_text, timestamp
       FROM ai_guidance_logs
       WHERE user_id = ? AND session_id = ?
       ORDER BY timestamp ASC`,
      [userId, sessionId]
    );
    return rows;
  },

  // ── Count total log entries for a user ────────────────────────────────────────
  async countByUserId(userId) {
    const [[row]] = await pool.query(
      "SELECT COUNT(*) AS count FROM ai_guidance_logs WHERE user_id = ?",
      [userId]
    );
    return row.count;
  },

  // ── Count distinct sessions globally (for reports) ────────────────────────────
  async countDistinctSessions() {
    const [[row]] = await pool.query(
      "SELECT COUNT(DISTINCT session_id) AS count FROM ai_guidance_logs"
    );
    return row.count;
  },

  // ── Generate a new session ID ─────────────────────────────────────────────────
  newSessionId() {
    return uuidv4();
  },
};

module.exports = AiLog;