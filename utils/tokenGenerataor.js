const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    };
    return jwt.sign(payload, process.env.SECRETKEY, { expiresIn: '1h' });
}

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.SECRETKEY);
    } catch (error) {
        return null;
    }
}

module.exports = { generateToken, verifyToken };