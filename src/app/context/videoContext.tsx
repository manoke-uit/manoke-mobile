import React, { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Video {
  id: string;
  title: string;
  artist: string;
  status: "public" | "private";
}

interface VideoContextType {
  videos: Video[];
  addVideo: (video: Video) => void;
  updateVideoStatus: (id: string, status: "public" | "private") => void;
  removeVideo: (id: string) => void;
}

const VideoContext = createContext<VideoContextType>({
  videos: [],
  addVideo: () => {},
  updateVideoStatus: () => {},
  removeVideo: () => {},
});

export const VideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [videos, setVideos] = useState<Video[]>([
    { id: uuidv4(), title: "My First Video", artist: "Admin", status: "private" },
    { id: uuidv4(), title: "Live Performance", artist: "artistX", status: "public" },
    { id: uuidv4(), title: "Music Video", artist: "ArtistY", status: "private" },
    { id: uuidv4(), title: "Dance Reel", artist: "Admin", status: "public" },
  ]);

  const addVideo = (video: Video) => {
    console.log("Adding video:", video);
    setVideos((prev) => {
      const newVideos = [...prev, { ...video, id: uuidv4() }];
      console.log("Updated videos:", newVideos);
      return newVideos;
    });
  };

  const updateVideoStatus = (id: string, status: "public" | "private") => {
    console.log(`Updating status for video ${id} to ${status}`);
    setVideos((prev) =>
      prev.map((video) =>
        video.id === id ? { ...video, status } : video
      )
    );
  };

  const removeVideo = (id: string) => {
    console.log(`Removing video ${id}`);
    setVideos((prev) => prev.filter((video) => video.id !== id));
  };

  return (
    <VideoContext.Provider value={{ videos, addVideo, updateVideoStatus, removeVideo }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideos = () => useContext(VideoContext);