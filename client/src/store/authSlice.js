// client/src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Check if a user is already saved in local storage (so they stay logged in after a refresh)
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      // Save token to local storage
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    authFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    }
  },
});

export const { authStart, authSuccess, authFailure, logout } = authSlice.actions;
export default authSlice.reducer;