const express = require('express');
const router = express.Router();
const legalController = require('../controllers/legalController');
const uploadHandler = require('../middlewares/uploadHandler');

// POST /api/v1/legal/analyze - Analyze legal question with optional file upload
router.post('/analyze', uploadHandler.single('file'), legalController.analyzeLegalQuery);

// GET /api/v1/legal/examples - Get example legal questions
router.get('/examples', legalController.getExamples);

module.exports = router;