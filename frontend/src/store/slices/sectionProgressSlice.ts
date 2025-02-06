// slices/sectionProgressSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { anotherApiService } from '../ApiServices/ActivityEngine/ProgressApiServices'; // Ensure this is the correct path

// Async thunk for fetching section progress data
export const fetchSectionProgress = createAsyncThunk(
  'sectionProgress/fetchSectionProgress',
  async ({ courseInstanceId, sectionId }, { dispatch }) => {
    const response = await dispatch(anotherApiService.endpoints.fetchSectionProgress.initiate({ courseInstanceId, sectionId }));
    return response.data;
  }
);

const sectionProgressSlice = createSlice({
  name: 'sectionProgress',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSectionProgress.fulfilled, (state, action) => {
      const { courseInstanceId, sectionId } = action.meta.arg;
      const progressKey = `${courseInstanceId}-${sectionId}`;
      state[progressKey] = action.payload.progress; // Storing progress data
      console.log("This is my Section Progress and Progress Key..........................",state[progressKey],progressKey);
    });
  },
});

export default sectionProgressSlice.reducer;
