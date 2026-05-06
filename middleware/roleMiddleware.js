const authMiddleware = require('./authMiddleware');

const isAdmin = (req, res, next) => {
    // First verify the token exists and is valid
    if (!req.user) {
        // If user not set by authMiddleware, we need to check token
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token, authorization denied' });
        }
    }

    if (req.user && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied, admin only' });
    }

    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    next();
}

module.exports = isAdmin;