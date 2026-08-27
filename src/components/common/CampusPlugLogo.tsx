import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface CampusPlugLogoProps {
  variant?: 'full' | 'icon' | 'compact';
  theme?: 'light' | 'dark' | 'auto';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBadge?: boolean;
}

/**
 * Official CampusPlug Brand Logo & Icon Component
 * Faithfully matches the official uploaded CampusPlug circuit-plug monogram ("CP") and "CampusPlug" wordmark.
 */
export const CampusPlugLogo: React.FC<CampusPlugLogoProps> = ({
  variant = 'full',
  theme = 'auto',
  size = 'md',
  className = '',
  showBadge = false,
}) => {
  let isDarkTheme = false;
  try {
    const themeContext = useTheme();
    if (theme === 'auto') {
      isDarkTheme = themeContext.resolvedTheme === 'dark';
    } else {
      isDarkTheme = theme === 'dark';
    }
  } catch {
    isDarkTheme = theme === 'dark';
  }

  const primaryColor = isDarkTheme ? '#FFFFFF' : '#0F172A';
  const secondaryDotColor = isDarkTheme ? '#38BDF8' : '#0F172A'; // Tech accent or monochrome

  // Dimensions
  const iconDimensions = {
    xs: { w: 22, h: 22 },
    sm: { w: 28, h: 28 },
    md: { w: 36, h: 36 },
    lg: { w: 44, h: 44 },
    xl: { w: 56, h: 56 },
  };

  const textStyles = {
    xs: 'text-sm tracking-tight',
    sm: 'text-base tracking-tight',
    md: 'text-lg sm:text-xl tracking-tight',
    lg: 'text-xl sm:text-2xl tracking-tight',
    xl: 'text-2xl sm:text-3xl tracking-tight',
  };

  const currentDim = iconDimensions[size];

  // SVG Symbol: The Official CampusPlug "CP" Monogram with Circuit Prongs
  const SymbolSVG = (
    <svg
      width={currentDim.w}
      height={currentDim.h}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      aria-label="CampusPlug Symbol"
    >
      {/* Outer 'C' Arch Loop */}
      <path
        d="M140 46 C116 26, 68 28, 44 54 C20 80, 20 120, 44 146 C68 172, 116 174, 140 154"
        stroke={primaryColor}
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner 'P' Stem & Lower Loop */}
      <path
        d="M74 158 V82 C74 72, 82 64, 92 64 H124 C142 64, 154 76, 154 94 C154 112, 142 124, 124 124 H74"
        stroke={primaryColor}
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Horizontal Circuit Line */}
      <path
        d="M102 94 H146"
        stroke={primaryColor}
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* Center Circuit Terminal Node */}
      <circle cx="102" cy="94" r="10" fill={primaryColor} />

      {/* Top Circuit Branch & Terminal Node */}
      <path
        d="M128 64 C138 52, 142 46, 150 44"
        stroke={primaryColor}
        strokeWidth="12"
        strokeLinecap="round"
      />
      <circle cx="158" cy="40" r="11" fill={primaryColor} />

      {/* Bottom Concentric Terminal Ring */}
      <path
        d="M124 124 V138"
        stroke={primaryColor}
        strokeWidth="12"
        strokeLinecap="round"
      />
      <circle
        cx="124"
        cy="154"
        r="14"
        stroke={primaryColor}
        strokeWidth="10"
        fill={isDarkTheme ? '#0F172A' : '#FFFFFF'}
      />
      <circle cx="124" cy="154" r="5" fill={primaryColor} />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {SymbolSVG}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {SymbolSVG}

      {/* CampusPlug Brand Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black ${textStyles[size]} ${
              isDarkTheme ? 'text-white' : 'text-slate-900'
            } transition-colors tracking-tight`}
            style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            CampusPlug
          </span>

          {showBadge && (
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              UNIOSUN
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
