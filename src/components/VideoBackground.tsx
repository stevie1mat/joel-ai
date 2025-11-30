"use client";

import { useEffect, useRef } from "react";

interface VideoBackgroundProps {
  stopTime?: number; // Time in seconds to stop the video
  startTime?: number; // Time in seconds to start the video
  videoSrc: string;
  isPlaying: boolean;
  onVideoStop?: () => void;
}

export default function VideoBackground({ stopTime, startTime = 0, videoSrc, isPlaying, onVideoStop }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const initializedRef = useRef(false);

  // Effect to handle start time initialization
  useEffect(() => {
    const video = videoRef.current;
    if (!video || initializedRef.current) return;

    if (startTime > 0) {
      video.currentTime = startTime;
    }
    initializedRef.current = true;
  }, [startTime]);

  // Effect to handle playback state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch((error) => {
        console.error("Video playback failed:", error);
      });
    } else {
      video.pause();
    }
  }, [isPlaying]);

  // Effect to handle stop time logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stopTime) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= stopTime) {
        video.pause();
        if (onVideoStop) onVideoStop();
      }
    };

    const handleEnded = () => {
      if (onVideoStop) onVideoStop();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [stopTime, onVideoStop]);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <video
        ref={videoRef}
        key={videoSrc} // Force re-render when source changes
        loop={!stopTime} // Don't loop if we are stopping
        playsInline
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
    </div>
  );
}
