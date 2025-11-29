import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 text-white">
            <div className="flex items-center gap-8">
                <Link href="/" className="text-2xl font-bold tracking-wider">
                    AI DUNGEON
                </Link>
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
                    <Link href="/" className="hover:text-white transition-colors flex items-center gap-2">
                        <span className="text-yellow-500">🏠</span> Home
                    </Link>
                    <Link href="/updates" className="hover:text-white transition-colors flex items-center gap-2">
                        <span>🔄</span> Updates
                    </Link>
                </div>
            </div>
            <button className="bg-[#ffb74d] hover:bg-[#ffa726] text-black font-bold py-2 px-6 rounded-sm text-sm tracking-wide transition-colors">
                SIGN IN
            </button>
        </nav>
    );
}
