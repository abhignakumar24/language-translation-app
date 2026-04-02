import axios from 'axios';
import { TranslationResponse, ApiError } from '@/types';

class TranslationService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor() {
    this.apiKey = 'a00d4a2e09mshf66aefe262284d3p1366d7jsna1a54f95f99c';
    this.baseUrl = 'https://deep-translate1.p.rapidapi.com/language/translate/v2';
    this.headers = {
      'x-rapidapi-key': this.apiKey,
      'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
      'Content-Type': 'application/json'
    };
  }

  async translateText(
    text: string,
    sourceLang: string,
    targetLang: string
  ): Promise<TranslationResponse> {
    try {
      const response = await axios.post(
        this.baseUrl,
        {
          q: text,
          source: sourceLang,
          target: targetLang
        },
        {
          headers: this.headers
        }
      );

      return {
        translatedText: response.data.data.translations.translatedText,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang
      };
    } catch (error) {
      console.error('Translation error:', error);
      throw this.handleError(error);
    }
  }

  async detectLanguage(text: string): Promise<{ detectedLanguage: string }> {
    try {
      const response = await axios.post(
        this.baseUrl,
        {
          q: text,
          source: 'auto',
          target: 'en'
        },
        {
          headers: this.headers
        }
      );

      return {
        detectedLanguage: response.data.data.translations.detectedLanguage
      };
    } catch (error) {
      console.error('Language detection error:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ApiError {
    if (error instanceof Error) {
      return {
        message: error.message || 'Translation failed',
        code: 'UNKNOWN_ERROR'
      };
    }
    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR'
    };
  }
}

export const translationService = new TranslationService(); 