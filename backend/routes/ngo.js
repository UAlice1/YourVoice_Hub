// routes/ngo.js
const express = require('express');
const router = express.Router();

// Import the actual functions from the controller
// Make sure this path is correct!
const {
  getCases,
  getReports,
  exportReportsCsv,
  getDashboardStats,
  updateCaseStatus,
  getCaseById,  

  // add more functions here when you implement them
} = require('../controllers/ngoController');

// ── NGO Routes ────────────────────────────────────────────────────────────────

// List cases assigned to / visible for this NGO
router.get('/cases', getCases);

// Get reports / analytics summary
router.get('/reports', getReports);
router.get('/reports/csv', exportReportsCsv);

// Quick dashboard overview stats
router.get('/dashboard', getDashboardStats);

// Update case status (accepted, in-progress, resolved, etc.)
router.put('/cases/:id', updateCaseStatus);
router.get('/cases/:id', getCaseById);

// ── Future / commented routes (uncomment when ready) ─────────────────────────
// router.get('/notifications', getNotifications);
// router.post('/cases/:id/assign', assignCase);
// router.get('/cases/:id', getCaseById);

module.exports = router;