// slices/moduleProgressSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { anotherApiService } from '../ApiServices/ActivityEngine/ProgressApiServices'; // Make sure this path is correct

// Async thunk for fetching module progress data
export const fetchModuleProgress = createAsyncThunk(
  'moduleProgress/fetchModuleProgress',
  async ({ courseInstanceId, moduleId }, { dispatch }) => {
    const response = await dispatch(anotherApiService.endpoints.fetchModuleProgress.initiate({ courseInstanceId, moduleId }));
    return response.data;
  }
);

const moduleProgressSlice = createSlice({
  name: 'moduleProgress',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchModuleProgress.fulfilled, (state, action) => {
      const { courseInstanceId, moduleId } = action.meta.arg;
      const progressKey = `${courseInstanceId}-${moduleId}`;
      state[progressKey] = action.payload.progress; // Store progress data
      console.log("This is my Module Progress and Progress Key..........................",state[progressKey],progressKey);
    });
  },
});

export default moduleProgressSlice.reducer;
