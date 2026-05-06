const mongoose = require('mongoose');
const Task = require('../models/task');
const ResObj = require('../utils/helper').ResObj;


// ✅ CREATE TASK (Admin)
const createTask = async (req, res) => {
    const { title, description, field, deadline } = req.body;

    try {
        const task = new Task({
            title,
            description,
            field,
            deadline
        });

        await task.save();

        res.status(201).json(
            ResObj(true, 'Task created successfully', task)
        );

    } catch (error) {
        console.error(error);
        res.status(500).json(
            ResObj(false, 'Server error')
        );
    }
};


// ✅ GET ALL TASKS (Admin)
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();

        res.status(200).json(
            ResObj(true, 'Tasks retrieved successfully', tasks)
        );

    } catch (error) {
        console.error(error);
        res.status(500).json(
            ResObj(false, 'Server error')
        );
    }
};


// ✅ UPDATE TASK (Admin)
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, field, deadline } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(
            id,
            {
                title,
                description,
                field,
                deadline
            },
            { new: true }
        );

        if (!task) {
            return res.status(404).json(
                ResObj(false, 'Task not found')
            );
        }

        res.status(200).json(
            ResObj(true, 'Task updated successfully', task)
        );

    } catch (error) {
        console.error(error);
        res.status(500).json(
            ResObj(false, 'Server error')
        );
    }
};


// ✅ DELETE TASK (Admin)
const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json(
                ResObj(false, 'Task not found')
            );
        }

        res.status(200).json(
            ResObj(true, 'Task deleted successfully')
        );

    } catch (error) {
        console.error(error);
        res.status(500).json(
            ResObj(false, 'Server error')
        );
    }
};


module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};