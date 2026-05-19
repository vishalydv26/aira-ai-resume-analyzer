const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobTitle: { type: String, required: true },
  overallScore: { type: Number, required: true }, // Hybrid Blend Score
  keywordScore: { type: Number, required: true }, // Custom Algorithm Score
  semanticScore: { type: Number, required: true }, // Gemini Analytical Score
  matchedKeywords: [{ type: String }],
  missingKeywords: [{ type: String }],
  gapAnalysis: { type: String },                  // Structural summary from AI
  roadmap: [{ type: String }]                     // Step-by-step career fixes
}, { timestamps: true });

module.exports = mongoose.model('Analysis', analysisSchema);