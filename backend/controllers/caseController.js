const { pool } = require("../config/db");
const Case = require("../models/Case");
const Multimedia = require("../models/Multimedia");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { success, fail, paginate } = require("../utils/response");

// ── @POST /api/cases ──────────────────────────────────────────────────────────
const submitCase = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const { type, description, is_anonymous = false } = req.body;

    if (!type || !description) {
      return res.status(400).json(fail("Type and description are required."));
    }

    const validTypes = ["mental_health", "abuse", "gbv", "trauma", "other"];
    if (!validTypes.includes(type)) {
      return res.status(400).json(fail("Type must be one of: " + validTypes.join(", ")));
    }

    await conn.beginTransaction();

    const { id: caseId, uuid: caseUuid, priority } = await Case.create({
      userId: req.user.id,
      type,
      description,
      isAnonymous: is_anonymous,
    });

    const savedFiles = req.files?.length
      ? await Multimedia.bulkCreate(caseId, req.files)
      : [];

    if (["urgent", "high"].includes(priority)) {
      const ngos = await User.findActiveNgos(3);
      await Notification.bulkCreate(caseId, ngos.map((n) => n.id));
    }

    await conn.commit();

    res.status(201).json(success({
      case: { uuid: caseUuid, type, priority, status: "pending", files: savedFiles },
    }, "Case submitted successfully."));
  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    conn.release();
  }
};

// ── @GET /api/cases ───────────────────────────────────────────────────────────
const getUserCases = async (req, res, next) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const cases = await Case.findByUserId(req.user.id, { status, type, limit: parseInt(limit), offset });

    for (const c of cases) {
      const [row] = await pool.query("SELECT id FROM cases WHERE uuid = ? AND user_id = ?", [c.uuid, req.user.id]);
      if (row.length) c.file_count = await Multimedia.countByCaseId(row[0].id);
    }

    const total = await Case.count({ userId: req.user.id });
    res.json(paginate(cases, { page: parseInt(page), limit: parseInt(limit), total }, "cases"));
  } catch (error) {
    next(error);
  }
};

// ── @GET /api/cases/:uuid ─────────────────────────────────────────────────────
const getCaseById = async (req, res, next) => {
  try {
    const caseData = await Case.findByUuid(req.params.uuid);
    if (!caseData) return res.status(404).json(fail("Case not found."));

    if (req.user.role === "user" && caseData.user_id !== req.user.id) {
      return res.status(403).json(fail("Access denied."));
    }

    const files = await Multimedia.findByCaseId(caseData.id);
    const { id, user_id, ...safeCase } = caseData;

    res.json(success({ case: { ...safeCase, files } }));
  } catch (error) {
    next(error);
  }
};

// ── @PUT /api/cases/:uuid/status ──────────────────────────────────────────────
const updateCaseStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "reviewed", "referred", "closed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json(fail("Status must be one of: " + validStatuses.join(", ")));
    }

    const updated = await Case.updateStatus(req.params.uuid, status);
    if (!updated) return res.status(404).json(fail("Case not found."));

    res.json(success({}, "Case status updated to '" + status + "'."));
  } catch (error) {
    next(error);
  }
};

// ── @DELETE /api/cases/:uuid ──────────────────────────────────────────────────
const deleteCase = async (req, res, next) => {
  try {
    const userId = req.user.role === "user" ? req.user.id : null;
    const deleted = await Case.delete(req.params.uuid, userId);

    if (!deleted) return res.status(404).json(fail("Case not found or access denied."));
    res.json(success({}, "Case deleted."));
  } catch (error) {
    next(error);
  }
};

module.exports = { submitCase, getUserCases, getCaseById, updateCaseStatus, deleteCase };