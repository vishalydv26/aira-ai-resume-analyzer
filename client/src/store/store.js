// client/src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from './resumeSlice';
import authReducer from './authSlice'; // 1. Import the new auth slice

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    auth: authReducer, // 2. Add it to the main store!
  },
});