// src/store/slices/modulesSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { apiService } from '../ApiServices/LmsEngine/DataFetchApiServices'; // Adjust the path as necessary

const initialState = {
  modules: [],
  isLoading: false,
  error: null,
};

const modulesSlice = createSlice({
  name: 'modules',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(apiService.endpoints.fetchModulesWithAuth.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(apiService.endpoints.fetchModulesWithAuth.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.modules = action.payload.modules; // Ensure this matches the payload structure
      })
      .addMatcher(apiService.endpoints.fetchModulesWithAuth.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error ? action.error.message : null;
      });
  },
});

export default modulesSlice.reducer;
