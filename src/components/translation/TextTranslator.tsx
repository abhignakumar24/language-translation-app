'use client';

import { useState, useEffect } from 'react';
import { translationService } from '@/services/translation';
import { TranslationResponse } from '@/types';
import { ArrowsRightLeftIcon, LanguageIcon, DocumentDuplicateIcon, XMarkIcon, SpeakerWaveIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useHistory } from '@/context/HistoryContext';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'te', name: 'Telugu' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'ta', name: 'Tamil' },
  { code: 'tr', name: 'Turkish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'el', name: 'Greek' },
  { code: 'cs', name: 'Czech' }
];

export default function TextTranslator() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sourceEnglishText, setSourceEnglishText] = useState('');
  const [targetEnglishText, setTargetEnglishText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');
  const { addToHistory } = useHistory();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showVoiceMenu, setShowVoiceMenu] = useState<'source' | 'target' | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<{ source: string; target: string }>({
    source: '',
    target: ''
  });

  // Function to detect language
  const detectLanguage = async (text: string) => {
    if (typeof text !== 'string' || !text.trim()) {
      setDetectedLanguage('');
      return;
    }

    try {
      const result = await translationService.detectLanguage(text);
      const detectedLang = result.detectedLanguage;
      setDetectedLanguage(detectedLang);
      
      // Update source language if it's different from detected language
      if (detectedLang && detectedLang !== sourceLang) {
        setSourceLang(detectedLang);
      }
    } catch (err) {
      console.error('Error detecting language:', err);
    }
  };

  // Function to translate text to English
  const translateToEnglish = async (text: string, fromLang: string) => {
    if (typeof text !== 'string' || !text.trim() || fromLang === 'en') return '';
    
    try {
      const result = await translationService.translateText(text, fromLang, 'en');
      return result.translatedText;
    } catch (err) {
      console.error('Error translating to English:', err);
      return '';
    }
  };

  // Update English translations when translated text or language changes
  useEffect(() => {
    const updateTargetEnglish = async () => {
      if (typeof translatedText === 'string' && translatedText.trim() && targetLang !== 'en') {
        const englishText = await translateToEnglish(translatedText, targetLang);
        setTargetEnglishText(englishText);
      } else {
        setTargetEnglishText('');
      }
    };
    updateTargetEnglish();
  }, [translatedText, targetLang]);

  // Update English translations when source text or language changes
  useEffect(() => {
    const updateSourceEnglish = async () => {
      if (typeof sourceText === 'string' && sourceText.trim() && sourceLang !== 'en') {
        const englishText = await translateToEnglish(sourceText, sourceLang);
        setSourceEnglishText(englishText);
      } else {
        setSourceEnglishText('');
      }
    };
    updateSourceEnglish();
  }, [sourceText, sourceLang]);

  // Detect language when source text changes
  useEffect(() => {
    const timer = setTimeout(() => {
      detectLanguage(sourceText);
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timer);
  }, [sourceText]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const result: TranslationResponse = await translationService.translateText(
        sourceText,
        sourceLang,
        targetLang
      );
      setTranslatedText(result.translatedText);
      
      // Add to history
      addToHistory({
        sourceText,
        translatedText: result.translatedText,
        sourceLang,
        targetLang,
      });
    } catch (err: any) {
      setError(err.message || 'Translation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback('Copied to clipboard!');
    setTimeout(() => setCopyFeedback(''), 2000); // Clear message after 2 seconds
  };

  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
    setSourceEnglishText('');
    setTargetEnglishText('');
    setDetectedLanguage('');
    setError('');
  };

  const speakText = (text: string, lang: string, voiceId: string) => {
    if (!text || isSpeaking) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    // Set voice if selected and not default
    if (voiceId && voiceId !== 'default') {
      const voice = voices.find(v => v.voiceURI === voiceId);
      if (voice) {
        utterance.voice = voice;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setShowVoiceMenu(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setShowVoiceMenu(null);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setShowVoiceMenu(null);
  };

  const getVoicesForLanguage = (lang: string) => {
    return voices.filter(voice => voice.lang.startsWith(lang));
  };

  const toggleVoiceMenu = (type: 'source' | 'target') => {
    if (showVoiceMenu === type) {
      setShowVoiceMenu(null);
    } else {
      setShowVoiceMenu(type);
    }
  };

  const handleVoiceSelect = (voiceId: string, type: 'source' | 'target') => {
    setSelectedVoice(prev => ({ ...prev, [type]: voiceId }));
    setShowVoiceMenu(null);
    
    const text = type === 'source' ? sourceText : translatedText;
    const lang = type === 'source' ? sourceLang : targetLang;
    speakText(text, lang, voiceId);
  };

  return (
    <div className="h-full flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="w-full max-w-4xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
            Language Translator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Translate text between multiple languages instantly
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From
            </label>
            <div className="relative group">
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-blue-300 dark:group-hover:border-blue-500"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <LanguageIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 group-hover:text-blue-500" />
            </div>
            {detectedLanguage && detectedLanguage !== sourceLang && (
              <div className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                Detected language: {LANGUAGES.find(lang => lang.code === detectedLanguage)?.name}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSwapLanguages}
            className="mx-auto md:mx-0 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full p-2.5 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Swap languages"
          >
            <ArrowsRightLeftIcon className="h-5 w-5" />
          </button>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <div className="relative group">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-blue-300 dark:group-hover:border-blue-500"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <LanguageIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 group-hover:text-blue-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="flex flex-col">
            <div className="relative group">
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Enter text to translate"
                className="w-full h-28 sm:h-32 md:h-36 p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 group-hover:border-blue-300 dark:group-hover:border-blue-500"
              />
              {sourceText && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <div className="relative">
                    <button
                      onClick={() => toggleVoiceMenu('source')}
                      className="p-1.5 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-1"
                      title={isSpeaking ? "Stop speaking" : "Speak text"}
                    >
                      <SpeakerWaveIcon className={`h-4 w-4 ${isSpeaking ? 'text-blue-500' : ''}`} />
                      <ChevronDownIcon className="h-3 w-3" />
                    </button>
                    {showVoiceMenu === 'source' && (
                      <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                        <div className="py-1">
                          <button
                            onClick={() => handleVoiceSelect('default', 'source')}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700"
                          >
                            <SpeakerWaveIcon className="h-4 w-4" />
                            Default Voice
                          </button>
                          {getVoicesForLanguage(sourceLang).map((voice) => (
                            <button
                              key={voice.voiceURI}
                              onClick={() => handleVoiceSelect(voice.voiceURI, 'source')}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                              <SpeakerWaveIcon className="h-4 w-4" />
                              {voice.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => copyToClipboard(sourceText)}
                    className="p-1.5 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition-colors duration-200"
                    title="Copy to clipboard"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            {sourceEnglishText && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-500 dark:text-gray-400">English:</span> {sourceEnglishText}
              </div>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 self-end">
              {sourceText.length} / 5000
            </span>
          </div>

          <div className="flex flex-col">
            <div className="relative group">
              <textarea
                value={translatedText}
                readOnly
                placeholder="Translation will appear here"
                className="w-full h-28 sm:h-32 md:h-36 p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none resize-none transition-all duration-200 group-hover:border-blue-300 dark:group-hover:border-blue-500"
              />
              {translatedText && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <div className="relative">
                    <button
                      onClick={() => toggleVoiceMenu('target')}
                      className="p-1.5 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-1"
                      title={isSpeaking ? "Stop speaking" : "Speak text"}
                    >
                      <SpeakerWaveIcon className={`h-4 w-4 ${isSpeaking ? 'text-blue-500' : ''}`} />
                      <ChevronDownIcon className="h-3 w-3" />
                    </button>
                    {showVoiceMenu === 'target' && (
                      <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                        <div className="py-1">
                          <button
                            onClick={() => handleVoiceSelect('default', 'target')}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700"
                          >
                            <SpeakerWaveIcon className="h-4 w-4" />
                            Default Voice
                          </button>
                          {getVoicesForLanguage(targetLang).map((voice) => (
                            <button
                              key={voice.voiceURI}
                              onClick={() => handleVoiceSelect(voice.voiceURI, 'target')}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                              <SpeakerWaveIcon className="h-4 w-4" />
                              {voice.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => copyToClipboard(translatedText)}
                    className="p-1.5 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition-colors duration-200"
                    title="Copy to clipboard"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            {targetEnglishText && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-500 dark:text-gray-400">English:</span> {targetEnglishText}
              </div>
            )}
          </div>
        </div>

        {copyFeedback && (
          <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
            {copyFeedback}
          </div>
        )}

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleTranslate}
            disabled={isLoading || !(typeof sourceText === 'string' && sourceText.trim())}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base disabled:hover:from-blue-500 disabled:hover:to-indigo-600"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Translating...
              </span>
            ) : (
              'Translate'
            )}
          </button>

          {(sourceText || translatedText) && (
            <button
              onClick={handleClear}
              className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl shadow-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
            >
              Clear
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-xl text-center animate-fade-in border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 