// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import videoReducer from '../features/videos/redux/videoSlice';

const store = configureStore({
    reducer: {
      videos: videoReducer,
      // Add other reducers here
    },
  });
  
  // Export the type of the entire Redux state
  export type RootState = ReturnType<typeof store.getState>;
  
  // Export the dispatch type for convenience
  export type AppDispatch = typeof store.dispatch;
  
  export default store;