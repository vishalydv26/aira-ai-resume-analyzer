import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function AnalyticsDashboard({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 text-center text-gray-400">
        No analytical tracking history recorded yet. Complete an optimization scan to generate data graphs.
      </div>
    );
  }

  // Formatting historical logs for the Line Chart timelines
  const timelineData = history.map((item, index) => ({
    name: `Scan ${index + 1}`,
    Score: item.overallScore,
    Keywords: item.keywordScore,
    Semantic: item.semanticScore,
    Role: item.jobTitle
  }));

  // Average composition metrics for the dynamic structural Radar plot
  const latest = history[history.length - 1];
  const radarData = [
    { subject: 'Keyword Weight', A: latest.keywordScore, fullMark: 100 },
    { subject: 'Semantic Context', A: latest.semanticScore, fullMark: 100 },
    { subject: 'Overall Compatibility', A: latest.overallScore, fullMark: 100 },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
        Data Analytics Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Graph Card 1: Score Optimization Timeline */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h3 className="text-gray-300 font-semibold mb-4 text-sm tracking-wide uppercase">Match Progress Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937' }} />
                <Line type="monotone" dataKey="Score" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
                <Line type="monotone" dataKey="Keywords" stroke="#3b82f6" strokeWidth={1} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph Card 2: Vector Matrix Radar Component */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex flex-col items-center">
          <h3 className="text-gray-300 font-semibold mb-4 text-sm tracking-wide uppercase self-start">Latest Profile Metric Vector</h3>
          <div className="w-full h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#1f2937" />
                <PolarAngleAxis dataKey="subject" stroke="#9ca3af" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#4b5563" />
                <Radar name="Metrics" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}