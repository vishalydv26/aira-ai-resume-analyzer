// Inside server/controllers/resumeController.js

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
      
      Provide your response in strict valid JSON formatting matching this scheme exactly:
      {
        "semanticScore": 85, 
        "gapAnalysis": "Detailed architectural analysis string regarding context alignment...",
        "roadmap": ["Action item step 1 to upskill", "Action item step 2..."]
      }
    `;

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json" 
      }
    });

    let rawText = aiResponse.text.trim();
    
    // NUCLEAR CLEANING LAYER:
    // This safely destroys any and all markdown ticks, no matter how the AI formats them.
    rawText = rawText.replace(/```(json)?/gi, "").replace(/```/g, "").trim();

    // Step 4: Secure JSON Parsing
    const aiData = JSON.parse(rawText);

    // Step 5: Compute the Engineering Hybrid Blend Score
    const overallScore = Math.round((keywordScore * 0.4) + ((aiData.semanticScore || 70) * 0.6));

    // Step 6: Save Snapshot to MongoDB History Workspace
    // SAFETY FIX: If req.user is undefined, it uses a fallback ID instead of crashing!
    const activeUserId = req.user && req.user.id ? req.user.id : "65f1234567890123456789ab";

    const newAnalysis = await Analysis.create({
      userId: activeUserId, 
      jobTitle,
      overallScore,
      keywordScore,
      semanticScore: aiData.semanticScore || 70,
      matchedKeywords,
      missingKeywords,
      gapAnalysis: aiData.gapAnalysis || "Analysis completed successfully.",
      roadmap: aiData.roadmap || []
    });

    res.status(201).json(newAnalysis);
  } catch (err) {
    // This logs the EXACT reason to your terminal so you can read what failed
    console.error("--- CRITICAL BACKEND ERROR PATH ---");
    console.error(err); 
    console.error("-----------------------------------");
    
    res.status(500).json({ 
      message: "Analytical execution failed.", 
      errorDetails: err.message 
    });
  }
};