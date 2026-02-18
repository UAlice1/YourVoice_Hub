const { pool } = require("../config/db");

/**
 * All analytics queries used by the NGO/Admin reporting dashboard.
 */

const Reports = {
  async getSummary() {
    const [[cases]]   = await pool.query("SELECT COUNT(*) AS count FROM cases");
    const [[users]]   = await pool.query("SELECT COUNT(*) AS count FROM users WHERE role = 'user'");
    const [[sessions]]= await pool.query("SELECT COUNT(DISTINCT session_id) AS count FROM ai_guidance_logs");
    const [[recent]]  = await pool.query(
      "SELECT COUNT(*) AS count FROM cases WHERE date_submitted >= DATE_SUB(NOW(), INTERVAL 7 DAY)"
    );
    return {
      total_cases:        cases.count,
      total_users:        users.count,
      total_ai_sessions:  sessions.count,
      cases_last_7_days:  recent.count,
    };
  },

  async getByType() {
    const [rows] = await pool.query(
      "SELECT type, COUNT(*) AS count FROM cases GROUP BY type ORDER BY count DESC"
    );
    return rows;
  },

  async getByStatus() {
    const [rows] = await pool.query(
      "SELECT status, COUNT(*) AS count FROM cases GROUP BY status"
    );
    return rows;
  },

  async getByPriority() {
    const [rows] = await pool.query(
      `SELECT priority, COUNT(*) AS count FROM cases
       GROUP BY priority
       ORDER BY FIELD(priority, 'urgent', 'high', 'medium', 'low')`
    );
    return rows;
  },

  async getMonthlyTrend(months = 6) {
    const [rows] = await pool.query(
      `SELECT DATE_FORMAT(date_submitted, '%Y-%m') AS month, COUNT(*) AS count
       FROM cases
       WHERE date_submitted >= DATE_SUB(NOW(), INTERVAL ? MONTH)
       GROUP BY month
       ORDER BY month ASC`,
      [months]
    );
    return rows;
  },

  async getFullReport() {
    const [summary, byType, byStatus, byPriority, monthlyTrend] = await Promise.all([
      Reports.getSummary(),
      Reports.getByType(),
      Reports.getByStatus(),
      Reports.getByPriority(),
      Reports.getMonthlyTrend(),
    ]);
    return { summary, cases_by_type: byType, cases_by_status: byStatus, cases_by_priority: byPriority, monthly_trend: monthlyTrend };
  },
};

module.exports = Reports;