import React, { useState, useEffect } from 'react';
import Analyzer from './components/Analyzer';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import About from './components/About';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // Options: dashboard, analyzer, about, login, signup, forgot
  const [history, setHistory] = useState([]);
  const [activeAnalysis, setActiveAnalysis] = useState(null);

  const fetchHistoryData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5000/api/resumes/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setHistory(data);
    } catch (err) {
      console.error("Historical trace stream disruption.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Simulate session restoration for demo fluidity
      setUser({ name: "Authorized Student" });
      fetchHistoryData();
    } else {
      setCurrentView('login');
    }
  }, []);

  const handleAuthenticationSuccess = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
    fetchHistoryData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setHistory([]);
    setActiveAnalysis(null);
    setCurrentView('login');
  };

  const handleAnalysisCompletion = (newRecord) => {
    setActiveAnalysis(newRecord);
    setHistory([...history, newRecord]);
    setCurrentView('dashboard'); // auto viewport return to graph visual
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans p-6 md:p-12 space-y-8">
      {/* Platform Navigation Header Matrix */}
      <header className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center border-b border-gray-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">AiRA Platform</h1>
          <p className="text-gray-500 text-sm mt-1">Enterprise Semantic Match & Talent Analytics Workspace</p>
        </div>
        
        {user && (
          <nav className="flex items-center gap-2 bg-gray-900 border border-gray-800 p-1.5 rounded-2xl text-sm">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 rounded-xl font-medium transition ${currentView === 'dashboard' ? 'bg-emerald-500 text-black font-bold' : 'text-gray-400 hover:text-white'}`}
            >
              Analytics
            </button>
            <button 
              onClick={() => setCurrentView('analyzer')}
              className={`px-4 py-2 rounded-xl font-medium transition ${currentView === 'analyzer' ? 'bg-emerald-500 text-black font-bold' : 'text-gray-400 hover:text-white'}`}
            >
              Run Matcher
            </button>
            <button 
              onClick={() => setCurrentView('about')}
              className={`px-4 py-2 rounded-xl font-medium transition ${currentView === 'about' ? 'bg-emerald-500 text-black font-bold' : 'text-gray-400 hover:text-white'}`}
            >
              Documentation
            </button>
            <button onClick={handleLogout} className="px-4 py-2 text-red-400 hover:bg-red-950/30 rounded-xl font-medium transition">
              Exit
            </button>
          </nav>
        )}
      </header>

      {/* Target Dynamic Component Context Mounting Vector */}
      <main className="max-w-6xl mx-auto">
        {currentView === 'login' && (
          <Login 
            onAuthSuccess={handleAuthenticationSuccess} 
            switchToSignup={() => setCurrentView('signup')} 
            switchToForgot={() => setCurrentView('forgot')} 
          />
        )}
        {currentView === 'signup' && (
          <Signup 
            onAuthSuccess={handleAuthenticationSuccess} 
            switchToLogin={() => setCurrentView('login')} 
          />
        )}
        {currentView === 'forgot' && (
          <ForgotPassword switchToLogin={() => setCurrentView('login')} />
        )}

        {user && (
          <div className="space-y-12">
            {currentView === 'dashboard' && (
              <>
                <AnalyticsDashboard history={history} />
                {activeAnalysis && (
                  <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl space-y-6 max-w-3xl mx-auto shadow-xl">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-emerald-400">Target Match Execution Output</h3>
                      <span className="text-3xl font-black bg-gray-950 border border-gray-800 px-5 py-2 rounded-2xl">{activeAnalysis.overallScore}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-950 p-4 rounded-xl border border-gray-850"><span className="text-gray-500 block text-xs">Custom Matching Matrix</span><span className="text-blue-400 font-bold">{activeAnalysis.keywordScore}%</span></div>
                      <div className="bg-gray-950 p-4 rounded-xl border border-gray-850"><span className="text-gray-500 block text-xs">Semantic Processing Vector</span><span className="text-purple-400 font-bold">{activeAnalysis.semanticScore}%</span></div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Identified Missing Target Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {activeAnalysis.missingKeywords.slice(0, 8).map((word, i) => <span key={i} className="bg-red-950/40 border border-red-900/50 text-red-400 text-xs px-2.5 py-1 rounded-md">{word}</span>)}
                      </div>
                    </div>
                    <div className="border-t border-gray-800 pt-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Predictive Gap Analysis Statement</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{activeAnalysis.gapAnalysis}</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {currentView === 'analyzer' && <Analyzer onAnalysisComplete={handleAnalysisCompletion} />}
            {currentView === 'about' && <About />}
          </div>
        )}
      </main>
    </div>
  );
}