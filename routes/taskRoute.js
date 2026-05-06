const express = require("express");
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/roleMiddleware');

router.post("/", authMiddleware, adminMiddleware, createTask);

router.get("/", authMiddleware, adminMiddleware, getTasks);

router.put("/:id", authMiddleware, adminMiddleware, updateTask);

router.delete("/:id", authMiddleware, adminMiddleware, deleteTask);

module.exports = router;