import PageShell from "@/components/PageShell";

export default function FactionsPage() {
    return (
        <PageShell>
            <div className="flex flex-col items-center text-center max-w-5xl px-6 pb-20 w-full">

                <h2 className="text-[12vw] md:text-[6rem] leading-none font-black tracking-tighter uppercase text-white drop-shadow-2xl mb-4">
                    FACTIONS
                </h2>
                <div className="w-24 h-1 bg-[#D4AF37] mb-12"></div>

                <p className="text-[#bfbfbf] text-sm md:text-xl font-light tracking-[0.2em] leading-relaxed font-sans uppercase mb-16 max-w-3xl">
                    In the chaos of the Metagame, survival requires alliance. Choose your path.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">

                    {/* The Syndicate */}
                    <div className="group relative border border-white/10 bg-black/40 backdrop-blur-sm p-8 hover:border-[#dc143c] transition-all duration-500 flex flex-col items-center text-center overflow-hidden">
                        <div className="absolute top-0 w-full h-1 bg-[#dc143c] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="text-3xl font-black tracking-widest text-white mb-2 group-hover:text-[#dc143c] transition-colors">SYNDICATE</h3>
                        <span className="text-[10px] tracking-[0.3em] uppercase text-[#dc143c] mb-6 block">Power . Control . Speed</span>

                        <p className="text-zinc-400 text-xs leading-loose tracking-wide mb-8">
                            Born from the dark web slums, the Syndicate believes power belongs to those bold enough to take it. They value raw strength, high-frequency trading, and aggressive expansion.
                        </p>

                        <div className="mt-auto w-full border-t border-white/5 pt-4">
                            <span className="text-[10px] text-zinc-600 uppercase tracking-widest block mb-2">Specialty</span>
                            <span className="text-white text-xs font-bold tracking-wider">Market Manipulation</span>
                        </div>
                    </div>

                    {/* The Order */}
                    <div className="group relative border border-white/10 bg-black/40 backdrop-blur-sm p-8 hover:border-[#D4AF37] transition-all duration-500 flex flex-col items-center text-center overflow-hidden">
                        <div className="absolute top-0 w-full h-1 bg-[#D4AF37] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="text-3xl font-black tracking-widest text-white mb-2 group-hover:text-[#D4AF37] transition-colors">ORDER</h3>
                        <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] mb-6 block">Structure . Law . Governance</span>

                        <p className="text-zinc-400 text-xs leading-loose tracking-wide mb-8">
                            Architects of the new world. The Order seeks to impose stability upon the volatility of the Chronicles. They are the lawmakers, the validators, and the guardians of the chain.
                        </p>

                        <div className="mt-auto w-full border-t border-white/5 pt-4">
                            <span className="text-[10px] text-zinc-600 uppercase tracking-widest block mb-2">Specialty</span>
                            <span className="text-white text-xs font-bold tracking-wider">Protocol Security</span>
                        </div>
                    </div>

                    {/* The Keepers */}
                    <div className="group relative border border-white/10 bg-black/40 backdrop-blur-sm p-8 hover:border-[#38bdf8] transition-all duration-500 flex flex-col items-center text-center overflow-hidden">
                        <div className="absolute top-0 w-full h-1 bg-[#38bdf8] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="text-3xl font-black tracking-widest text-white mb-2 group-hover:text-[#38bdf8] transition-colors">KEEPERS</h3>
                        <span className="text-[10px] tracking-[0.3em] uppercase text-[#38bdf8] mb-6 block">Knowledge . History . Preservation</span>

                        <p className="text-zinc-400 text-xs leading-loose tracking-wide mb-8">
                            Observers of the timeline. The Keepers hoards data and ancient artifacts. They do not seek to rule, but to remember. Their vaults contain secrets that could topple empires.
                        </p>

                        <div className="mt-auto w-full border-t border-white/5 pt-4">
                            <span className="text-[10px] text-zinc-600 uppercase tracking-widest block mb-2">Specialty</span>
                            <span className="text-white text-xs font-bold tracking-wider">Data Archival</span>
                        </div>
                    </div>

                </div>
            </div>
        </PageShell>
    );
}
