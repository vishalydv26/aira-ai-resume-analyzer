require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const connectDB = require('./config/db');
const { register, login } = require('./controllers/authController');
const { analyzeResume, getHistory } = require('./controllers/resumeController');
const { protect } = require('./middleware/authMiddleware'); // (or wherever your auth middleware file is)

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Memory-buffer storage engine to safely prevent hosting deployment crashes
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Security and Ingestion Route Tree
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

app.post('/api/resumes/analyze', protect, upload.single('resume'), analyzeResume);
app.get('/api/resumes/history', protect, getHistory);

// Global Developer Exception Safety Net
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal application handler crashed." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`System live on port ${PORT}`));