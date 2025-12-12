import PageShell from "@/components/PageShell";

export default function AboutPage() {
    return (
        <PageShell>
            <div className="flex flex-col items-center text-center max-w-4xl px-6 pb-20">
                <h2 className="text-[12vw] md:text-[6rem] leading-none font-black tracking-tighter uppercase text-white drop-shadow-2xl mb-4">
                    ABOUT
                </h2>
                <div className="w-24 h-1 bg-[#D4AF37] mb-8"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8 w-full text-left">
                    <div className="space-y-4">
                        <h3 className="text-[#D4AF37] text-2xl font-bold tracking-widest uppercase">The Mission</h3>
                        <p className="text-zinc-400 text-sm leading-loose tracking-wide">
                            To redefine the boundaries of digital ownership and immersive storytelling. Chronicles is not just a game; it is a living ecosystem powered by the community and secured by blockchain technology.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-[#D4AF37] text-2xl font-bold tracking-widest uppercase">The Vision</h3>
                        <p className="text-zinc-400 text-sm leading-loose tracking-wide">
                            A world where every action has consequence, every item has value, and the player is the sole owner of their destiny. We are building the infrastructure for the next generation of the Play Economy.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-[#D4AF37] text-2xl font-bold tracking-widest uppercase">The Studio</h3>
                        <p className="text-zinc-400 text-sm leading-loose tracking-wide">
                            Forged by a collective of industry veterans, artists, and engineers from across the globe, united by a singular purpose: to craft experiences that resonate beyond the screen.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-[#D4AF37] text-2xl font-bold tracking-widest uppercase">Join Us</h3>
                        <p className="text-zinc-400 text-sm leading-loose tracking-wide">
                            The journey is just beginning. Become a part of the foundation and help shape the world of Chronicles.
                        </p>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
