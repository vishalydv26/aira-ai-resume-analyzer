import React, { useState } from 'react';

export default function Signup({ onAuthSuccess, switchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        onAuthSuccess(data.user);
      } else {
        alert(data.message || "Registration encountered an error.");
      }
    } catch (err) {
      alert("Database error during account compilation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl max-w-md mx-auto my-12 shadow-2xl">
      <h2 className="text-2xl font-black text-white text-center mb-2">Create Workspace Account</h2>
      <p className="text-gray-500 text-center text-sm mb-6">Initialize your secure analytics profile database</p>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
          <input 
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
            placeholder="John Doe" required 
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Academic Email</label>
          <input 
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
            placeholder="name@university.edu" required 
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Security Password</label>
          <input 
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
            placeholder="Minimum 6 characters" required 
          />
        </div>

        <button 
          type="submit" disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold py-3 rounded-xl shadow-lg hover:opacity-95 transition text-sm"
        >
          {loading ? "Registering Node Data..." : "Generate Developer Profile"}
        </button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-6">
        Already registered?{' '}
        <button onClick={switchToLogin} className="text-emerald-400 font-medium hover:underline">Log in instead</button>
      </p>
    </div>
  );
}