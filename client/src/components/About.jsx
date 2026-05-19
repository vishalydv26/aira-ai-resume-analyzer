import React from 'react';

export default function About() {
  return (
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-white mb-2">Project Architecture & Logic Specification</h2>
        <p className="text-sm text-emerald-400 font-semibold uppercase tracking-widest">Platform Version 2.0.0 (Multi-Engine System)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-950 border border-gray-850 p-5 rounded-2xl">
          <h3 className="text-white font-bold mb-2 text-md flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Custom NLP Metric Matrix
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            The backend features an independent computational algorithm. It handles string cleansing data formatting, structures unstructured texts into continuous keyword arrays, drops minor stop-words, and runs string intersection logic matrices to extract a direct keyword density ratio completely local to the Node.js server loop.
          </p>
        </div>

        <div className="bg-gray-950 border border-gray-850 p-5 rounded-2xl">
          <h3 className="text-white font-bold mb-2 text-md flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span> Semantic Vector AI Analysis
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            By connecting with Google's <code>gemini-2.5-flash</code> architecture via native network SDK streams, the program contextually maps soft-skills matching, analyzes abstract structural project complexities, and returns formatted analytical JSON schemas tracking target metrics.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-6">
        <h3 className="text-white font-bold mb-3 text-sm tracking-wider uppercase text-gray-400">Underlying Tech Stack Specifications</h3>
        <div className="flex flex-wrap gap-3">
          {['React.js (Vite Core)', 'Node.js Express Framework', 'MongoDB Mongoose Driver', 'Recharts Structural SVG Graphics Engine', 'Tailwind Declarative CSS Components', 'JSON Web Tokens (JWT System)'].map((tech, idx) => (
            <span key={idx} className="bg-gray-950 text-xs text-gray-400 font-mono px-4 py-2 rounded-xl border border-gray-850">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}