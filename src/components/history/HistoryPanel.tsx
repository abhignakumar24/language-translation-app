'use client';

import { useHistory, TranslationHistory } from '@/context/HistoryContext';
import { ClockIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const { history, clearHistory, removeFromHistory } = useHistory();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed top-0 left-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-50">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Translation History</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={clearHistory}
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors p-1"
                title="Clear history"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1"
                title="Close history"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {history.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <ClockIcon className="h-8 w-8 mx-auto mb-2" />
                <p>No translation history yet</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                      </div>
                      <button
                        onClick={() => removeFromHistory(item.id)}
                        className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                        title="Remove from history"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {item.sourceLang.toUpperCase()} → {item.targetLang.toUpperCase()}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {item.sourceText}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                          {item.translatedText}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 