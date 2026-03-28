'use client';

import React from 'react';

interface CharacterSpriteProps {
    posX: number;
    isWalking: boolean;
    facingRight: boolean;
    characterClass?: string;
}

export default function CharacterSprite({
    posX,
    isWalking,
    facingRight,
    characterClass = 'Rogue',
}: CharacterSpriteProps) {
    const classAccent =
        characterClass === 'Mage' ? '#7c6aef'
            : characterClass === 'Warrior' ? '#e74c3c'
                : characterClass === 'Cleric' ? '#f1c40f'
                    : '#ffb74d';

    return (
        <div
            className="absolute pointer-events-none"
            style={{
                left: `${posX}%`,
                bottom: '4%',
                transform: `translateX(-50%) scaleX(${facingRight ? 1 : -1})`,
                transition: 'left 0.06s linear',
                zIndex: 5,
            }}
        >
            {/* Walk bob */}
            <div
                style={{
                    animation: isWalking
                        ? 'char-walk-bob 0.45s ease-in-out infinite'
                        : 'char-idle-sway 4s ease-in-out infinite',
                }}
            >
                <svg
                    width="120"
                    height="220"
                    viewBox="0 0 180 320"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                        filter: `drop-shadow(0 4px 30px rgba(0,0,0,0.9)) drop-shadow(0 0 8px rgba(0,0,0,0.7))`,
                        opacity: 0.92,
                    }}
                >
                    <defs>
                        <linearGradient id="cloakG" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0e0e18" />
                            <stop offset="100%" stopColor="#080810" />
                        </linearGradient>
                        <linearGradient id="bootG" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1a150e" />
                            <stop offset="100%" stopColor="#0d0a06" />
                        </linearGradient>
                        <radialGradient id="auraG" cx="50%" cy="70%" r="50%">
                            <stop offset="0%" stopColor={classAccent} stopOpacity="0.08" />
                            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </radialGradient>
                    </defs>

                    {/* Subtle ambient aura */}
                    <ellipse cx="90" cy="220" rx="70" ry="120" fill="url(#auraG)">
                        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" />
                    </ellipse>

                    {/* ── CAPE ── */}
                    <path
                        d="M48 82 C42 130, 30 200, 25 270 C25 285, 38 292, 55 286 L90 276 L125 286 C142 292, 155 285, 155 270 C150 200, 138 130, 132 82"
                        fill="url(#cloakG)"
                    >
                        <animate
                            attributeName="d"
                            values="
                                M48 82 C42 130, 30 200, 25 270 C25 285, 38 292, 55 286 L90 276 L125 286 C142 292, 155 285, 155 270 C150 200, 138 130, 132 82;
                                M48 82 C46 130, 34 200, 32 270 C32 288, 42 295, 58 290 L90 278 L122 290 C138 295, 150 288, 148 270 C146 200, 134 130, 132 82;
                                M48 82 C42 130, 30 200, 25 270 C25 285, 38 292, 55 286 L90 276 L125 286 C142 292, 155 285, 155 270 C150 200, 138 130, 132 82
                            "
                            dur={isWalking ? '0.9s' : '5s'}
                            repeatCount="indefinite"
                        />
                    </path>
                    {/* Cape inner fold */}
                    <path d="M58 100 C56 150, 48 220, 45 268 L90 255 L135 268 C132 220, 124 150, 122 100"
                        fill="#060609" opacity="0.5" />
                    <line x1="90" y1="88" x2="90" y2="268" stroke="#12121a" strokeWidth="1" opacity="0.5" />
                    <path d="M68 108 C66 165, 58 225, 54 264" stroke="#10101a" strokeWidth="0.7" opacity="0.3" fill="none" />
                    <path d="M112 108 C114 165, 122 225, 126 264" stroke="#10101a" strokeWidth="0.7" opacity="0.3" fill="none" />

                    {/* ── LEGS ── */}
                    <g>
                        {isWalking && (
                            <animateTransform attributeName="transform" type="rotate"
                                values="-14 75 218;14 75 218;-14 75 218" dur="0.45s" repeatCount="indefinite" />
                        )}
                        <path d="M66 218 L60 258 L74 258 L78 218" fill="#0c0c16" />
                        <ellipse cx="68" cy="258" rx="8" ry="5" fill="#141420" />
                        <path d="M60 258 L58 292 L76 292 L74 258" fill="#0a0a14" />
                        <path d="M56 288 L54 308 C54 314, 60 318, 78 318 C82 318, 82 312, 78 308 L78 288"
                            fill="url(#bootG)" />
                        <rect x="57" y="294" width="19" height="2" rx="1" fill="#1a150e" />
                    </g>
                    <g>
                        {isWalking && (
                            <animateTransform attributeName="transform" type="rotate"
                                values="14 105 218;-14 105 218;14 105 218" dur="0.45s" repeatCount="indefinite" />
                        )}
                        <path d="M102 218 L96 258 L110 258 L114 218" fill="#0c0c16" />
                        <ellipse cx="104" cy="258" rx="8" ry="5" fill="#141420" />
                        <path d="M96 258 L94 292 L112 292 L110 258" fill="#0a0a14" />
                        <path d="M92 288 L90 308 C90 314, 96 318, 114 318 C118 318, 118 312, 114 308 L114 288"
                            fill="url(#bootG)" />
                        <rect x="93" y="294" width="19" height="2" rx="1" fill="#1a150e" />
                    </g>

                    {/* ── TORSO ── */}
                    <path d="M55 78 C52 90, 50 140, 55 218 L125 218 C130 140, 128 90, 125 78 Z" fill="#10101c" />
                    {/* Back armor plate */}
                    <path d="M68 88 L68 178 L112 178 L112 88 C107 83, 97 80, 90 80 C83 80, 73 83, 68 88Z"
                        fill="#161625" opacity="0.8" />
                    <line x1="90" y1="83" x2="90" y2="198" stroke="#0c0c18" strokeWidth="1.5" opacity="0.6" />

                    {/* ── BELT ── */}
                    <rect x="52" y="193" width="76" height="8" rx="2" fill="#1a150e" />
                    <rect x="85" y="191" width="10" height="12" rx="2" fill={classAccent} opacity="0.35">
                        <animate attributeName="opacity" values="0.25;0.45;0.25" dur="2s" repeatCount="indefinite" />
                    </rect>
                    <rect x="58" y="195" width="10" height="9" rx="2" fill="#120e08" />
                    <rect x="112" y="195" width="10" height="9" rx="2" fill="#120e08" />

                    {/* ── SHOULDERS ── */}
                    <ellipse cx="49" cy="86" rx="16" ry="11" fill="#161625" stroke="#1e1e30" strokeWidth="0.5" />
                    <ellipse cx="131" cy="86" rx="16" ry="11" fill="#161625" stroke="#1e1e30" strokeWidth="0.5" />

                    {/* ── ARMS ── */}
                    <g>
                        {isWalking && (
                            <animateTransform attributeName="transform" type="rotate"
                                values="10 49 93;-10 49 93;10 49 93" dur="0.45s" repeatCount="indefinite" />
                        )}
                        <path d="M35 93 L28 140 L24 183 L38 184 L40 142 L44 98" fill="#0c0c16" />
                        <rect x="24" y="153" width="15" height="14" rx="3" fill="#141420" />
                        <path d="M24 180 L22 193 C22 197, 26 199, 36 199 L40 193 L38 180" fill="#0d0a06" />
                    </g>
                    <g>
                        {isWalking && (
                            <animateTransform attributeName="transform" type="rotate"
                                values="-10 131 93;10 131 93;-10 131 93" dur="0.45s" repeatCount="indefinite" />
                        )}
                        <path d="M136 98 L140 142 L142 184 L156 183 L152 140 L145 93" fill="#0c0c16" />
                        <rect x="140" y="153" width="15" height="14" rx="3" fill="#141420" />
                        <path d="M142 180 L140 193 C140 197, 144 199, 154 199 L158 193 L156 180" fill="#0d0a06" />
                    </g>

                    {/* ── WEAPON (Sword strap + hilt) ── */}
                    {/* Strap across back */}
                    <line x1="60" y1="82" x2="120" y2="195" stroke="#1a150e" strokeWidth="3" opacity="0.7" />
                    {/* Scabbard */}
                    <rect x="98" y="65" width="5" height="125" rx="2" fill="#120e08"
                        transform="rotate(18, 100, 128)" />
                    {/* Hilt */}
                    <rect x="97" y="50" width="5" height="18" rx="2" fill="#1a150e"
                        transform="rotate(18, 100, 60)" />
                    {/* Crossguard */}
                    <rect x="91" y="67" width="17" height="3" rx="1.5" fill={classAccent} opacity="0.4"
                        transform="rotate(18, 100, 68)" />
                    {/* Pommel glow */}
                    <circle cx="100" cy="48" r="3.5" fill={classAccent} opacity="0.3"
                        transform="rotate(18, 100, 48)">
                        <animate attributeName="opacity" values="0.15;0.4;0.15" dur="2.5s" repeatCount="indefinite" />
                    </circle>

                    {/* ── HEAD / HOOD ── */}
                    <rect x="78" y="60" width="24" height="20" rx="5" fill="#0a0a14" />
                    <path d="M60 48 C60 22, 74 8, 90 8 C106 8, 120 22, 120 48 C120 64, 114 74, 110 77 L70 77 C66 74, 60 64, 60 48Z"
                        fill="#0c0c18" />
                    <path d="M90 12 L90 74" stroke="#141420" strokeWidth="1.2" opacity="0.5" fill="none" />
                    {/* Hood inner darkness */}
                    <path d="M70 48 C70 32, 77 22, 90 22 C103 22, 110 32, 110 48 C110 58, 106 66, 102 68 L78 68 C74 66, 70 58, 70 48Z"
                        fill="#060608" opacity="0.6" />
                    {/* Hair wisps */}
                    <path d="M70 70 C68 74, 65 78, 67 82" stroke="#12100c" strokeWidth="2" fill="none" opacity="0.5" />
                    <path d="M110 70 C112 74, 115 78, 113 82" stroke="#12100c" strokeWidth="2" fill="none" opacity="0.5" />
                </svg>
            </div>

            {/* Ground shadow — elongated, dark, blended */}
            <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                    bottom: '-8px',
                    width: '140px',
                    height: '20px',
                    background: 'radial-gradient(ellipse, rgba(0,0,0,0.7), transparent 70%)',
                    animation: isWalking ? 'char-shadow-walk 0.45s ease-in-out infinite' : 'none',
                }}
            />
        </div>
    );
}
