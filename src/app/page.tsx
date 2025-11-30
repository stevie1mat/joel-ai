"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VideoBackground from "@/components/VideoBackground";
import Hero from "@/components/Hero";
import EnterScreen from "@/components/EnterScreen";
import StorySequence from "@/components/StorySequence";

const VIDEOS = ["/hero-videoa.mp4", "/hero-videob.mp4"];

export default function Home() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const [videoSrc, setVideoSrc] = useState(VIDEOS[0]);
  const [isClient, setIsClient] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [showGame, setShowGame] = useState(false);

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
    setShowStory(true);
  };

  const handleStartAdventure = () => {
    router.push("/login");
  };

  const handleStoryComplete = () => {
    setShowStory(false);
    setShowContent(true);
  };

  if (!isClient) return null; // Prevent hydration mismatch

  if (showGame) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-[family-name:var(--font-cinzel)]">
        <h1 className="text-4xl animate-pulse">GAME UI PLACEHOLDER</h1>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden font-[family-name:var(--font-geist-sans)]">
      {/* Always mount VideoBackground once started - it sits behind everything */}
      {hasStarted && (
        <VideoBackground
          videoSrc={videoSrc}
          startTime={1}
          isPlaying={!showStory}
          onVideoStop={handleVideoStop}
        />
      )}

      {!hasStarted && (
        <EnterScreen onEnter={handleStart} />
      )}

      {showStory && (
        <StorySequence onComplete={handleStoryComplete} />
      )}

      {showContent && !showStory && (
        <Hero onStartAdventure={handleStartAdventure} />
      )}
    </main>
  );
}
