import { calSDK } from "../../../lib/sdk/calSDK";
import { VideoDetails } from "../types/VideoTypes";

/**
 * Fetch video details by video ID.
 * @param videoId - ID of the video to fetch.
 * @returns VideoDetails
 */
export const fetchVideo = async (videoId: number): Promise<VideoDetails> => {
  const response = await calSDK.core.getVideo(videoId);
  return response;
};
