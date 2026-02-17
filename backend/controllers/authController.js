const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");
const { success, fail } = require("../utils/response");

// ── @POST /api/auth/register ──────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(fail("Validation failed.", errors.array()));

    const { name, email, password, role = "user", phone, location } = req.body;

    if (await User.emailExists(email)) {
      return res.status(409).json(fail("Email is already registered."));
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const safeRole = ["user", "ngo"].includes(role) ? role : "user";
    const { id, uuid } = await User.create({ name, email, hashedPassword, role: safeRole, phone, location });

    const token = generateToken(id, safeRole);

    res.status(201).json(success({
      token,
      user: { uuid, name, email, role: safeRole },
    }, "Account created successfully."));
  } catch (error) {
    next(error);
  }
};

// ── @POST /api/auth/login ─────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(fail("Validation failed.", errors.array()));

    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json(fail("Invalid email or password."));
    if (!user.is_active) return res.status(403).json(fail("Your account has been deactivated."));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json(fail("Invalid email or password."));

    const token = generateToken(user.id, user.role);

    res.json(success({
      token,
      user: { uuid: user.uuid, name: user.name, email: user.email, role: user.role },
    }, "Login successful."));
  } catch (error) {
    next(error);
  }
};

// ── @GET /api/auth/me ─────────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json(fail("User not found."));
    res.json(success({ user }));
  } catch (error) {
    next(error);
  }
};

// ── @PUT /api/auth/me ─────────────────────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, location } = req.body;
    const user = await User.updateProfile(req.user.id, { name, phone, location });
    res.json(success({ user }, "Profile updated."));
  } catch (error) {
    next(error);
  }
};

// ── @PUT /api/auth/change-password ────────────────────────────────────────────
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json(fail("Both current and new passwords are required."));
    }
    if (newPassword.length < 6) {
      return res.status(400).json(fail("New password must be at least 6 characters."));
    }

    const hash = await User.getPasswordHash(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, hash);
    if (!isMatch) return res.status(401).json(fail("Current password is incorrect."));

    const salt = await bcrypt.genSalt(12);
    await User.updatePassword(req.user.id, await bcrypt.hash(newPassword, salt));

    res.json(success({}, "Password changed successfully."));
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword };