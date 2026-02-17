const Case = require("../models/Case");
const Notification = require("../models/Notification");
const NgoOrganization = require("../models/NgoOrganization");
const Reports = require("../utils/reports");
const { success, fail, paginate } = require("../utils/response");

// ── @GET /api/ngo/cases ───────────────────────────────────────────────────────
const getAllCases = async (req, res, next) => {
  try {
    const { status, type, priority, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const cases = await Case.findAll({ status, type, priority, limit: parseInt(limit), offset });
    const total = await Case.count();

    res.json(paginate(cases, { page: parseInt(page), limit: parseInt(limit), total }, "cases"));
  } catch (error) {
    next(error);
  }
};

// ── @GET /api/ngo/notifications ───────────────────────────────────────────────
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findByNgoId(req.user.id);
    res.json(success({ notifications }));
  } catch (error) {
    next(error);
  }
};

// ── @PUT /api/ngo/notifications/:id ──────────────────────────────────────────
const updateNotification = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ["acknowledged", "in_progress", "resolved"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json(fail("Status must be one of: " + validStatuses.join(", ")));
    }

    const updated = await Notification.updateStatus(req.params.id, req.user.id, { status, notes });
    if (!updated) return res.status(404).json(fail("Notification not found."));

    res.json(success({}, "Notification updated."));
  } catch (error) {
    next(error);
  }
};

// ── @GET /api/ngo/reports ─────────────────────────────────────────────────────
const getReports = async (req, res, next) => {
  try {
    const reports = await Reports.getFullReport();
    res.json(success({ reports }));
  } catch (error) {
    next(error);
  }
};

// ── @GET /api/ngo/profile ─────────────────────────────────────────────────────
const getNgoProfile = async (req, res, next) => {
  try {
    const profile = await NgoOrganization.findByUserId(req.user.id);
    res.json(success({ profile }));
  } catch (error) {
    next(error);
  }
};

// ── @PUT /api/ngo/profile ─────────────────────────────────────────────────────
const updateNgoProfile = async (req, res, next) => {
  try {
    const { org_name, description, contact_email, contact_phone, location } = req.body;
    const profile = await NgoOrganization.upsert(req.user.id, {
      orgName: org_name,
      description,
      contactEmail: contact_email,
      contactPhone: contact_phone,
      location,
    });
    res.json(success({ profile }, "NGO profile updated."));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCases, getNotifications, updateNotification, getReports, getNgoProfile, updateNgoProfile };