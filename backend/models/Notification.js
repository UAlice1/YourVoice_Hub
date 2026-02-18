const { pool } = require("../config/db");

const Notification = {
  // ── Create one notification ───────────────────────────────────────────────────
  async create({ caseId, ngoId }) {
    const [result] = await pool.query(
      `INSERT INTO ngo_notifications (case_id, ngo_id, status) VALUES (?, ?, 'sent')`,
      [caseId, ngoId]
    );
    return result.insertId;
  },

  // ── Bulk create (auto-referral to multiple NGOs) ──────────────────────────────
  async bulkCreate(caseId, ngoIds) {
    const ids = [];
    for (const ngoId of ngoIds) {
      const id = await Notification.create({ caseId, ngoId });
      ids.push(id);
    }
    return ids;
  },

  // ── Check if already notified ────────────────────────────────────────────────
  async exists(caseId, ngoId) {
    const [rows] = await pool.query(
      "SELECT id FROM ngo_notifications WHERE case_id = ? AND ngo_id = ?",
      [caseId, ngoId]
    );
    return rows.length > 0;
  },

  // ── Get all notifications for an NGO ──────────────────────────────────────────
  async findByNgoId(ngoId) {
    const [rows] = await pool.query(
      `SELECT n.id, n.status, n.notes, n.date_notified,
              c.uuid AS case_uuid, c.type, c.priority, c.description
       FROM ngo_notifications n
       JOIN cases c ON n.case_id = c.id
       WHERE n.ngo_id = ?
       ORDER BY n.date_notified DESC`,
      [ngoId]
    );
    return rows;
  },

  // ── Find by ID ───────────────────────────────────────────────────────────────
  async findById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM ngo_notifications WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  // ── Update status + notes ────────────────────────────────────────────────────
  async updateStatus(id, ngoId, { status, notes }) {
    const [result] = await pool.query(
      `UPDATE ngo_notifications SET status = ?, notes = ? WHERE id = ? AND ngo_id = ?`,
      [status, notes || null, id, ngoId]
    );
    return result.affectedRows > 0;
  },

  // ── Count notifications for a case ───────────────────────────────────────────
  async countByCaseId(caseId) {
    const [[row]] = await pool.query(
      "SELECT COUNT(*) AS count FROM ngo_notifications WHERE case_id = ?",
      [caseId]
    );
    return row.count;
  },
};

module.exports = Notification;