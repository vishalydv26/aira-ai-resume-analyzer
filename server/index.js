const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();
// Declare PORT only once here!
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Link the routes
const resumeRoutes = require('./routes/resumeRoutes');
const authRoutes = require('./routes/authRoutes'); 

app.use('/api/resumes', resumeRoutes);
app.use('/api/auth', authRoutes); 

// Basic route
app.get('/', (req, res) => {
  res.send('AiRA Backend is running!');
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));