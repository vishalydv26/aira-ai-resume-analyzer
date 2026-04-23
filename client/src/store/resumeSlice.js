// client/src/store/resumeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  isLoading: false,
  error: null,
  // NEW: State for job matching
  matchedJobs: [],
  jobsLoading: false,
  jobsError: null,
};

export const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    uploadStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    uploadSuccess: (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    },
    uploadFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    // NEW: Actions for Job Matching
    matchJobsStart: (state) => {
      state.jobsLoading = true;
      state.jobsError = null;
    },
    matchJobsSuccess: (state, action) => {
      state.jobsLoading = false;
      state.matchedJobs = action.payload;
    },
    matchJobsFailure: (state, action) => {
      state.jobsLoading = false;
      state.jobsError = action.payload;
    },
    clearResume: (state) => {
      state.data = null;
      state.error = null;
      state.matchedJobs = []; // clear jobs on reset
      state.jobsError = null;
    }
  },
});

export const { 
  uploadStart, 
  uploadSuccess, 
  uploadFailure, 
  matchJobsStart, 
  matchJobsSuccess, 
  matchJobsFailure, 
  clearResume 
} = resumeSlice.actions;

export default resumeSlice.reducer;