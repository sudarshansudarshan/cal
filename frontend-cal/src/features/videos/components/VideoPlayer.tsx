import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideoDetails } from "../redux/videoThunks";
import { selectCurrentVideo, selectIsLoading, selectVideoError } from "../redux/videoSelectors";
import { AppDispatch } from "@/redux/store";

interface VideoPlayerProps {
    videoId: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const video = useSelector(selectCurrentVideo);
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectVideoError);

    useEffect(() => {
        dispatch(fetchVideoDetails(videoId));
    }, [dispatch, videoId]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!video) return <div>No video found</div>;

    return (
        <div>
            <video
                controls
                src={video.source}
                style={{ width: "100%", height: "auto" }}
                onPlay={() => console.log("Playing video:", video.id)}
            />
            <p>{video.transcript}</p>
        </div>
    );
};

export default VideoPlayer;
