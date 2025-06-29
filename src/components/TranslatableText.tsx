import React, { useState, useEffect } from 'react';
import { Languages, Loader } from 'lucide-react';
import { useTranslation } from './TranslationProvider';

interface TranslatableTextProps {
  text: string;
  className?: string;
  showTranslateButton?: boolean;
}

const TranslatableText: React.FC<TranslatableTextProps> = ({
  text,
  className = '',
  showTranslateButton = true
}) => {
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const { currentLanguage, t } = useTranslation();
  
  useEffect(() => {
    // Reset translation when language changes
    setTranslatedText(null);
    setIsTranslated(false);
  }, [currentLanguage, text]);
  
  const handleTranslate = async () => {
    if (isTranslating || !text) return;
    
    setIsTranslating(true);
    try {
      // Try to use the t function from context
      const translated = t(text);
      if (translated !== text) {
        setTranslatedText(translated);
        setIsTranslated(true);
        return;
      }
      
      // If no translation found, show original text
      setIsTranslated(true);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };
  
  const toggleTranslation = () => {
    if (isTranslated && !isTranslating) {
      setIsTranslated(false);
    } else {
      handleTranslate();
    }
  };
  
  // If auto-translate is enabled, translate on mount
  useEffect(() => {
    const autoTranslate = localStorage.getItem('autoTranslate') === 'true';
    if (autoTranslate && currentLanguage !== 'en' && text) {
      handleTranslate();
    }
  }, []);
  
  return (
    <div className={className}>
      <div className="relative">
        {/* Display either original or translated text */}
        <div>
          {isTranslated && translatedText ? translatedText : text}
        </div>
        
        {/* Translation button */}
        {showTranslateButton && text && currentLanguage !== 'en' && (
          <button
            onClick={toggleTranslation}
            disabled={isTranslating}
            className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-1"
          >
            {isTranslating ? (
              <>
                <Loader className="w-3 h-3 mr-1 animate-spin" />
                Translating...
              </>
            ) : isTranslated ? (
              <>
                <Languages className="w-3 h-3 mr-1" />
                Show original
              </>
            ) : (
              <>
                <Languages className="w-3 h-3 mr-1" />
                Translate
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default TranslatableText;