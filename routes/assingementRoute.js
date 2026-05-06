const express = require("express");
const router = express.Router();

const { assignTask, getMyAssignments, getAllAssignments } = require("../controllers/assingmentController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/roleMiddleware");

// ADMIN → Assign task to multiple interns
router.post("/assign", authMiddleware, adminMiddleware, assignTask);

// ADMIN → Get all assignments
router.get("/", authMiddleware, adminMiddleware, getAllAssignments);

// INTERN → Get my assignments
router.get("/my/:id", authMiddleware, getMyAssignments);

module.exports = router;