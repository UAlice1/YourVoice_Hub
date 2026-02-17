const User = require("../models/User");
const Case = require("../models/Case");
const Notification = require("../models/Notification");
const { success, fail, paginate } = require("../utils/response");

// ── @GET /api/admin/users ─────────────────────────────────────────────────────
const getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.findAll({ role, limit: parseInt(limit), offset });
    const total = await User.count({ role });

    res.json(paginate(users, { page: parseInt(page), limit: parseInt(limit), total }, "users"));
  } catch (error) {
    next(error);
  }
};

// ── @PUT /api/admin/users/:uuid/toggle ────────────────────────────────────────
const toggleUserStatus = async (req, res, next) => {
  try {
    const newStatus = await User.toggleActive(req.params.uuid);
    if (newStatus === null) return res.status(404).json(fail("User not found."));

    res.json(success({}, "User " + (newStatus ? "activated" : "deactivated") + "."));
  } catch (error) {
    next(error);
  }
};

// ── @PUT /api/admin/users/:uuid/role ─────────────────────────────────────────
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ["user", "ngo", "admin"];

    if (!validRoles.includes(role)) {
      return res.status(400).json(fail("Role must be one of: " + validRoles.join(", ")));
    }

    const updated = await User.updateRole(req.params.uuid, role);
    if (!updated) return res.status(404).json(fail("User not found."));

    res.json(success({}, "User role updated to '" + role + "'."));
  } catch (error) {
    next(error);
  }
};

// ── @DELETE /api/admin/users/:uuid ────────────────────────────────────────────
const deleteUser = async (req, res, next) => {
  try {
    const target = await User.findByUuid(req.params.uuid);
    if (!target) return res.status(404).json(fail("User not found."));

    if (target.id === req.user.id) {
      return res.status(400).json(fail("You cannot delete your own account."));
    }

    await User.delete(req.params.uuid);
    res.json(success({}, "User deleted."));
  } catch (error) {
    next(error);
  }
};

// ── @POST /api/admin/refer ────────────────────────────────────────────────────
const referCase = async (req, res, next) => {
  try {
    const { case_uuid, ngo_uuid } = req.body;

    if (!case_uuid || !ngo_uuid) {
      return res.status(400).json(fail("case_uuid and ngo_uuid are required."));
    }

    const caseData = await Case.findByUuid(case_uuid);
    if (!caseData) return res.status(404).json(fail("Case not found."));

    const ngo = await User.findByUuid(ngo_uuid);
    if (!ngo || ngo.role !== "ngo") return res.status(404).json(fail("NGO not found."));

    const alreadyReferred = await Notification.exists(caseData.id, ngo.id);
    if (alreadyReferred) {
      return res.status(409).json(fail("Case already referred to this NGO."));
    }

    await Notification.create({ caseId: caseData.id, ngoId: ngo.id });

    res.status(201).json(success({}, "Case referred to NGO successfully."));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, toggleUserStatus, updateUserRole, deleteUser, referCase };