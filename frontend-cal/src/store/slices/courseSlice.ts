// src/store/slices/coursesSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { apiService } from '../ApiServices/LmsEngine/DataFetchApiServices'; // Adjust the path as necessary

const initialState = {
  courses: [],
  isLoading: false,
  error: null,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(apiService.endpoints.fetchCoursesWithAuth.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(apiService.endpoints.fetchCoursesWithAuth.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload.courses;
      })
      .addMatcher(apiService.endpoints.fetchCoursesWithAuth.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error ? action.error.message : null;
      });
  },
});

export default coursesSlice.reducer;
