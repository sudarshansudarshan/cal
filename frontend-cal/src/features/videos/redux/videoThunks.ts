import { AppDispatch } from "../../../redux/store";
import { fetchVideo } from "../api/fetchVideo";
import { startLoading, setVideo, setError } from "./videoSlice";

/**
 * Async thunk to fetch video details.
 * @param videoId - ID of the video to fetch.
 */
export const fetchVideoDetails =
  (videoId: number) => async (dispatch: AppDispatch) => {
    dispatch(startLoading());
    try {
      const video = await fetchVideo(videoId);
      dispatch(setVideo(video));
    } catch {
      dispatch(setError("Failed to fetch video details."));
    }
  };