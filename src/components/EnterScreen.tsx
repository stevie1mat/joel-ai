import { useState, useEffect } from "react";

interface EnterScreenProps {
    onEnter: () => void;
}

export default function EnterScreen({ onEnter }: EnterScreenProps) {
    const [isEntering, setIsEntering] = useState(false);

    const handleEnterClick = () => {
        setIsEntering(true);
        setTimeout(() => {
            onEnter();
        }, 4000); // 4 seconds for the text to be read
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="/intro-home.mp4" type="video/mp4" />
            </video>

            {/* Radial Gradient Overlay: Black center for readability, fading to light overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,1)_10%,rgba(0,0,0,1)_15%,rgba(0,0,0,0.3)_100%)]"></div>

            <div className="relative z-10 flex flex-col items-center gap-8 text-center px-4">
                {!isEntering ? (
                    <>
                        <h2 className="text-2xl md:text-3xl text-gray-400 font-[family-name:var(--font-cinzel)] tracking-[0.2em] uppercase opacity-80 animate-fade-in">
                            Welcome Traveler
                        </h2>

                        <button
                            onClick={handleEnterClick}
                            className="group relative px-12 py-6 bg-transparent overflow-hidden transition-all duration-300 hover:scale-105"
                        >
                            {/* Button Border / Glow Container */}
                            <div className="absolute inset-0 border-2 border-[#ffb74d] opacity-60 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_15px_rgba(255,183,77,0.3)] group-hover:shadow-[0_0_30px_rgba(255,183,77,0.6)]"></div>

                            {/* Inner Fill */}
                            <div className="absolute inset-0 bg-[#ffb74d]/5 group-hover:bg-[#ffb74d]/10 transition-colors duration-300"></div>

                            {/* Text */}
                            <span className="relative text-3xl md:text-4xl font-bold text-[#ffb74d] font-[family-name:var(--font-cinzel)] tracking-widest drop-shadow-md group-hover:text-white transition-colors duration-300">
                                ENTER WORLD
                            </span>
                        </button>

                        <p className="text-sm text-gray-600 font-[family-name:var(--font-cinzel)] tracking-widest mt-4 animate-pulse">
                            Click to Begin Your Journey
                        </p>
                    </>
                ) : (
                    <div className="animate-[fadeIn_1s_ease-out_forwards,fadeOut_1s_ease-in_3s_forwards]">
                        <p className="text-2xl md:text-3xl text-[#ffb74d] font-[family-name:var(--font-cinzel)] tracking-widest drop-shadow-[0_0_10px_rgba(255,183,77,0.5)] italic">
                            This is how it all started...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
