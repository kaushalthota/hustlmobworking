import { auth } from './firebase';

interface TranslationOptions {
  targetLanguage: string;
  sourceLanguage?: string;
}

class TranslationService {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.lingo.dev/v1';
  
  constructor() {
    // Initialize with environment variable if available
    this.apiKey = import.meta.env.VITE_LINGO_API_KEY || null;
  }
  
  /**
   * Set the API key for Lingo.dev
   */
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  /**
   * Check if the translation service is available
   */
  isAvailable(): boolean {
    return !!this.apiKey;
  }
  
  /**
   * Translate text using dictionary-based approach
   * This avoids API calls to prevent hitting rate limits
   */
  async translateText(text: string, options: TranslationOptions): Promise<string> {
    if (!text || text.trim() === '') {
      return text;
    }
    
    try {
      // Use the dictionary-based translation
      const dictionary = await import('../lingo/dictionary.js').then(module => module.default);
      if (dictionary && dictionary[options.targetLanguage] && dictionary[options.targetLanguage][text]) {
        return dictionary[options.targetLanguage][text];
      }
      
      // If not found in dictionary, return the original text
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text on error
    }
  }
  
  /**
   * Get available languages for translation
   */
  async getAvailableLanguages(): Promise<{ code: string, name: string }[]> {
    // Return hardcoded languages to avoid API calls
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'ja', name: 'Japanese' }
    ];
  }
  
  /**
   * Detect language of text
   */
  async detectLanguage(text: string): Promise<string> {
    if (!text || text.trim() === '') {
      return 'en'; // Default to English for empty text
    }
    
    // Simple language detection based on common words
    const lowerText = text.toLowerCase();
    
    // Spanish detection
    if (lowerText.includes('el ') || lowerText.includes('la ') || 
        lowerText.includes(' y ') || lowerText.includes(' de ') ||
        lowerText.includes('hola') || lowerText.includes('gracias')) {
      return 'es';
    }
    
    // French detection
    if (lowerText.includes('le ') || lowerText.includes('la ') || 
        lowerText.includes(' et ') || lowerText.includes(' de ') ||
        lowerText.includes('bonjour') || lowerText.includes('merci')) {
      return 'fr';
    }
    
    // German detection
    if (lowerText.includes('der ') || lowerText.includes('die ') || 
        lowerText.includes('das ') || lowerText.includes(' und ') ||
        lowerText.includes('hallo') || lowerText.includes('danke')) {
      return 'de';
    }
    
    // Japanese detection
    if (lowerText.includes('は') || lowerText.includes('の') || 
        lowerText.includes('に') || lowerText.includes('を') ||
        lowerText.includes('こんにちは') || lowerText.includes('ありがとう')) {
      return 'ja';
    }
    
    // Default to English
    return 'en';
  }
}

export const translationService = new TranslationService();