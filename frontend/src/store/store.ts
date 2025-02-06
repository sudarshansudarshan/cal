// Import required dependencies from Redux Toolkit and redux-persist
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // This uses local storage as the default storage engine
import { anotherApiService, apiService } from './apiService';
import authReducer from './slices/authSlice';
import coursesReducer from './slices/courseSlice';
import modulesReducer from './slices/fetchModulesSlice';
import sectionsReducer from './slices/fetchSections';
import progressReducer from './slices/fetchStatusSlice'; 
import sectionProgressReducer from './slices/sectionProgressSlice'; 
import moduleProgressReducer from './slices/moduleProgressSlice'; 
import progressUpdateReducer from './slices/updateProgressSlice'; 

// Set up the configuration for redux-persist
const persistConfig = {
  key: 'root', // The key is used for the storage key prefix.
  storage,     // Specify which storage to use.
  whitelist: ['auth', 'api','courses', 'modules', 'sections', 'fetchStatus', 'progress', 'sectionProgress', 'moduleProgress'] // Only 'auth' slice of the state will be persisted.
};

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  courses: coursesReducer,
  modules: modulesReducer,
  sections: sectionsReducer,
  progress: progressReducer, // Adding the progress reducer here
  sectionProgress: sectionProgressReducer, // Adding the section progress reducer
  moduleProgress: moduleProgressReducer, // Adding the module progress reducer
  progressUpdate: progressUpdateReducer, // Adding the progress update reducer
  // Add API service reducers with their dynamic paths
  [apiService.reducerPath]: apiService.reducer,
  [anotherApiService.reducerPath]: anotherApiService.reducer,
});

// Wrap the rootReducer with persistReducer using the persistConfig
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store with the persisted reducer and middleware
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Ensuring the persistence actions are allowed
      }
    }).concat(apiService.middleware).concat(anotherApiService.middleware),
});

// Create and export the persistor, which is used by PersistGate
export const persistor = persistStore(store);

export default store;
