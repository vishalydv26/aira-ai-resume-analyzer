import React, { useState } from 'react';

export default function ForgotPassword({ switchToLogin }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For presentation demo simplicity, mock the handshake confirmation
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl max-w-md mx-auto my-12 shadow-2xl">
      <h2 className="text-2xl font-black text-white text-center mb-2">Account Recovery</h2>
      
      {!submitted ? (
        <>
          <p className="text-gray-500 text-center text-sm mb-6">Enter your registered email routing address to trigger a cryptographic credential token reset</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                type="email" value={email} placeholder="name@university.edu" required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold py-3 rounded-xl shadow-lg text-sm">
              Dispatch Verification Token
            </button>
          </form>
        </>
      ) : (
        <div className="text-center space-y-4">
          <div className="text-emerald-400 text-sm font-semibold bg-emerald-950/40 py-3 rounded-xl border border-emerald-900/50">
            ✓ Simulated Reset Packet Outbound
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            In a live deployment vector, an encrypted payload token is routed to <strong>{email}</strong> via SMTP configurations.
          </p>
        </div>
      )}

      <div className="text-center mt-6">
        <button onClick={switchToLogin} className="text-xs text-gray-500 hover:text-white transition underline">
          Return to Login Window
        </button>
      </div>
    </div>
  );
}