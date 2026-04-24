// client/src/components/Login.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { authStart, authSuccess, authFailure } from '../store/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(authStart());

    try {
      const response = await fetch('https://aira-backend-80ix.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      dispatch(authSuccess(data));
      navigate('/');
    } catch (err) {
      dispatch(authFailure(err.message));
    }
  };

 return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 mt-12 transition-colors duration-300 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
          Welcome Back
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Please sign in to your account</p>
      </div>
      
      {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800 rounded-xl text-center font-medium">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-bold mb-2">Email Address</label>
          <input 
            type="email" 
            name="email" 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors" 
          />
        </div>
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-bold mb-2">Password</label>
          <input 
            type="password" 
            name="password" 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors" 
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading} 
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:to-violet-500 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 transform transition active:scale-95 mt-4"
        >
          {isLoading ? 'Logging In...' : 'Log In'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center text-sm font-medium flex flex-col gap-3">
        <Link to="/forgot-password" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">Forgot Password?</Link>
        <p className="text-slate-500 dark:text-slate-400">
          Don't have an account? <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;