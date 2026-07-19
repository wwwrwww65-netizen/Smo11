import React from 'react';

export const CustomLogo: React.FC<{ className?: string }> = ({ className = "h-10 w-10" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Royal Crown + DNA Double Helix Elegant Vector Design */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transform transition-transform duration-500 hover:rotate-12"
      >
        {/* Glow behind logo */}
        <defs>
          <radialGradient id="logoGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#logoGlow)" />

        {/* Double Helix DNA Strands in background */}
        <path
          d="M 25,50 C 35,30 45,70 55,50 C 65,30 75,70 85,50"
          stroke="#22c55e"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="1 6"
          opacity="0.8"
        />
        <path
          d="M 25,50 C 35,70 45,30 55,50 C 65,70 75,30 85,50"
          stroke="#3b82f6"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="1 6"
          opacity="0.8"
        />

        {/* Vertical Connecting bonds */}
        <line x1="33" y1="41" x2="33" y2="59" stroke="#10b981" strokeWidth="2.5" opacity="0.6" />
        <line x1="43" y1="58" x2="43" y2="42" stroke="#3b82f6" strokeWidth="2.5" opacity="0.6" />
        <line x1="57" y1="42" x2="57" y2="58" stroke="#10b981" strokeWidth="2.5" opacity="0.6" />
        <line x1="67" y1="59" x2="67" y2="41" stroke="#3b82f6" strokeWidth="2.5" opacity="0.6" />

        {/* Royal Crown Emblem sitting proudly on top */}
        <path
          d="M 28,38 L 36,46 L 50,28 L 64,46 L 72,38 L 76,54 L 24,54 Z"
          fill="url(#crownGradient)"
          stroke="#eab308"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Royal jewels on crown peaks */}
        <circle cx="28" cy="38" r="2" fill="#ef4444" />
        <circle cx="50" cy="28" r="3" fill="#3b82f6" />
        <circle cx="72" cy="38" r="2" fill="#ef4444" />
        <circle cx="50" cy="42" r="1.5" fill="#10b981" />

        {/* Base foundation pedestal of the crest */}
        <path
          d="M 20,54 H 80 C 80,54 75,62 50,62 C 25,62 20,54 20,54 Z"
          fill="#3b82f6"
          opacity="0.4"
        />

        {/* Gradients definition */}
        <defs>
          <linearGradient id="crownGradient" x1="24" y1="28" x2="76" y2="54">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
