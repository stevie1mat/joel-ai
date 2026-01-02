import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EnterScreenProps {
    onEnter: () => void;
}

export default function EnterScreen({ onEnter }: EnterScreenProps) {
    const router = useRouter();
    const [isEntering, setIsEntering] = useState(false);

    const handleEnterClick = () => {
        setIsEntering(true);
        setTimeout(() => {
            onEnter();
        }, 1000); // Shorter transition for the new style
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-between p-6 md:p-12 text-white font-sans overflow-hidden">
            {/* Navbar */}
            <div className="absolute top-0 left-0 right-0 p-8 md:p-12 flex items-center justify-between z-50 bg-gradient-to-b from-black/50 to-transparent">
                <div className="flex items-center gap-6">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase font-sans text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-400 drop-shadow-sm">
                        CHRONICLES
                    </h1>
                    <div className="hidden md:flex px-3 py-1 bg-white/5 backdrop-blur-md rounded-none border border-white/10">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 text-zinc-300">
                            <span className="w-1.5 h-1.5 bg-[#dc143c] rounded-full animate-pulse shadow-[0_0_10px_#dc143c]"></span>
                            LIVE
                        </span>
                    </div>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    {['Nexus', 'Vault', 'Prologue', 'About', 'Contacts'].map((item) => (
                        <Link
                            key={item}
                            href={`/${item.toLowerCase()}`}
                            className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-400 hover:text-[#D4AF37] transition-all duration-300 hover:scale-105 transform cursor-pointer"
                        >
                            {item}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main Content Layer - Centered vertically relative to screen */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-40 pointer-events-none">



                {/* HUGE Typography */}
                <div className="w-full flex flex-col items-center justify-center gap-[25vh]">
                    <h2 className="text-[10vw] leading-none font-black tracking-tighter uppercase opacity-100 pointer-events-none select-none">
                        REDEFINE
                    </h2>
                    <h2 className="text-[10vw] leading-none font-black tracking-tighter uppercase opacity-100 pointer-events-none select-none">
                        ADVENTURE
                    </h2>
                </div>
            </div>

            {/* Central Content Box */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center text-center p-32 w-[1400px]">
                <div className="flex flex-col items-center gap-2">
                    <p className="text-[#bfbfbf] text-base md:text-lg font-light tracking-[0.3em] leading-relaxed font-sans uppercase">
                        Enter the Metagame Layer.
                    </p>
                    <p className="text-white text-lg md:text-xl font-medium tracking-[0.4em] leading-relaxed font-[family-name:var(--font-cinzel)] uppercase mb-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                        Text-Based. AI-Visualized.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 mt-8">
                    {/* Background Story Button */}
                    <button
                        onClick={handleEnterClick}
                        className="group relative px-8 py-4 bg-black/40 text-[#D4AF37] border-2 border-[#D4AF37] rounded-none hover:rotate-0 transition-all duration-500 overflow-hidden min-w-[280px]"
                    >
                        <div className="absolute inset-0 w-0 bg-[#D4AF37] transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
                        <div className="flex items-center justify-center gap-4 relative z-10">
                            <span className="text-sm font-black tracking-[0.3em] uppercase group-hover:text-[#FDD768] transition-colors duration-300">
                                The Background Story
                            </span>
                            <svg className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        {/* Golden Glow Effect */}
                        <div className="absolute inset-0 rounded-none shadow-[0_0_30px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] transition-shadow duration-500"></div>
                    </button>

                    {/* Login Button */}
                    <button
                        onClick={() => router.push("/login")}
                        className="group relative px-8 py-4 bg-[#DC143C] text-white border-2 border-[#DC143C] rounded-none hover:bg-[#B22222] transition-all duration-500 overflow-hidden min-w-[200px] shadow-[0_0_15px_rgba(220,20,60,0.5)] hover:shadow-[0_0_25px_rgba(220,20,60,0.8)]"
                    >
                        <div className="flex items-center justify-center gap-4 relative z-10">
                            <span className="text-sm font-black tracking-[0.3em] uppercase transition-colors duration-300">
                                Login
                            </span>
                            <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                        </div>
                    </button>
                </div>
            </div>

            {/* Video Background (Already in parent, but duplicate check? No, parent renders video background behind this component isEnterScreen is just an overlay?)
               Wait, EnterScreen in page.tsx sits ON TOP of VideoBackground?
               Page.tsx:
               {!hasStarted && <EnterScreen ... />}
               Since EnterScreen handles its own background in the Reference Code I just read (it had a video tag inside), 
               BUT page.tsx ALSO has VideoBackground that plays when `hasStarted` is true.
               
               In the OLD code, EnterScreen had its OWN video background `/intro-home.mp4`.
               The user said "keep the background. video".
               So I should keep the specific video logic or assume the main one is enough?
               The old EnterScreen logic used a specific video. I will restore it to match the "Keep background" request.
            */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover -z-10 opacity-60"
            >
                <source src="/slides/slider-4.mp4" type="video/mp4" />
            </video>

            {/* Grain/Overlay */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none -z-10"></div>
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none -z-10 mix-blend-overlay"></div>
        </div>
    );
}
