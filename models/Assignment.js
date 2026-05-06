const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
    {
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true
        },

        internId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

// Compound index to prevent duplicate assignments
assignmentSchema.index({ taskId: 1, internId: 1 }, { unique: true });

const AssignmentModel = mongoose.model("Assignment", assignmentSchema);

module.exports = AssignmentModel;