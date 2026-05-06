const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: { type: String },
        field: {
            type: String,
            required: true
        }, // frontend/backend
        deadline:
        {
            type: Date,
            required: true
        },
    }, { timestamps: true });

const TaskModel = mongoose.model('Task', TaskSchema);

module.exports = TaskModel;
