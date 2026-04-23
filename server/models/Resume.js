const mongoose = require('mongoose');
const resumeSchema = new mongoose.Schema({
  // NEW: Link this resume to a specific user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  candidateName: { type: String, required: true },
  originalFileName: { type: String, required: true },
  extractedText: { type: String, required: true },
  skills: { type: [String], default: [] },
  aiAnalysis: { type: Object, default: {} },
  matchedJobs: { type: Array, default: [] }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Resume', resumeSchema);