const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const generateToken = require('../utils/tokenGenerataor').generateToken;
const ResObj = require('../utils/helper').ResObj;

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json(ResObj(false, 'User already exists'));
        }
        // Create new user
        user = new User({
            name,
            email,
            password,
            role
        });
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        // Generate token
        const token = generateToken(user);
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: "lax"
        });
        res.status(201).json(ResObj(true, 'User registered successfully', { token }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ResObj(false, 'Server error'));
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json(ResObj(false, 'Invalid credentials'));
        }
        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json(ResObj(false, 'Invalid credentials'));
        }
        // Generate token
        const token = generateToken(user);
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: "lax"
        });
        res.status(200).json(ResObj(true, 'User logged in successfully', { User: { id: user._id, name: user.name, email: user.email, role: user.role }, token }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ResObj(false, 'Server error'));
    }
}

const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.status(200).json(ResObj(true, 'User logged out successfully'));
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
}