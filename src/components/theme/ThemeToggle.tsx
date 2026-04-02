'use client';

import { useTheme } from '@/context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-2.5 rounded-xl transition-all duration-500 ease-in-out z-50 bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:text-white hover:shadow-md"
      title="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <SunIcon 
          className={`h-5 w-5 absolute transition-all duration-500 ease-in-out ${
            theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-0'
          }`} 
        />
        <MoonIcon 
          className={`h-5 w-5 absolute transition-all duration-500 ease-in-out ${
            theme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
          }`} 
        />
      </div>
    </button>
  );
} 