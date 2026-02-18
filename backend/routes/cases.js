const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  submitCase,
  getUserCases,
  getCaseById,
  updateCaseStatus,
  deleteCase,
} = require("../controllers/caseController");

// All routes require authentication
router.use(protect);

// User routes
router.post("/", upload.array("files", 5), submitCase);
router.get("/", getUserCases);
router.get("/:uuid", getCaseById);
router.delete("/:uuid", deleteCase);

// NGO / Admin routes
router.put("/:uuid/status", authorize("ngo", "admin"), updateCaseStatus);

module.exports = router;