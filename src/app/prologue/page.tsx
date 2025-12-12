import PageShell from "@/components/PageShell";

export default function ProloguePage() {
    return (
        <PageShell>
            <div className="flex flex-col items-center text-center max-w-3xl px-6 pb-20">
                <h2 className="text-[12vw] md:text-[6rem] leading-none font-black tracking-tighter uppercase text-white drop-shadow-2xl mb-4">
                    PROLOGUE
                </h2>
                <div className="w-24 h-1 bg-[#D4AF37] mb-12"></div>

                <div className="space-y-12 text-justify md:text-center">
                    <p className="text-zinc-300 text-sm md:text-lg font-light tracking-[0.15em] leading-loose font-sans">
                        The year was 2140. The Great Disconnect had left the physical world in fragments, severed from the data streams that once powered civilization. In the silence, a new layer of reality was discovered—a hidden frequency within the static.
                    </p>
                    <p className="text-zinc-300 text-sm md:text-lg font-light tracking-[0.15em] leading-loose font-sans">
                        They called it the <span className="text-white font-bold">Metagame</span>. A plane of existence where value is not mined from the earth, but forged in play. Where sovereignty is code, and your legacy is immutable.
                    </p>
                    <p className="text-zinc-300 text-sm md:text-lg font-light tracking-[0.15em] leading-loose font-sans">
                        You are one of the awakened. An architect of the new era. The Chronicles are not just history—they are the future we build together.
                    </p>
                </div>

                <div className="mt-16 opacity-50">
                    <svg className="w-8 h-8 text-[#D4AF37] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>
        </PageShell>
    );
}
