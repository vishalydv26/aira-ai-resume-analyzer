const Analysis = require('../models/Analysis');
const pdfParse = require('pdf-parse');
const { GoogleGenAI } = require('@google/genai');

// Initalize Google Gemini API Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Custom Computational Engine: Local Keyword Analyzer
const runCustomKeywordMatch = (resumeText, jobDescription) => {
  const cleanText = (text) => text.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/);
  
  const resumeTokens = new Set(cleanText(resumeText));
  const jobTokens = cleanText(jobDescription);

  // Focus filter for critical high-value tech terms
  const stopWords = new Set(['and', 'the', 'is', 'with', 'for', 'to', 'in', 'of', 'a', 'an']);
  const uniqueJobKeywords = [...new Set(jobTokens)].filter(word => word.length > 2 && !stopWords.has(word));

  const matchedKeywords = [];
  const missingKeywords = [];

  uniqueJobKeywords.forEach(word => {
    if (resumeTokens.has(word)) {
      matchedKeywords.push(word);
    } else {
      missingKeywords.push(word);
    }
  });

  const keywordScore = uniqueJobKeywords.length > 0 
    ? Math.round((matchedKeywords.length / uniqueJobKeywords.length) * 100) 
    : 0;

  return { keywordScore, matchedKeywords, missingKeywords };
};

exports.analyzeResume = async (req, res) => {
  try {
    const { jobTitle, jobDescription } = req.body;
    if (!req.file) return res.status(400).json({ message: "No resume file uploaded." });

    // Step 1: Direct Memory Buffer PDF Extraction
    const parsedPdf = await pdfParse(req.file.buffer);
    const resumeText = parsedPdf.text;

    // Step 2: Fire Custom Internal NLP Engine
    const { keywordScore, matchedKeywords, missingKeywords } = runCustomKeywordMatch(resumeText, jobDescription);

    // Step 3: Run AI Semantic Orchestrator 
    const prompt = `
      You are an expert Enterprise Applicant Tracking System (ATS). Analyze this Resume against this Job Description.
      
      Resume Text: "${resumeText}"
      Job Description: "${jobDescription}"
      
      Provide your response in strict valid raw JSON formatting matching this scheme exactly:
      {
        "semanticScore": 85, 
        "gapAnalysis": "Detailed architectural analysis string regarding context alignment...",
        "roadmap": ["Action item step 1 to upskill", "Action item step 2..."]
      }
    `;

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const aiData = JSON.parse(aiResponse.text.trim());

    // Step 4: Compute the Engineering Hybrid Blend Score
    const overallScore = Math.round((keywordScore * 0.4) + (aiData.semanticScore * 0.6));

    // Step 5: Save Snapshot to MongoDB User History Workspace
    const newAnalysis = await Analysis.create({
      userId: req.user.id,
      jobTitle,
      overallScore,
      keywordScore,
      semanticScore: aiData.semanticScore,
      matchedKeywords,
      missingKeywords,
      gapAnalysis: aiData.gapAnalysis,
      roadmap: aiData.roadmap
    });

    res.status(201).json(newAnalysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Analytical execution failed. File error or malformed JSON payload." });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const records = await Analysis.find({ userId: req.user.id }).sort({ createdAt: 1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};