// client/src/components/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ email: '', newPassword: '' });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('https://aira-backend-80ix.onrender.com/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage(data.message);
      setFormData({ email: '', newPassword: '' }); // Clear form
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 mt-12 transition-colors duration-300 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
          Reset Password
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Securely update your credentials</p>
      </div>
      
      {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800 rounded-xl text-center font-medium">{error}</div>}
      {message && <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 rounded-xl text-center font-medium">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-bold mb-2">Registered Email</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors"
          />
        </div>
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-bold mb-2">New Password</label>
          <input 
            type="password" 
            name="newPassword" 
            value={formData.newPassword} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-slate-800 dark:bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg hover:bg-slate-900 dark:hover:bg-indigo-700 disabled:opacity-50 transform transition active:scale-95 mt-4"
        >
          {loading ? 'Processing...' : 'Reset Password'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center text-sm font-medium flex flex-col gap-3">
        <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
          &larr; Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;