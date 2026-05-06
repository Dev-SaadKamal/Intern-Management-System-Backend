const Assignment = require("../models/Assignment");
const Task = require("../models/task");
const User = require("../models/user");
const ResObj = require("../utils/helper").ResObj;

// ✅ 1️⃣ Assign Task to Multiple Interns (Admin)
const assignTask = async (req, res) => {
    try {
        const { taskId, internIds } = req.body;

        // check task exist
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json(ResObj(false, "Task not found"));
        }

        // check interns valid hain ya nahi
        const interns = await User.find({ _id: { $in: internIds }, role: "intern" });

        if (interns.length !== internIds.length) {
            return res.status(400).json(ResObj(false, "Some interns not found"));
        }

        // prepare assignments
        const assignments = internIds.map((internId) => ({
            taskId,
            internId
        }));

        // insert (duplicate prevent index already laga hua hai)
        await Assignment.insertMany(assignments, { ordered: false });

        res.status(201).json(
            ResObj(true, "Task assigned successfully")
        );

    } catch (error) {
        console.error(error);

        // duplicate error handle
        if (error.code === 11000) {
            return res.status(400).json(
                ResObj(false, "Some assignments already exist")
            );
        }

        res.status(500).json(
            ResObj(false, "Server error")
        );
    }
};

// ✅ 2️⃣ Get My Assignments (Intern)
const getMyAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({
            internId: req.params.id
        })
            .populate("taskId", "title description deadline field");

        res.status(200).json(
            ResObj(true, "Assignments fetched", assignments)
        );

    } catch (error) {
        console.error(error);
        res.status(500).json(
            ResObj(false, "Server error")
        );
    }
};

// ✅ 3️⃣ Get All Assignments (Admin)
const getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find()
            .populate("internId", "name email")
            .populate("taskId", "title deadline");

        res.status(200).json(
            ResObj(true, "All assignments fetched", assignments)
        );

    } catch (error) {
        console.error(error);
        res.status(500).json(
            ResObj(false, "Server error")
        );
    }
};

module.exports = {
    assignTask,
    getMyAssignments,
    getAllAssignments
};