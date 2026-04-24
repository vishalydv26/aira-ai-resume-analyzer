const express = require('express');
const multer = require('multer'); // Declare it ONCE at the top
// ... other imports

const app = express();

// Set up the storage configuration (Don't use 'const multer' here again!)
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

// Use it in your routes
app.post('/api/resumes', upload.single('resume'), (req, res) => {
   // your logic
});