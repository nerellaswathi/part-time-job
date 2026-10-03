const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');

router.post('/match', authenticateToken, aiController.getJobMatch);
router.get('/recommendations', authenticateToken, aiController.getRecommendations);
router.post('/application-message', authenticateToken, aiController.generateApplicationMessage);
router.get('/profile-analysis', authenticateToken, aiController.getProfileAnalysis);

module.exports = router;
