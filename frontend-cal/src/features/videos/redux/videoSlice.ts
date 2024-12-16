import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VideoDetails } from "../types/VideoTypes";

interface VideoState {
  currentVideo: VideoDetails | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: VideoState = {
  currentVideo: null,
  isLoading: false,
  error: null,
};

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    setVideo(state, action: PayloadAction<VideoDetails>) {
      state.currentVideo = action.payload;
      state.isLoading = false;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { startLoading, setVideo, setError } = videoSlice.actions;
export default videoSlice.reducer;
