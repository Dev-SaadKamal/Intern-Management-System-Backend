const express = require("express");
const router = express.Router();
const { selectField, getMyProfile, getInterns, updateInternStatus } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/roleMiddleware');



router.put("/field", authMiddleware, selectField);
router.get("/me", authMiddleware, getMyProfile);

router.get("/interns", authMiddleware, adminMiddleware, getInterns);
router.put("/intern/:id/status", authMiddleware, adminMiddleware, updateInternStatus);

module.exports = router;
