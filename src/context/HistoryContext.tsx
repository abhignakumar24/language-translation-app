'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export interface TranslationHistory {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: Date;
}

interface HistoryContextType {
  history: TranslationHistory[];
  addToHistory: (translation: Omit<TranslationHistory, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<TranslationHistory[]>([]);

  useEffect(() => {
    // Load history from localStorage on mount
    const savedHistory = localStorage.getItem('translationHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory, (key, value) => {
        if (key === 'timestamp') {
          return new Date(value);
        }
        return value;
      }));
    }
  }, []);

  useEffect(() => {
    // Save history to localStorage whenever it changes
    localStorage.setItem('translationHistory', JSON.stringify(history));
  }, [history]);

  const addToHistory = (translation: Omit<TranslationHistory, 'id' | 'timestamp'>) => {
    const newTranslation: TranslationHistory = {
      ...translation,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    setHistory(prev => [newTranslation, ...prev].slice(0, 50)); // Keep last 50 translations
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory, removeFromHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
} 