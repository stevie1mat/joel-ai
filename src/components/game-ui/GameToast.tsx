
import React, { useEffect } from 'react';

export type ToastType = 'error' | 'success' | 'info';

export interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export default function GameToast({ message, type, onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColors = {
        error: 'bg-red-500/10 border-red-500 text-red-500',
        success: 'bg-green-500/10 border-green-500 text-green-500',
        info: 'bg-blue-500/10 border-blue-500 text-blue-500'
    };

    const icons = {
        error: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        success: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    };

    return (
        <div className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-2xl animate-fadeUp z-[100] ${bgColors[type]}`}>
            {icons[type]}
            <span className="font-bold font-[family-name:var(--font-cinzel)] uppercase tracking-wide text-sm">
                {message}
            </span>
        </div>
    );
}
