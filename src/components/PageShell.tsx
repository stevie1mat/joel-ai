"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface PageShellProps {
    children: React.ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
    const pathname = usePathname();

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-between p-6 md:p-12 text-white font-sans overflow-hidden">
            {/* Navbar */}
            <div className="absolute top-0 left-0 right-0 p-8 md:p-12 flex items-center justify-between z-50 bg-gradient-to-b from-black/50 to-transparent">
                <div className="flex items-center gap-6">
                    <Link href="/" className="cursor-pointer">
                        <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase font-sans text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-400 drop-shadow-sm">
                            CHRONICLES
                        </h1>
                    </Link>
                    <div className="hidden md:flex px-3 py-1 bg-white/5 backdrop-blur-md rounded-none border border-white/10">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 text-zinc-300">
                            <span className="w-1.5 h-1.5 bg-[#dc143c] rounded-full animate-pulse shadow-[0_0_10px_#dc143c]"></span>
                            LIVE
                        </span>
                    </div>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    {['Nexus', 'Vault', 'Prologue', 'About', 'Contacts'].map((item) => {
                        const path = `/${item.toLowerCase()}`;
                        const isActive = pathname === path;
                        return (
                            <Link
                                key={item}
                                href={path}
                                className={`text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 transform ${isActive ? 'text-[#D4AF37]' : 'text-zinc-400 hover:text-[#D4AF37]'}`}
                            >
                                {item}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Content Slot */}
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-start pt-32 md:pt-40 overflow-y-auto no-scrollbar">
                {children}
            </div>

            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover -z-10 opacity-60"
            >
                <source src="/intro-home.mp4" type="video/mp4" />
            </video>

            {/* Grain/Overlay */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none -z-10"></div>
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none -z-10 mix-blend-overlay"></div>
        </div>
    );
}
