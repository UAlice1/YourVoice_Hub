const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { getAllUsers, toggleUserStatus, updateUserRole, deleteUser, referCase } = require("../controllers/adminController");

router.use(protect);
router.use(authorize("admin"));

router.get("/users", getAllUsers);
router.put("/users/:uuid/toggle", toggleUserStatus);
router.put("/users/:uuid/role", updateUserRole);
router.delete("/users/:uuid", deleteUser);
router.post("/refer", referCase);

module.exports = router;