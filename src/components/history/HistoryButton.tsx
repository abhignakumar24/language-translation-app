'use client';

import { useState } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import HistoryPanel from './HistoryPanel';

export default function HistoryButton() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowHistory(!showHistory)}
        className={`fixed top-4 left-4 p-2.5 rounded-xl transition-all duration-1000 ease-in-out z-50 ${
          showHistory 
            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-110' 
            : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-400 hover:text-white hover:shadow-md'
        }`}
        title="View translation history"
      >
        <ClockIcon className="h-5 w-5 transition-transform duration-1000 ease-in-out" 
          style={{ transform: showHistory ? 'rotate(180deg)' : 'rotate(0deg)' }} 
        />
      </button>

      <HistoryPanel isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </>
  );
} 