const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, applicationController.applyForJob);
router.get('/', authenticateToken, applicationController.getMyApplications);
router.get('/:id', authenticateToken, applicationController.getApplicationById);
router.patch('/:id/status', authenticateToken, applicationController.simulateStatusAdvance);

module.exports = router;
