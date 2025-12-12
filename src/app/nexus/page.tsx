import PageShell from "@/components/PageShell";
import Link from "next/link";

export default function NexusPage() {
    return (
        <PageShell>
            <div className="flex flex-col items-center text-center max-w-6xl px-6 pb-20 w-full">

                {/* Header Section */}
                <h2 className="text-[12vw] md:text-[6rem] leading-none font-black tracking-tighter uppercase text-white drop-shadow-2xl mb-4">
                    NEXUS
                </h2>
                <div className="w-24 h-1 bg-[#D4AF37] mb-8"></div>

                <p className="text-[#bfbfbf] text-sm md:text-xl font-light tracking-[0.2em] leading-relaxed font-sans uppercase mb-12 max-w-3xl">
                    The central neural network of the Chronicles ecosystem. All streams converge here.
                </p>

                {/* System Status Bar */}
                <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 border-y border-white/10 py-4 bg-black/20">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">System Status</span>
                        <span className="text-[#D4AF37] font-bold tracking-widest text-sm flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> ONLINE
                        </span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">Active Nodes</span>
                        <span className="text-white font-bold tracking-widest text-sm">8,492</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">Network Load</span>
                        <span className="text-white font-bold tracking-widest text-sm">34%</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">Last Sync</span>
                        <span className="text-white font-bold tracking-widest text-sm">00:04:21</span>
                    </div>
                </div>

                {/* Main Grid Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
                    {/* Factions */}
                    <div className="group p-8 border border-white/10 bg-black/40 backdrop-blur-sm hover:border-[#D4AF37] transition-all duration-500 flex flex-col items-center text-left relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                        <h3 className="text-2xl font-black tracking-widest mb-2 text-white group-hover:text-[#D4AF37] transition-colors">FACTIONS</h3>
                        <p className="text-zinc-400 text-xs leading-loose uppercase tracking-wide mb-6 text-center">
                            The balance of power is shifting. Choose your allegiance wisely.
                        </p>
                        <ul className="text-left w-full space-y-3 px-4">
                            <li className="flex justify-between items-center text-xs tracking-widest text-zinc-500 border-b border-white/5 pb-2">
                                <span>Syndicate</span>
                                <span className="text-[#dc143c]">DOMINANT</span>
                            </li>
                            <li className="flex justify-between items-center text-xs tracking-widest text-zinc-500 border-b border-white/5 pb-2">
                                <span>Order</span>
                                <span className="text-yellow-500">RISING</span>
                            </li>
                            <li className="flex justify-between items-center text-xs tracking-widest text-zinc-500 border-b border-white/5 pb-2">
                                <span>Keepers</span>
                                <span className="text-zinc-600">STABLE</span>
                            </li>
                        </ul>
                        <Link href="/factions" className="mt-8 px-6 py-2 border border-white/20 text-[10px] tracking-[0.2em] uppercase text-center text-white hover:bg-white hover:text-black transition-all w-full block">
                            View Factions
                        </Link>
                    </div>

                    {/* Market */}
                    <div className="group p-8 border border-white/10 bg-black/40 backdrop-blur-sm hover:border-[#D4AF37] transition-all duration-500 flex flex-col items-center text-left relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                        <h3 className="text-2xl font-black tracking-widest mb-2 text-white group-hover:text-[#D4AF37] transition-colors">MARKET</h3>
                        <p className="text-zinc-400 text-xs leading-loose uppercase tracking-wide mb-6 text-center">
                            Global liquidity protocol. Artifacts, Land, and Raw Data.
                        </p>
                        <div className="w-full grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white/5 p-3 text-center">
                                <span className="block text-[10px] text-zinc-500 tracking-widest mb-1">VOLUME</span>
                                <span className="block text-sm font-bold text-white tracking-widest">245 ETH</span>
                            </div>
                            <div className="bg-white/5 p-3 text-center">
                                <span className="block text-[10px] text-zinc-500 tracking-widest mb-1">FLOOR</span>
                                <span className="block text-sm font-bold text-white tracking-widest">0.8 ETH</span>
                            </div>
                        </div>
                        <button className="mt-auto px-6 py-2 border border-white/20 text-[10px] tracking-[0.2em] uppercase text-white hover:bg-white hover:text-black transition-all w-full">
                            Access Exchange
                        </button>
                    </div>

                    {/* Forum */}
                    <div className="group p-8 border border-white/10 bg-black/40 backdrop-blur-sm hover:border-[#D4AF37] transition-all duration-500 flex flex-col items-center text-left relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                        <h3 className="text-2xl font-black tracking-widest mb-2 text-white group-hover:text-[#D4AF37] transition-colors">FORUM</h3>
                        <p className="text-zinc-400 text-xs leading-loose uppercase tracking-wide mb-6 text-center">
                            Secure channels for governance and strategy.
                        </p>
                        <div className="w-full space-y-3 px-2">
                            <div className="flex items-center gap-3 text-left">
                                <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></div>
                                <span className="text-[10px] md:text-xs text-zinc-300 tracking-wider truncate">Proposal 104: Expansion Protocol</span>
                            </div>
                            <div className="flex items-center gap-3 text-left">
                                <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full"></div>
                                <span className="text-[10px] md:text-xs text-zinc-500 tracking-wider truncate">General: New sector discovered</span>
                            </div>
                            <div className="flex items-center gap-3 text-left">
                                <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full"></div>
                                <span className="text-[10px] md:text-xs text-zinc-500 tracking-wider truncate">Trading: Price impact analysis</span>
                            </div>
                        </div>
                        <button className="mt-8 px-6 py-2 border border-white/20 text-[10px] tracking-[0.2em] uppercase text-white hover:bg-white hover:text-black transition-all w-full">
                            Enter Channels
                        </button>
                    </div>
                </div>

                {/* Live Feed */}
                <div className="w-full border border-white/5 bg-black/60 p-6 md:p-8 text-left">
                    <h4 className="text-[#D4AF37] text-sm font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
                        <span className="w-2 h-2 bg-[#dc143c] animate-pulse"></span>
                        Live Feed
                    </h4>
                    <div className="space-y-4 font-mono text-xs md:text-sm text-zinc-400">
                        <div className="flex gap-4">
                            <span className="text-zinc-600 select-none">[14:02:45]</span>
                            <span className="text-white">User <span className="text-[#D4AF37]">@Kael_99</span> acquired [Obsidian Shard]</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-zinc-600 select-none">[14:02:32]</span>
                            <span className="text-white">New faction territory contested in Sector 7.</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-zinc-600 select-none">[14:01:15]</span>
                            <span className="text-white">System Update: Protocol v2.4.1 deployed successfully.</span>
                        </div>
                    </div>
                </div>

            </div>
        </PageShell>
    );
}
