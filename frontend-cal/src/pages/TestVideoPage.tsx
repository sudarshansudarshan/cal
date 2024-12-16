import React from "react";
import BasicLayout from "../layouts/BasicLayout/BasicLayout";
import VideoPlayer from "../features/videos/components/VideoPlayer";

const TestVideoPage: React.FC = () => {
  return (
    <BasicLayout>
      <h2 className="text-2xl font-bold mb-4">Video Player Test Page</h2>
      <div className="bg-gray-100 p-4 rounded shadow">
        <VideoPlayer videoId={1} />
      </div>
    </BasicLayout>
  );
};

export default TestVideoPage;
