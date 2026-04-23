// client/src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/authSlice';
import ResumeUpload from './components/ResumeUpload';
import Signup from './components/Signup';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';

function App() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // --- NEW: Dark Mode State & Logic ---
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if the user previously chose dark mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };
  // ------------------------------------

  const handleLogout = () => dispatch(logout());

  return (
    <Router>
      {/* NEW: Added dark:bg-slate-900 for the main website background */}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        
        {/* NEW: Updated Navbar for dark mode */}
        <nav className="bg-white dark:bg-slate-800 shadow-sm p-4 transition-colors duration-300 border-b dark:border-slate-700">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">AiRA</h1>
            
            <div className="flex items-center gap-6">
              {/* Dark Mode Toggle Button */}
              <button 
                onClick={toggleTheme} 
                className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                title="Toggle Dark Mode"
              >
                {isDarkMode ? '☀️ Light' : '🌙 Dark'}
              </button>

              {user && (
                <div className="flex items-center gap-4">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Hello, {user.name}</span>
                  <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-1.5 rounded-md text-sm hover:bg-red-600 transition font-bold">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={user ? <ResumeUpload /> : <Navigate to="/login" />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
              <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;