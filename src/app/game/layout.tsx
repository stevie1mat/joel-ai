
import React from 'react';
import { Cinzel, Inter } from 'next/font/google';

const cinzel = Cinzel({
    subsets: ['latin'],
    variable: '--font-cinzel',
    display: 'swap',
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export default function GameUILayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${cinzel.variable} ${inter.variable} font-sans bg-black text-amber-50 h-screen w-screen overflow-hidden selection:bg-amber-500/30`}>
            {children}
        </div>
    );
}
