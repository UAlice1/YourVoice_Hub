const { pool } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const PRIORITY_MAP = {
  gbv: "urgent",
  abuse: "high",
  trauma: "high",
  mental_health: "medium",
  other: "low",
};

const Case = {
  // ── Create ───────────────────────────────────────────────────────────────────
  async create({ userId, type, description, isAnonymous = false }) {
    const uuid = uuidv4();
    const priority = PRIORITY_MAP[type] || "medium";
    const [result] = await pool.query(
      `INSERT INTO cases (uuid, user_id, type, description, priority, is_anonymous)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [uuid, userId, type, description, priority, isAnonymous ? 1 : 0]
    );
    return { id: result.insertId, uuid, priority };
  },

  // ── Find by UUID ─────────────────────────────────────────────────────────────
  async findByUuid(uuid) {
    const [rows] = await pool.query(
      `SELECT c.id, c.uuid, c.type, c.description, c.status, c.priority,
              c.is_anonymous, c.date_submitted, c.updated_at, c.user_id,
              CASE WHEN c.is_anonymous = 1 THEN 'Anonymous' ELSE u.name END AS submitted_by
       FROM cases c
       JOIN users u ON c.user_id = u.id
       WHERE c.uuid = ?`,
      [uuid]
    );
    return rows[0] || null;
  },

  // ── Find All Cases for a User ────────────────────────────────────────────────
  async findByUserId(userId, { status, type, limit = 10, offset = 0 } = {}) {
    let query =
      `SELECT uuid, type, description, status, priority, is_anonymous, date_submitted
       FROM cases WHERE user_id = ?`;
    const params = [userId];
    if (status) { query += " AND status = ?"; params.push(status); }
    if (type)   { query += " AND type = ?";   params.push(type); }
    query += " ORDER BY date_submitted DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);
    const [rows] = await pool.query(query, params);
    return rows;
  },

  // ── Find All Cases (NGO/Admin) ────────────────────────────────────────────────
  async findAll({ status, type, priority, limit = 10, offset = 0 } = {}) {
    let query =
      `SELECT c.uuid, c.type, c.description, c.status, c.priority,
              c.is_anonymous, c.date_submitted,
              CASE WHEN c.is_anonymous = 1 THEN 'Anonymous' ELSE u.name END AS submitted_by,
              (SELECT COUNT(*) FROM multimedia m WHERE m.case_id = c.id) AS file_count,
              (SELECT COUNT(*) FROM ngo_notifications n WHERE n.case_id = c.id) AS notification_count
       FROM cases c JOIN users u ON c.user_id = u.id WHERE 1=1`;
    const params = [];
    if (status)   { query += " AND c.status = ?";   params.push(status); }
    if (type)     { query += " AND c.type = ?";     params.push(type); }
    if (priority) { query += " AND c.priority = ?"; params.push(priority); }
    query += " ORDER BY c.date_submitted DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);
    const [rows] = await pool.query(query, params);
    return rows;
  },

  // ── Count ────────────────────────────────────────────────────────────────────
  async count({ userId } = {}) {
    let query = "SELECT COUNT(*) AS count FROM cases WHERE 1=1";
    const params = [];
    if (userId) { query += " AND user_id = ?"; params.push(userId); }
    const [[row]] = await pool.query(query, params);
    return row.count;
  },

  // ── Update Status ─────────────────────────────────────────────────────────────
  async updateStatus(uuid, status) {
    const [result] = await pool.query(
      "UPDATE cases SET status = ? WHERE uuid = ?",
      [status, uuid]
    );
    return result.affectedRows > 0;
  },

  // ── Delete ────────────────────────────────────────────────────────────────────
  async delete(uuid, userId = null) {
    let query = "DELETE FROM cases WHERE uuid = ?";
    const params = [uuid];
    if (userId) { query += " AND user_id = ?"; params.push(userId); }
    const [result] = await pool.query(query, params);
    return result.affectedRows > 0;
  },

  // ── Get Priority ─────────────────────────────────────────────────────────────
  getPriority(type) {
    return PRIORITY_MAP[type] || "medium";
  },
};

module.exports = Case;