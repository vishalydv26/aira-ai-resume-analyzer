import React, { useState, useEffect } from 'react';
import Analyzer from './components/Analyzer';
import AnalyticsDashboard from './components/AnalyticsDashboard';

export default function App() {
  const [history, setHistory] = useState([]);
  const [activeAnalysis, setActiveAnalysis] = useState(null);

  const fetchUserWorkspaceHistory = async () => {
    try {
      const response = await fetch('https://aira-backend-80ix.onrender.com/api/resumes/history', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (response.ok) setHistory(data);
    } catch (err) {
      console.error("Analytical log pull failed.");
    }
  };

  useEffect(() => {
    // For local dev validation, mock a test token if empty
    if (!localStorage.getItem('token')) localStorage.setItem('token', 'MOCK_TOKEN_STRING');
    fetchUserWorkspaceHistory();
  }, []);

  const handleAnalysisCompletion = (newRecord) => {
    setActiveAnalysis(newRecord);
    setHistory([...history, newRecord]);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans p-6 md:p-12 space-y-12">
      <header className="max-w-6xl mx-auto flex justify-between items-center border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">AiRA Platform</h1>
          <p className="text-gray-500 text-sm mt-1">Enterprise Semantic Match & Talent Analytics Profile Workspace</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-12">
        {/* Dynamic Analytics Visual Segment */}
        <AnalyticsDashboard history={history} />

        {/* Input Interface Layer */}
        <Analyzer onAnalysisComplete={handleAnalysisCompletion} />

        {/* Real-time Analytical Report Render Output */}
        {activeAnalysis && (
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl space-y-6 max-w-3xl mx-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-emerald-400">Real-Time Platform Processing Metrics</h3>
              <span className="text-3xl font-black text-white px-4 py-2 bg-gray-950 rounded-2xl border border-gray-800">
                {activeAnalysis.overallScore}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                <span className="text-xs text-gray-500 block uppercase tracking-wider">Custom Algo Score</span>
                <span className="text-lg font-bold text-blue-400">{activeAnalysis.keywordScore}%</span>
              </div>
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                <span className="text-xs text-gray-500 block uppercase tracking-wider">Gemini Semantic Score</span>
                <span className="text-lg font-bold text-purple-400">{activeAnalysis.semanticScore}%</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Identified Missing Target Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {activeAnalysis.missingKeywords.slice(0, 8).map((word, i) => (
                  <span key={i} className="bg-red-950/50 border border-red-900/60 text-red-400 text-xs px-3 py-1 rounded-md">
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4">
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Predictive Gap Analysis</h4>
              <p className="text-gray-300 text-sm leading-relaxed">{activeAnalysis.gapAnalysis}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}