const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jobController = require('../controllers/jobController');
const { getModel } = require('../services/db');

// Optional auth middleware so public visitors can browse,
// but logged-in students automatically receive personalized AI scoring
async function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next();

  try {
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_job_platform_2026_dev';
    jwt.verify(token, secret, async (err, decoded) => {
      if (!err && decoded) {
        const User = getModel('User');
        const user = await User.findById(decoded.id);
        if (user) req.user = user;
      }
      next();
    });
  } catch (e) {
    next();
  }
}

router.get('/', optionalAuth, jobController.getJobs);
router.get('/:id', optionalAuth, jobController.getJobById);

module.exports = router;
