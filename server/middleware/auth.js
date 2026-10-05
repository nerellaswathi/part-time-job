const jwt = require('jsonwebtoken');
const { getModel } = require('../services/db');

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. Please login.' });
    }

    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_job_platform_2026_dev';

    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Session expired or invalid token. Please log in again.' });
      }

      const User = getModel('User');
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User account not found.' });
      }

      req.user = user.toObject();
      next();
    });
  } catch (error) {
    console.error('[Auth Middleware Error]:', error);
    res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
}

module.exports = { authenticateToken };
