const { pool } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const User = {
  // ── Create ───────────────────────────────────────────────────────────────────
  async create({ name, email, hashedPassword, role = "user", phone = null, location = null }) {
    const uuid = uuidv4();
    const [result] = await pool.query(
      `INSERT INTO users (uuid, name, email, password, role, phone, location)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [uuid, name, email, hashedPassword, role, phone, location]
    );
    return { id: result.insertId, uuid };
  },

  // ── Find by ID ───────────────────────────────────────────────────────────────
  async findById(id) {
    const [rows] = await pool.query(
      "SELECT id, uuid, name, email, role, phone, location, is_active, created_at FROM users WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  // ── Find by UUID ─────────────────────────────────────────────────────────────
  async findByUuid(uuid) {
    const [rows] = await pool.query(
      "SELECT id, uuid, name, email, role, phone, location, is_active, created_at FROM users WHERE uuid = ?",
      [uuid]
    );
    return rows[0] || null;
  },

  // ── Find by Email (includes password for auth) ────────────────────────────────
  async findByEmail(email) {
    const [rows] = await pool.query(
      "SELECT id, uuid, name, email, password, role, is_active FROM users WHERE email = ?",
      [email]
    );
    return rows[0] || null;
  },

  // ── Find All (with optional role filter + pagination) ─────────────────────────
  async findAll({ role, limit = 20, offset = 0 } = {}) {
    let query =
      "SELECT id, uuid, name, email, role, phone, location, is_active, created_at FROM users WHERE 1=1";
    const params = [];
    if (role) { query += " AND role = ?"; params.push(role); }
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);
    const [rows] = await pool.query(query, params);
    return rows;
  },

  // ── Count ────────────────────────────────────────────────────────────────────
  async count({ role } = {}) {
    let query = "SELECT COUNT(*) AS count FROM users WHERE 1=1";
    const params = [];
    if (role) { query += " AND role = ?"; params.push(role); }
    const [[row]] = await pool.query(query, params);
    return row.count;
  },

  // ── Update Profile ────────────────────────────────────────────────────────────
  async updateProfile(id, { name, phone, location }) {
    await pool.query(
      `UPDATE users
       SET name     = COALESCE(?, name),
           phone    = COALESCE(?, phone),
           location = COALESCE(?, location)
       WHERE id = ?`,
      [name || null, phone || null, location || null, id]
    );
    return this.findById(id);
  },

  // ── Update Password ───────────────────────────────────────────────────────────
  async updatePassword(id, hashedPassword) {
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, id]);
  },

  // ── Get Raw Password Hash ─────────────────────────────────────────────────────
  async getPasswordHash(id) {
    const [rows] = await pool.query("SELECT password FROM users WHERE id = ?", [id]);
    return rows[0]?.password || null;
  },

  // ── Toggle Active ─────────────────────────────────────────────────────────────
  async toggleActive(uuid) {
    const [rows] = await pool.query("SELECT is_active FROM users WHERE uuid = ?", [uuid]);
    if (!rows.length) return null;
    const newStatus = !rows[0].is_active;
    await pool.query("UPDATE users SET is_active = ? WHERE uuid = ?", [newStatus, uuid]);
    return newStatus;
  },

  // ── Update Role ───────────────────────────────────────────────────────────────
  async updateRole(uuid, role) {
    const [result] = await pool.query("UPDATE users SET role = ? WHERE uuid = ?", [role, uuid]);
    return result.affectedRows > 0;
  },

  // ── Delete ────────────────────────────────────────────────────────────────────
  async delete(uuid) {
    const [result] = await pool.query("DELETE FROM users WHERE uuid = ?", [uuid]);
    return result.affectedRows > 0;
  },

  // ── Email Exists ──────────────────────────────────────────────────────────────
  async emailExists(email) {
    const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    return rows.length > 0;
  },

  // ── Find NGOs (for auto-referral) ─────────────────────────────────────────────
  async findActiveNgos(limit = 3) {
    const [rows] = await pool.query(
      "SELECT id FROM users WHERE role = 'ngo' AND is_active = 1 LIMIT ?",
      [limit]
    );
    return rows;
  },
};

module.exports = User;