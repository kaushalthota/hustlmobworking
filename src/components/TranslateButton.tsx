import React, { useState } from 'react';
import { Languages, Loader } from 'lucide-react';
import { useTranslation } from './TranslationProvider';
import * as Sentry from "@sentry/react";
import { captureException } from '../lib/sentryUtils';

interface TranslateButtonProps {
  text: string;
  onTranslated: (translatedText: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  targetLanguage?: string;
}

const TranslateButton: React.FC<TranslateButtonProps> = ({
  text,
  onTranslated,
  className = '',
  size = 'md',
  targetLanguage
}) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const { t, currentLanguage } = useTranslation();
  
  const sizeClasses = {
    sm: 'p-1 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base'
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };
  
  const handleTranslate = async () => {
    if (!text || isTranslating) return;
    
    // Add a breadcrumb for debugging
    Sentry.addBreadcrumb({
      category: 'translation',
      message: `Translation requested for language: ${targetLanguage || currentLanguage}`,
      level: 'info'
    });
    
    setIsTranslating(true);
    try {
      // Use the t function from context
      const translated = t(text);
      
      // If translation is different from original, use it
      if (translated !== text) {
        onTranslated(translated);
        return;
      }
      
      // If no translation found, use original text
      onTranslated(text);
    } catch (error) {
      console.error('Translation error:', error);
      
      // Log the error to Sentry
      captureException(error, {
        tags: {
          component: "TranslateButton",
          action: "translate",
          targetLanguage: targetLanguage || currentLanguage
        },
        extra: {
          textLength: text.length,
          textSample: text.substring(0, 50) // Only include first 50 chars for privacy
        }
      });
      
      // Return original text on error
      onTranslated(text);
    } finally {
      setIsTranslating(false);
    }
  };
  
  return (
    <button
      onClick={handleTranslate}
      disabled={isTranslating || !text}
      className={`flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors ${sizeClasses[size]} ${className}`}
      title="Translate"
    >
      {isTranslating ? (
        <Loader className={`${iconSizes[size]} animate-spin`} />
      ) : (
        <Languages className={iconSizes[size]} />
      )}
    </button>
  );
};

export default TranslateButton;