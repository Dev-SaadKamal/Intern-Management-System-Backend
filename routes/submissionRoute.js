const express = require("express");
const router = express.Router();
const { submitTask, getMySubmissions, getAllSubmissions, reviewSubmission } = require('../controllers/submissionController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/roleMiddleware');

router.post("/", authMiddleware, submitTask);
router.get("/my/:internId", authMiddleware, getMySubmissions);
router.get("/", authMiddleware, adminMiddleware, getAllSubmissions);
router.put("/:submissionId", authMiddleware, adminMiddleware, reviewSubmission);

module.exports = router;