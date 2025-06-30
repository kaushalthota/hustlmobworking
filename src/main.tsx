import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import StripeProvider from './components/StripeProvider.tsx';
import { TranslationProvider } from './components/TranslationProvider.tsx';
import { LingoProviderWrapper, loadDictionary } from "lingo.dev/react/client";
import * as Sentry from "@sentry/react";

// Initialize Sentry - single initialization point
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 0.5,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  environment: import.meta.env.MODE,
  release: import.meta.env.VITE_APP_VERSION || "hustl@dev",
  sendDefaultPii: true,
  beforeSend(event) {
    if (import.meta.env.DEV) {
      console.log("Sentry event:", event);
    }
    return event;
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<p>An error has occurred. Our team has been notified.</p>}>
      <LingoProviderWrapper loadDictionary={(locale) => loadDictionary(locale)}>
        <TranslationProvider>
          <StripeProvider>
            <App />
          </StripeProvider>
        </TranslationProvider>
      </LingoProviderWrapper>
    </Sentry.ErrorBoundary>
  </StrictMode>
);