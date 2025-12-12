import PageShell from "@/components/PageShell";

export default function ContactsPage() {
    return (
        <PageShell>
            <div className="flex flex-col items-center text-center max-w-4xl px-6 pb-20">
                <h2 className="text-[12vw] md:text-[6rem] leading-none font-black tracking-tighter uppercase text-white drop-shadow-2xl mb-4">
                    CONTACTS
                </h2>
                <div className="w-24 h-1 bg-[#D4AF37] mb-8"></div>

                <p className="text-[#bfbfbf] text-sm md:text-xl font-light tracking-[0.2em] leading-relaxed font-sans uppercase mb-12">
                    Establish a secure line.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-6 w-full">
                    {[
                        { name: 'X / Twitter', link: '#' },
                        { name: 'Discord', link: '#' },
                        { name: 'Telegram', link: '#' },
                        { name: 'Support', link: '#' }
                    ].map((channel) => (
                        <a
                            key={channel.name}
                            href={channel.link}
                            className="group flex flex-col items-center justify-center w-40 h-40 bg-black/40 border border-white/10 hover:border-[#D4AF37] hover:bg-black/60 transition-all duration-300"
                        >
                            <span className="text-zinc-500 group-hover:text-[#D4AF37] transition-colors mb-2">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm1.03-3.72l-.4.38c-.35.33-.6.75-.6 1.18V15h-2v-.86c0-.85.4-1.64 1.05-2.18l.8-.7c.36-.31.55-.76.55-1.26 0-.8-.69-1.5-1.5-1.5-.47 0-.89.2-1.18.52-.16.18-.32.33-.52.55L8.2 8.52c.44-.73 1.15-1.31 2.05-1.46.3-.05.61-.07.93-.07 1.86 0 3.4 1.34 3.65 3.1.06.41.02.82-.12 1.21-.2.53-.59.98-1.08 1.4z" />
                                </svg>
                            </span>
                            <span className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-300 group-hover:text-white transition-colors">
                                {channel.name}
                            </span>
                        </a>
                    ))}
                </div>

                <div className="mt-12 p-8 border-t border-white/10 w-full">
                    <p className="text-zinc-600 text-xs tracking-widest uppercase">
                        Encrypted // Secure // 2025 Chronicles
                    </p>
                </div>
            </div>
        </PageShell>
    );
}
