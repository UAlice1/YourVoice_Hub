const { pool } = require("../config/db");
const Case = require("../models/Case");
const Multimedia = require("../models/Multimedia");

/* ─────────────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────────────── */

/** Safe int parsing with default. */
const toInt = (v, d) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : d;
};

/**
 * Normalize any incoming UI status to the DB-accepted statuses.
 * Allowed DB statuses: pending | reviewed | referred | closed
 * We treat "in-progress" as "referred" (adjust to "reviewed" if that fits your workflow better).
 */
const normalizeIncomingStatus = (sRaw) => {
  if (!sRaw) return null;
  const s = sRaw.toString().trim().toLowerCase().replace("_", "-");
  const map = {
    new: "pending",
    "in-progress": "referred", // change to 'reviewed' if desired
    resolved: "closed",

    // passthrough for DB values
    pending: "pending",
    reviewed: "reviewed",
    referred: "referred",
    closed: "closed",
  };
  return map[s] || s;
};

/** Build last N months in 'YYYY-MM', oldest → newest (length N). */
const lastNYearMonths = (n = 7) => {
  const out = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return out;
};

/** Compose reports payload (shared by JSON + CSV endpoints). */
async function buildReportsPayload() {
  // summary
  let total_cases = 0;
  try {
    const [[row]] = await pool.query("SELECT COUNT(*) AS total_cases FROM cases");
    total_cases = Number(row?.total_cases || 0);
  } catch (e) {
    console.error("[/ngo/reports] summary error:", e.message);
  }

  // by status
  let cases_by_status = [];
  try {
    const [rows] = await pool.query(
      "SELECT status, COUNT(*) AS count FROM cases GROUP BY status"
    );
    cases_by_status = rows.map((r) => ({
      status: r.status,
      count: Number(r.count || 0),
    }));
  } catch (e) {
    console.error("[/ngo/reports] by_status error:", e.message);
  }

  // by type
  let cases_by_type = [];
  try {
    const [rows] = await pool.query(
      "SELECT type, COUNT(*) AS count FROM cases GROUP BY type"
    );
    cases_by_type = rows.map((r) => ({
      type: r.type,
      count: Number(r.count || 0),
    }));
  } catch (e) {
    console.error("[/ngo/reports] by_type error:", e.message);
  }

  // monthly trend (last 7 months)
  let monthly_cases = [];
  try {
    const months = lastNYearMonths(7);
    // NOTE: If your timestamp column isn’t `date_submitted`, change both lines below to your column (e.g., created_at)
    const [trendRows] = await pool.query(
      `
        SELECT DATE_FORMAT(date_submitted, '%Y-%m') AS ym, COUNT(*) AS count
        FROM cases
        WHERE date_submitted >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY ym
        ORDER BY ym ASC
      `
    );
    const map = new Map(trendRows.map((r) => [r.ym, Number(r.count || 0)]));
    monthly_cases = months.map((m) => ({ month: m, count: map.get(m) ?? 0 }));
  } catch (e) {
    console.error("[/ngo/reports] monthly error:", e.message);
    monthly_cases = lastNYearMonths(7).map((m) => ({ month: m, count: 0 }));
  }

  return {
    summary: { total_cases },
    cases_by_status,
    cases_by_type,
    monthly_cases,
    updated_at: new Date().toISOString(),
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
 * GET /api/ngo/cases
 * List cases visible to NGO with optional filters/pagination.
 * Returns: ARRAY directly.
 * Query: status, type, priority, limit, offset, page
 * ──────────────────────────────────────────────────────────────────────────── */
async function getCases(req, res, next) {
  try {
    let { status, type, priority, limit = 10, offset, page } = req.query;

    limit = toInt(limit, 10);
    offset =
      offset !== undefined ? toInt(offset, 0) : (toInt(page, 1) - 1) * limit;

    if (typeof status === "string")
      status = status.replace("_", "-").toLowerCase();
    const statusForQuery = normalizeIncomingStatus(status) || status;

    // If you need NGO scoping, add filter in your Case.findAll implementation.
    const rows = await Case.findAll({
      status: statusForQuery,
      type,
      priority,
      limit,
      offset,
    });

    res.json(rows);
  } catch (err) {
    next(err);
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
 * GET /api/ngo/reports
 * JSON response for Analytics & Reports page.
 * ──────────────────────────────────────────────────────────────────────────── */
async function getReports(req, res, next) {
  try {
    const payload = await buildReportsPayload();

    // Quick debug
    console.log(
      "[/api/ngo/reports] -> total:",
      payload.summary.total_cases,
      "| status:",
      payload.cases_by_status.length,
      "| type:",
      payload.cases_by_type.length,
      "| monthly:",
      payload.monthly_cases.length
    );

    res.json(payload);
  } catch (err) {
    next(err);
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
 * GET /api/ngo/reports/csv
 * CSV export for Analytics & Reports page (section,label,value).
 * Query (optional): none (you can extend with date filters later)
 * ──────────────────────────────────────────────────────────────────────────── */
async function exportReportsCsv(req, res, next) {
  try {
    const { summary, cases_by_status, cases_by_type, monthly_cases, updated_at } =
      await buildReportsPayload();

    // Compose CSV rows
    const rows = [];
    rows.push(["section", "label", "value"]);
    rows.push(["summary", "total_cases", summary.total_cases]);

    // status
    for (const s of cases_by_status) {
      rows.push(["status", s.status ?? "", s.count ?? 0]);
    }

    // type
    for (const t of cases_by_type) {
      rows.push(["type", t.type ?? "", t.count ?? 0]);
    }

    // monthly
    for (const m of monthly_cases) {
      rows.push(["monthly", m.month ?? "", m.count ?? 0]);
    }

    // Convert to CSV text
    const csv = rows
      .map((r) =>
        r
          .map((cell) => {
            const v =
              cell === null || cell === undefined ? "" : String(cell);
            // Escape double quotes
            const esc = v.replace(/"/g, '""');
            // Quote if it contains comma, quote or newline
            return /[",\n]/.test(esc) ? `"${esc}"` : esc;
          })
          .join(",")
      )
      .join("\n");

    const filename = `ngo-reports-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
 * GET /api/ngo/dashboard
 * Lightweight stats for cards.
 * ──────────────────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────────────────
 * GET /api/ngo/cases/:id    (id is UUID)
 * Adds file_url if PUBLIC_ORIGIN is set (e.g., http://localhost:5000)
 * ──────────────────────────────────────────────────────────────────────────── */
async function getCaseById(req, res, next) {
  try {
    const uuid = req.params.id;
    const row = await Case.findByUuid(uuid);
    if (!row)
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });

    const files = await Multimedia.findByCaseId(row.id);
    const { id, user_id, ...safe } = row;

    const publicOrigin = process.env.PUBLIC_ORIGIN || "";
    const filesWithUrl = (files || []).map((f) => {
      const webPath = String(f.file_path || "").replace(/\\/g, "/"); // normalize win paths
      const rel = webPath.startsWith("/") ? webPath : `/${webPath}`;
      return { ...f, file_url: publicOrigin ? `${publicOrigin}${rel}` : rel };
    });

    res.json({ ...safe, files: filesWithUrl });
  } catch (err) {
    next(err);
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
 * PUT /api/ngo/cases/:id    (id is UUID)
 * Body: { status: 'pending|reviewed|referred|closed' }  // UI values normalized
 * ──────────────────────────────────────────────────────────────────────────── */
async function updateCaseStatus(req, res, next) {
  try {
    const uuid = req.params.id;
    const { status } = req.body;

    if (!status)
      return res
        .status(400)
        .json({ success: false, message: "status is required" });

    const dbStatus = normalizeIncomingStatus(status);
    const valid = new Set(["pending", "reviewed", "referred", "closed"]);
    if (!valid.has(dbStatus)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed: pending, reviewed, referred, closed",
      });
    }

    const ok = await Case.updateStatus(uuid, dbStatus);
    if (!ok)
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });

    res.json({
      success: true,
      message: `Case ${uuid} updated to ${dbStatus}`,
    });
  } catch (err) {
    next(err);
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Exports
 * ──────────────────────────────────────────────────────────────────────────── */
module.exports = {
  getCases,
  getReports,
  exportReportsCsv, // ← NEW
  getDashboardStats,
  getCaseById,
  updateCaseStatus,
};