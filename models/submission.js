const mongoose = require("mongoose");

const SubmissionSchema = mongoose.Schema(
    {
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
            required: true
        },
        internId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        githubLink: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
        feedback: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Add index for faster queries
SubmissionSchema.index({ taskId: 1, internId: 1 }, { unique: true });

const SubmissionModel = mongoose.model("Submission", SubmissionSchema);

module.exports = SubmissionModel;   