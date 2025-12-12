import PageShell from "@/components/PageShell";

export default function VaultPage() {
    return (
        <PageShell>
            <div className="flex flex-col items-center text-center max-w-4xl px-6 pb-20">
                <h2 className="text-[12vw] md:text-[6rem] leading-none font-black tracking-tighter uppercase text-white drop-shadow-2xl mb-4">
                    VAULT
                </h2>
                <div className="w-24 h-1 bg-[#D4AF37] mb-8"></div>

                <p className="text-[#bfbfbf] text-sm md:text-xl font-light tracking-[0.2em] leading-relaxed font-sans uppercase max-w-2xl mb-12">
                    A timeless repository for your digital legacy. Secure your artifacts within the immutable chain.
                </p>

                <div className="w-full border-t border-b border-white/10 py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-4xl md:text-5xl font-black text-[#D4AF37]">0</span>
                            <span className="text-xs tracking-[0.3em] uppercase text-zinc-500">Artifacts</span>
                        </div>
                        <div className="w-full md:w-px h-px md:h-12 bg-white/10"></div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-4xl md:text-5xl font-black text-[#D4AF37]">0.00</span>
                            <span className="text-xs tracking-[0.3em] uppercase text-zinc-500">Value (ETH)</span>
                        </div>
                        <div className="w-full md:w-px h-px md:h-12 bg-white/10"></div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-4xl md:text-5xl font-black text-[#D4AF37]">NO</span>
                            <span className="text-xs tracking-[0.3em] uppercase text-zinc-500">Rank</span>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <button className="px-8 py-3 border border-white/20 text-xs tracking-[0.2em] uppercase text-zinc-300 hover:text-white hover:border-white transition-all">
                        Connect Wallet to View
                    </button>
                </div>
            </div>
        </PageShell>
    );
}
