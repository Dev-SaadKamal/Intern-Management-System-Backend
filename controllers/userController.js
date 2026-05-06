const mongoose = require('mongoose');
const UserModel = require('../models/user');
const ResObj = require('../utils/helper').ResObj;

const selectField = async (req, res) => {
    const { field } = req.body;
    const userId = req.user.id;
    try {
        const user = await UserModel.findByIdAndUpdate(userId, { field }, { new: true });
        if (!user) {
            return res.status(404).json(ResObj(false, 'User not found'));
        }
        res.status(200).json(ResObj(true, 'Field updated successfully', user));
    } catch (error) {
        console.error(error);
        res.status(500).json(ResObj(false, 'Server error'));
    }
}

const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await UserModel.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json(ResObj(false, 'User not found'));
        }
        res.status(200).json(ResObj(true, 'Profile retrieved successfully', user));
    } catch (error) {
        console.error(error);
        res.status(500).json(ResObj(false, 'Server error'));
    }
}

const getInterns = async (req, res) => {
    const { status } = req.query;

    let filter = { role: "intern" };

    if (status) {
        filter.status = status;
    }

    try {
        const interns = await UserModel.find(filter).select('-password');
        console.log('Found interns:', interns); // Add this for debugging
        res.json(ResObj(true, 'Interns retrieved successfully', interns));
    } catch (error) {
        console.error(error);
        res.status(500).json(ResObj(false, 'Server error'));
    }
};

const updateInternStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json(ResObj(false, 'Invalid status value'));
    }

    const intern = await UserModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!intern) {
        return res.status(404).json(ResObj(false, 'Intern not found'));
    }

    res.json(ResObj(true, 'Intern status updated successfully', intern));
};

module.exports = {
    selectField,
    getMyProfile,
    getInterns,
    updateInternStatus
}
