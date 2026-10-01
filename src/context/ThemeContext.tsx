import React, { createContext, useContext, useEffect, useState } from 'react';
import { PantoneColor } from '../types';
import { PANTONE_PRESETS } from '../utils/mockData';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  pantone: PantoneColor;
  setPantone: (color: PantoneColor) => void;
  setCustomHex: (hex: string) => void;
  pantonePresets: PantoneColor[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper to compute complementary colors for custom hex
function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function adjustHexBrightness(hex: string, percent: number): string {
  const cleanHex = hex.replace('#', '');
  let r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  let g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  let b = parseInt(cleanHex.substring(4, 6), 16) || 0;

  r = Math.min(255, Math.max(0, Math.floor(r * (1 + percent / 100))));
  g = Math.min(255, Math.max(0, Math.floor(g * (1 + percent / 100))));
  b = Math.min(255, Math.max(0, Math.floor(b * (1 + percent / 100))));

  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('safetypulse_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark'; // Industrial dark default for high contrast field viewing
  });

  const [pantone, setPantoneState] = useState<PantoneColor>(() => {
    const saved = localStorage.getItem('safetypulse_pantone');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return PANTONE_PRESETS[0];
  });

  // Apply dark mode class to documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('safetypulse_theme', theme);
  }, [theme]);

  // Apply CSS Variables for dynamic Pantone branding
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', pantone.hex);
    root.style.setProperty('--primary-hover', pantone.hoverHex);
    root.style.setProperty('--primary-light', pantone.lightHex);
    root.style.setProperty('--primary-ring', pantone.ringHex);
    root.style.setProperty('--primary-border', pantone.hex);
    localStorage.setItem('safetypulse_pantone', JSON.stringify(pantone));
  }, [pantone]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setPantone = (color: PantoneColor) => {
    setPantoneState(color);
  };

  const setCustomHex = (hex: string) => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return;
    const newPantone: PantoneColor = {
      name: 'Custom Swatch',
      code: `HEX ${hex.toUpperCase()}`,
      hex: hex,
      hoverHex: adjustHexBrightness(hex, -15),
      lightHex: hexToRgba(hex, 0.16),
      ringHex: hexToRgba(hex, 0.35)
    };
    setPantoneState(newPantone);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        pantone,
        setPantone,
        setCustomHex,
        pantonePresets: PANTONE_PRESETS
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
