// server/controllers/resumeController.js
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file.' });
    }

    // 1. Extract Text from PDF (This will now work perfectly!)
    const dataBuffer = req.file.buffer;
    const data = await pdfParse(dataBuffer);
    const extractedText = data.text;

    // 2. Prepare the AI Prompt
    const prompt = `
      You are an expert ATS (Applicant Tracking System). Analyze the following resume text and extract the key information.
      Return the output STRICTLY as a JSON object with the following keys:
      - candidateName (string, infer from text, or "Unknown" if not found)
      - skills (array of strings)
      - experienceLevel (string: "Entry", "Mid", or "Senior")
      - summary (a brief 2-sentence professional summary based on the text)
      
      Resume Text:
      ${extractedText}
    `;

    // 3. Call the Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let aiText = response.text();

    // 4. Parse the AI JSON Output safely
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI did not return valid JSON");
    }
    const aiData = JSON.parse(jsonMatch[0]);

    // 5. Save to MongoDB
    const newResume = new Resume({
      user: req.user.id,
      candidateName: aiData.candidateName,
      originalFileName: req.file.originalname,
      extractedText: extractedText,
      skills: aiData.skills,
      aiAnalysis: {
        experienceLevel: aiData.experienceLevel,
        summary: aiData.summary
      }
    });

    await newResume.save();

    // 6. Send Success Response
    res.status(201).json({
      message: 'Resume analyzed successfully!',
      data: newResume
    });

  } catch (error) {
    console.error("Error processing resume:", error);
    res.status(500).json({ message: 'Server error during parsing or AI analysis.' });
  }
};
// Add this right below your uploadResume function
const matchJobs = async (req, res) => {
  try {
    const resumeId = req.params.id;
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // 1. Prepare the AI Prompt for Job Matching
    const prompt = `
      You are an expert tech recruiter. Based on the following candidate profile, suggest 3 highly suitable job roles.
      Candidate Skills: ${resume.skills.join(', ')}
      Experience Level: ${resume.aiAnalysis.experienceLevel}
      Summary: ${resume.aiAnalysis.summary}

      Return the output STRICTLY as a JSON array of objects. Each object must have these keys:
      - title (string: The job title)
      - description (string: A 1-sentence reason why it's a good match)
      - matchPercentage (number: An estimated match score between 70 and 100)
    `;

    // 2. Call the Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let aiText = response.text();

    // 3. Parse the AI JSON Output safely
    const jsonMatch = aiText.match(/\[[\s\S]*\]/); // Looking for an array [] this time!
    if (!jsonMatch) {
      throw new Error("AI did not return a valid JSON array");
    }
    const recommendedJobs = JSON.parse(jsonMatch[0]);

    // 4. Update the Resume in MongoDB
    resume.matchedJobs = recommendedJobs;
    await resume.save();

    // 5. Send Success Response
    res.status(200).json({
      message: 'Jobs matched successfully!',
      matchedJobs: recommendedJobs
    });

  } catch (error) {
    console.error("Error matching jobs:", error);
    res.status(500).json({ message: 'Server error during job matching.' });
  }
};

// Update your exports to include the new function!
module.exports = { uploadResume, matchJobs };
