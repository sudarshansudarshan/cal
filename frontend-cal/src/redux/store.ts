// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import videoReducer from '../features/videos/redux/videoSlice';


const store = configureStore({
    reducer: {
        videos: videoReducer, // Add reducers here
    },
});

export default store;

// Export RootState and AppDispatch for proper typing
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;