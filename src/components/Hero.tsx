interface HeroProps {
    onStartAdventure?: () => void;
}

export default function Hero({ onStartAdventure }: HeroProps) {
    return (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 font-[family-name:var(--font-cinzel)]">
            {/* Subtle Background Overlay for contrast */}
            <div className="absolute inset-0 bg-black/30 -z-20"></div>

            {/* Radial Gradient Overlay matching EnterScreen */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,1)_10%,rgba(0,0,0,1)_15%,rgba(0,0,0,0.3)_100%)] -z-10 opacity-0 animate-flame-reveal [animation-delay:7s]"></div>

            <h1 className="text-2xl md:text-7xl font-bold text-white tracking-tighter mb-2 drop-shadow-lg flex flex-col gap-2 animate-fade-in-up">
                <span className="opacity-0 animate-flame-reveal [animation-delay:7s]">THE CHRONICLES OF ARN</span>
            </h1>
            <h2 className="text-3xl md:text-4xl text-[#ffb74d] font-bold mb-6 opacity-0 animate-flame-reveal [animation-delay:7.5s] tracking-widest font-[family-name:var(--font-fauna-one)]">
                Volume II: The Ashenspire Saga
            </h2>
            <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl font-medium drop-shadow-md opacity-0 animate-flame-reveal [animation-delay:7.5s] tracking-wide italic font-[family-name:var(--font-lato)]">
                "Survive the Erasure. A Text-Based RPG where AI Visualizes Every Choice."
            </p>

            <div className="flex flex-col md:flex-row gap-6 w-full max-w-md md:max-w-none justify-center opacity-0 animate-flame-reveal [animation-delay:7.5s]">
                <button
                    onClick={onStartAdventure}
                    className="bg-[#DC143C] hover:bg-[#B22222] text-white font-bold py-4 px-8 rounded-sm text-sm tracking-widest transition-transform hover:scale-105 shadow-[0_0_15px_rgba(220,20,60,0.5)] hover:shadow-[0_0_25px_rgba(220,20,60,0.8)] border border-[#DC143C]"
                >
                    [ START ADVENTURE ]
                </button>
                {/* <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-sm text-sm tracking-widest transition-transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg">
                    [ BROWSE THE ARCHIVES ]
                </button> */}
            </div>

            {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 text-xs tracking-widest uppercase opacity-0 animate-[fadeIn_1s_ease-out_2s_forwards]">
                Scroll
                <div className="h-16 w-[1px] bg-gray-600 mx-auto mt-4"></div>
            </div> */}
        </div>
    );
}
