import React, { useState } from 'react';

export default function Login({ onAuthSuccess, switchToSignup, switchToForgot }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        onAuthSuccess(data.user);
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      alert("Database connection error during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl max-w-md mx-auto my-12 shadow-2xl">
      <h2 className="text-2xl font-black text-white text-center mb-2">Welcome Back</h2>
      <p className="text-gray-500 text-center text-sm mb-6">Log in to manage your talent optimization profiles</p>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
          <input 
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
            placeholder="name@university.edu" required 
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
          <input 
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
            placeholder="••••••••" required 
          />
        </div>

        <div className="text-right">
          <button type="button" onClick={switchToForgot} className="text-xs text-emerald-400 hover:underline">
            Forgot Password?
          </button>
        </div>

        <button 
          type="submit" disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold py-3 rounded-xl shadow-lg hover:opacity-95 transition text-sm"
        >
          {loading ? "Authenticating Account..." : "Sign In"}
        </button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-6">
        New to the platform?{' '}
        <button onClick={switchToSignup} className="text-emerald-400 font-medium hover:underline">Create an account</button>
      </p>
    </div>
  );
}