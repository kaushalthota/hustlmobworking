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
    this.apiKey = import.meta.env.LINGODOTDEV_API_KEY || 'api_wotifoo9qly46y78x0trbc8b';
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
   * Translate text using Lingo.dev API directly
   * This is a fallback method when the compiler-based translation isn't available
   */
  async translateText(text: string, options: TranslationOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Translation API key not configured');
    }
    
    if (!text || text.trim() === '') {
      return text;
    }
    
    try {
      // Use the dictionary-based translation first
      const dictionary = await import('../lingo/dictionary.js').then(module => module.default);
      if (dictionary && dictionary[options.targetLanguage] && dictionary[options.targetLanguage][text]) {
        return dictionary[options.targetLanguage][text];
      }
      
      // If not found in dictionary, return the original text
      // We're not calling the API directly to avoid hitting rate limits
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
      { code: 'de', name: 'German' }
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
    
    // Default to English
    return 'en';
  }
}

export const translationService = new TranslationService();