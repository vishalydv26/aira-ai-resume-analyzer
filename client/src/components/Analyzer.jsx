import React, { useState } from 'react';

export default function Analyzer({ onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobTitle || !jobDescription) return alert("All profile parameters must be filled.");

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobTitle', jobTitle);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await fetch('https://aira-backend-80ix.onrender.com/api/resumes/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        onAnalysisComplete(data);
        setJobTitle('');
        setJobDescription('');
        setFile(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Network transmission error occurred during computational parse execution.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-xl max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-6">Initialize Multi-Engine Analysis</h2>
      
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Target Job Profile Title</label>
          <input 
            type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
            placeholder="e.g., Full-Stack Web Engineer" required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Raw Industry Job Description Document</label>
          <textarea 
            value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={5}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
            placeholder="Paste target job specification details here..." required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Applicant Structural Resume (PDF Only)</label>
          <input 
            type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-950 file:text-emerald-400 hover:file:bg-emerald-900 cursor-pointer"
            required 
          />
        </div>

        <button 
          type="submit" disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold py-4 rounded-xl shadow-lg hover:opacity-90 transition duration-200 disabled:opacity-50"
        >
          {loading ? "Executing Complex Matrix Analysis Pipeline..." : "Execute Automated ATS Processing Match"}
        </button>
      </form>
    </div>
  );
}