// server/routes/resumeRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadResume, matchJobs } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware'); // NEW: Import the middleware

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// NEW: Add 'protect' as the second argument to lock down these routes
router.post('/upload', protect, upload.single('resume'), uploadResume);
router.post('/:id/match-jobs', protect, matchJobs);

module.exports = router;