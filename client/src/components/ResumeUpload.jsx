// client/src/components/ResumeUpload.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  uploadStart, uploadSuccess, uploadFailure, 
  matchJobsStart, matchJobsSuccess, matchJobsFailure 
} from '../store/resumeSlice';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  
  const dispatch = useDispatch();
  
  // 1. ALL Hooks must be inside the component!
  const { user } = useSelector((state) => state.auth);
  const { 
    data: result, 
    isLoading: loading, 
    error,
    matchedJobs,
    jobsLoading,
    jobsError
  } = useSelector((state) => state.resume);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      dispatch(uploadFailure("Please select a file first."));
      return;
    }

    dispatch(uploadStart());

    const formData = new FormData();
    formData.append('resume', file); 

    try {
      const response = await fetch('https://aira-backend-80ix.onrender.com', {
        method: 'POST',
        headers: {
          // 2. Attach the JWT token from Redux to the headers
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) throw new Error(responseData.message || "Failed to upload");

      dispatch(uploadSuccess(responseData.data));
    } catch (err) {
      dispatch(uploadFailure(err.message));
    }
  };

  const handleFindJobs = async () => {
    if (!result || !result._id) return;

    dispatch(matchJobsStart());

    try {
      const response = await fetch(`https://aira-backend-80ix.onrender.com`, {
        method: 'POST',
        headers: {
          // 3. Attach the JWT token here as well!
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to match jobs");

      dispatch(matchJobsSuccess(data.matchedJobs));
    } catch (err) {
      dispatch(matchJobsFailure(err.message));
    }
  };

  // ... Keep all your existing functions and state above this line!
// NEW: Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15 // This makes the cards pop in one after another!
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
 return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
          AI Resume Intelligence
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Upload a candidate's resume to instantly extract skills and match them to open roles.</p>
      </div>

      {/* Premium Upload Card */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">
        <form onSubmit={handleUpload} className="flex flex-col items-center gap-6">
          
          <div className="w-full max-w-lg relative border-2 border-dashed border-indigo-200 dark:border-slate-600 bg-indigo-50/50 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-2xl p-10 transition-colors duration-200 flex flex-col items-center justify-center cursor-pointer">
            <svg className="w-12 h-12 text-indigo-400 dark:text-indigo-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-slate-600 dark:text-slate-300 font-medium text-center">
              Click to browse or drag PDF here
            </span>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {file && (
              <div className="mt-4 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 text-sm font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                📄 {file.name}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full max-w-lg bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:to-violet-500 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transform transition active:scale-95"
          >
            {loading ? 'Processing via Gemini AI...' : 'Analyze Resume'}
          </button>
        </form>

        {error && <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800 rounded-xl text-center font-medium">{error}</div>}
      </div>

      {/* The Results Dashboard */}
      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300"
        >
          
          <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{result.candidateName}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Profile Analysis</p>
            </div>
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
              className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase border border-indigo-200 dark:border-indigo-700/50"
            >
              {result.aiAnalysis?.experienceLevel} Level
            </motion.span>
          </div>

          <div className="p-8 space-y-8">
            <div className="bg-indigo-50/50 dark:bg-slate-700/50 p-5 rounded-2xl border border-indigo-50 dark:border-slate-600">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">"{result.aiAnalysis?.summary}"</p>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Extracted Skills</h4>
              <div className="flex flex-wrap gap-2">
                {result.skills?.map((skill, index) => (
                  <motion.span 
                    key={index} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + (index * 0.05) }} // Staggers the pills!
                    className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-default transition-colors text-sm px-4 py-2 rounded-lg font-semibold border border-slate-200 dark:border-slate-600"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">Role Compatibility</h4>
                {matchedJobs.length === 0 && (
                  <button 
                    onClick={handleFindJobs}
                    disabled={jobsLoading}
                    className="bg-slate-800 dark:bg-indigo-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-slate-900 dark:hover:bg-indigo-700 disabled:opacity-50 transition"
                  >
                    {jobsLoading ? 'Searching Roles...' : 'Generate Matches'}
                  </button>
                )}
              </div>

              {jobsError && <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-center mb-6">{jobsError}</div>}
               
              {matchedJobs.length > 0 && (
                 <motion.div 
                   variants={containerVariants}
                   initial="hidden"
                   animate="show"
                   className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                 >
                   {matchedJobs.map((job, index) => (
                     <motion.div 
                       key={index} 
                       variants={cardVariants}
                       whileHover={{ y: -5 }} // Slight lift on hover!
                       className="p-6 border border-slate-200 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-xl transition-all group relative overflow-hidden"
                     >
                       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                       
                       <div className="flex justify-between items-start mb-4">
                         <h5 className="font-bold text-lg text-slate-800 dark:text-slate-100">{job.title}</h5>
                         <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-400 text-xs font-extrabold px-2.5 py-1 rounded-md shadow-sm border border-emerald-200 dark:border-emerald-800">
                           {job.matchPercentage}%
                         </span>
                       </div>
                       <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{job.description}</p>
                     </motion.div>
                   ))}
                 </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ResumeUpload;