"use client";

import { useState, useEffect } from "react";
import VideoBackground from "@/components/VideoBackground";
import Hero from "@/components/Hero";
import EnterScreen from "@/components/EnterScreen";

const VIDEOS = ["/hero-videoa.mp4", "/hero-videob.mp4"];

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [videoSrc, setVideoSrc] = useState(VIDEOS[0]);
  const [isClient, setIsClient] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const lastIndex = parseInt(localStorage.getItem("lastVideoIndex") || "-1", 10);
    const nextIndex = (lastIndex + 1) % VIDEOS.length;
    setVideoSrc(VIDEOS[nextIndex]);
    localStorage.setItem("lastVideoIndex", nextIndex.toString());
  }, []);

  const handleVideoStop = () => {
    setShowContent(true);
  };

  const handleStart = () => {
    setHasStarted(true);
  };

  if (!isClient) return null; // Prevent hydration mismatch

  return (
    <main className="relative min-h-screen overflow-hidden font-[family-name:var(--font-geist-sans)]">
      <VideoBackground
        videoSrc={videoSrc}
        startTime={1}
        stopTime={9}
        isPlaying={hasStarted}
        onVideoStop={handleVideoStop}
      />

      {!hasStarted && (
        <EnterScreen onEnter={handleStart} />
      )}

      <div className={`transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0"}`}>
        <Hero />
      </div>
    </main>
  );
}
