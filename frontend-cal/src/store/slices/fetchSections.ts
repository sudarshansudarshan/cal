// src/store/slices/sectionsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { apiService } from '../ApiServices/LmsEngine/DataFetchApiServices'; // Adjust the path as necessary

interface Section {
  id: number;
  title: string;
  content: string;
}

const initialState: {
  sections: Section[];
  isLoading: boolean;
  error: string | null;
} = {
  sections: [],
  isLoading: false,
  error: null,
};

const sectionsSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(apiService.endpoints.fetchSectionsWithAuth.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(apiService.endpoints.fetchSectionsWithAuth.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.sections = action.payload.sections; // Ensure this matches the payload structure
      })
      .addMatcher(apiService.endpoints.fetchSectionsWithAuth.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error && action.error.message ? action.error.message : null;
      });
  },
});

export default sectionsSlice.reducer;
