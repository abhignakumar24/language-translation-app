'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

const Cloud = ({ delay, duration, startX }: { delay: number; duration: number; startX: number }) => (
  <div
    className="absolute"
    style={{
      left: `${startX}%`,
      animation: `floatCloud ${duration}s linear ${delay}s infinite`,
    }}
  >
    <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M25 40C25 40 15 40 15 30C15 20 25 20 25 20C25 10 35 10 35 20C45 20 45 30 35 30C35 40 25 40 25 40Z"
        fill="white"
        fillOpacity="0.8"
      />
    </svg>
  </div>
);

const Tree = ({ x, size }: { x: number; size: number }) => (
  <div
    className="absolute bottom-0"
    style={{
      left: `${x}%`,
      transform: `scale(${size})`,
    }}
  >
    <svg width="60" height="100" viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M30 20C30 20 10 20 10 40C10 60 30 60 30 60C30 60 50 60 50 40C50 20 30 20 30 20Z"
        fill="#4ade80"
        fillOpacity="0.8"
      />
      <path
        d="M25 60L25 100M35 60L35 100"
        stroke="#166534"
        strokeWidth="4"
      />
    </svg>
  </div>
);

const Grass = () => (
  <div className="absolute bottom-0 w-full h-20 overflow-hidden">
    <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-green-600 to-green-500" />
    {Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="absolute bottom-0 h-16 w-1 bg-green-500"
        style={{
          left: `${i * 5}%`,
          transform: `rotate(${Math.sin(i) * 15}deg)`,
          animation: `swayGrass 3s ease-in-out ${i * 0.1}s infinite alternate`,
        }}
      />
    ))}
  </div>
);

export default function NatureBackground() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Sky gradient */}
      <div className={`absolute inset-0 transition-colors duration-500 ${
        theme === 'light' 
          ? 'bg-gradient-to-b from-sky-400 to-sky-300' 
          : 'bg-gradient-to-b from-gray-900 to-gray-800'
      }`} />

      {/* Stars for dark mode */}
      {theme === 'dark' && (
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.5,
              }}
            />
          ))}
        </div>
      )}

      {/* Clouds */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Cloud
          key={i}
          delay={i * 5}
          duration={30 + i * 5}
          startX={-20 + i * 25}
        />
      ))}

      {/* Trees */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Tree
          key={i}
          x={i * 20}
          size={0.8 + Math.random() * 0.4}
        />
      ))}

      {/* Grass */}
      <Grass />

      {/* Add keyframes to the document */}
      <style jsx global>{`
        @keyframes floatCloud {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(100vw + 100px));
          }
        }

        @keyframes swayGrass {
          0% {
            transform: rotate(-15deg);
          }
          100% {
            transform: rotate(15deg);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
} 