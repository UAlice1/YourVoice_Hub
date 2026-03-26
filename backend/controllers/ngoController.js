const { pool } = require("../config/db");
const Case = require("../models/Case");
const Multimedia = require("../models/Multimedia");

// Helpers
const toInt = (v, d) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : d;
};
// helpers somewhere in ngoController.js
const normalizeIncomingStatus = (sRaw) => {
  if (!sRaw) return null;
  const s = sRaw.toString().toLowerCase().replace('_', '-');
  const map = {
    'new': 'pending',
    'in-progress': 'reviewed', // or 'referred' if you prefer
    'resolved': 'closed',
    'pending': 'pending',
    'reviewed': 'reviewed',
    'referred': 'referred',
    'closed': 'closed',
  };
  return map[s] || s;
};

exports.updateCaseStatus = async (req, res, next) => {
  try {
    const uuid = req.params.id;            // uuid in URL
    const { status: statusUI } = req.body; // status from UI
    if (!statusUI) {
      return res.status(400).json({ success: false, message: 'status is required' });
    }

    const status = normalizeIncomingStatus(statusUI);

    // Only allow DB statuses:
    const valid = new Set(['pending', 'reviewed', 'referred', 'closed']);
    if (!valid.has(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed: pending, reviewed, referred, closed",
      });
    }

    const ok = await Case.updateStatus(uuid, status);
    if (!ok) return res.status(404).json({ success: false, message: 'Case not found' });

    res.json({ success: true, message: `Case ${uuid} updated to ${status}` });
  } catch (err) {
    next(err);
  }
};
// GET /api/ngo/cases
async function getCases(req, res, next) {
  try {
    let { status, type, priority, limit = 10, offset, page } = req.query;

    limit  = toInt(limit, 10);
    offset = offset !== undefined ? toInt(offset, 0) : (toInt(page, 1) - 1) * limit;

    if (typeof status === "string") status = status.replace("_", "-").toLowerCase();
    const statusForQuery = normalizeIncomingStatus(status) || status;

    const rows = await Case.findAll({
      status: statusForQuery,
      type,
      priority,
      limit,
      offset,
    });

    res.json(rows); // return ARRAY directly
  } catch (err) {
    next(err);
  }
}

// GET /api/ngo/reports
async function getReports(req, res, next) {
  try {
    const [[{ total_cases }]] = await pool.query(
      "SELECT COUNT(*) AS total_cases FROM cases"
    );
    const [byStatus] = await pool.query(
      "SELECT status, COUNT(*) AS count FROM cases GROUP BY status"
    );
    res.json({
      summary: { total_cases },
      cases_by_status: byStatus,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/ngo/dashboard
async function getDashboardStats(req, res, next) {
  try {
    const [[{ total_cases }]] = await pool.query(
      "SELECT COUNT(*) AS total_cases FROM cases"
    );
    const [[{ count: pending }]] = await pool.query(
      "SELECT COUNT(*) AS count FROM cases WHERE status = 'pending'"
    );
    const [[{ count: closed }]] = await pool.query(
      "SELECT COUNT(*) AS count FROM cases WHERE status = 'closed'"
    );
    res.json({
      totalCases: total_cases,
      pending,
      closed,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/ngo/cases/:id (uuid)
async function getCaseById(req, res, next) {
  try {
    const uuid = req.params.id;
    const row = await Case.findByUuid(uuid);
    if (!row) return res.status(404).json({ success: false, message: "Case not found" });

    const files = await Multimedia.findByCaseId(row.id);
    const { id, user_id, ...safe } = row;

    res.json({ ...safe, files: files || [] });
  } catch (err) {
    next(err);
  }
}


// PUT /api/ngo/cases/:id
async function updateCaseStatus(req, res, next) {
  try {
    const uuid = req.params.id;
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: "status is required" });

    const dbStatus = normalizeIncomingStatus(status);
    const valid = new Set(["pending", "reviewed", "referred", "closed"]);
    if (!valid.has(dbStatus)) {
      return res.status(400).json({ success: false, message: "Invalid status. Allowed: pending, reviewed, referred, closed" });
    }

    const ok = await Case.updateStatus(uuid, dbStatus);
    if (!ok) return res.status(404).json({ success: false, message: "Case not found" });

    res.json({ success: true, message: `Case ${uuid} updated to ${dbStatus}` });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCases,
  getReports,
  getDashboardStats,
  getCaseById,
  updateCaseStatus,
};