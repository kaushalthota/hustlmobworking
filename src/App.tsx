import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import * as Sentry from "@sentry/react";
import { LingoProvider } from 'lingo.dev/react/client';

// Import components
import Auth from './components/Auth';
import TaskMarketplace from './components/TaskMarketplace';
import CreateTask from './components/CreateTask';
import UserProfile from './components/UserProfile';
import ChatList from './components/ChatList';
import WalletModal from './components/WalletModal';
import NotificationsModal from './components/NotificationsModal';
import FAQSupport from './components/FAQSupport';
import SafetyFeatures from './components/SafetyFeatures';
import AdminTools from './components/AdminTools';
import QuickStartGuide from './components/QuickStartGuide';
import TaskCheckoutSuccess from './components/TaskCheckoutSuccess';
import VoiceAssistantButton from './components/VoiceAssistantButton';
import VoiceAssistantManager from './components/VoiceAssistantManager';
import VoiceCommandTooltip from './components/VoiceCommandTooltip';
import LanguageSettingsModal from './components/LanguageSettingsModal';
import { useGeolocation } from './hooks/useGeolocation';
import { Location } from './lib/locationService';

// Import CSS
import './index.css';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [showVoiceTooltip, setShowVoiceTooltip] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const { location: userLocation } = useGeolocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      // Set user in Sentry
      if (user) {
        Sentry.setUser({
          id: user.uid,
          email: user.email || undefined,
          username: user.displayName || undefined
        });
      } else {
        Sentry.setUser(null);
      }
    });

    // Check if we should show the quick start guide
    const hasShownGuide = localStorage.getItem('quickStartGuideShown');
    if (!hasShownGuide) {
      setShowQuickStart(true);
    }
    
    // Check if we should show the voice tooltip
    const hasShownVoiceTooltip = localStorage.getItem('voiceTooltipShown');
    if (!hasShownVoiceTooltip) {
      // Show voice tooltip after a delay
      const tooltipTimer = setTimeout(() => {
        setShowVoiceTooltip(true);
        localStorage.setItem('voiceTooltipShown', 'true');
      }, 60000); // Show after 1 minute
      
      return () => clearTimeout(tooltipTimer);
    }

    return () => unsubscribe();
  }, []);

  // Event listeners for custom events
  useEffect(() => {
    const handleCreateTask = () => setShowCreateTask(true);
    const handleOpenWallet = () => setShowWallet(true);
    const handleOpenNotifications = () => setShowNotifications(true);
    const handleOpenFAQ = () => setShowFAQ(true);
    const handleOpenSafety = () => setShowSafety(true);
    const handleOpenAdmin = () => setShowAdmin(true);
    const handleOpenVoiceAssistant = () => setShowVoiceAssistant(true);
    const handleOpenLanguageSettings = () => setShowLanguageSettings(true);
    const handleSetProfileTab = (event: any) => {
      if (event.detail && event.detail.tab) {
        setActiveTab(event.detail.tab);
      }
    };

    window.addEventListener('create-task', handleCreateTask);
    window.addEventListener('open-wallet', handleOpenWallet);
    window.addEventListener('open-notifications', handleOpenNotifications);
    window.addEventListener('open-faq', handleOpenFAQ);
    window.addEventListener('open-safety', handleOpenSafety);
    window.addEventListener('open-admin', handleOpenAdmin);
    window.addEventListener('open-voice-assistant', handleOpenVoiceAssistant);
    window.addEventListener('open-language-settings', handleOpenLanguageSettings);
    window.addEventListener('set-profile-tab', handleSetProfileTab);

    return () => {
      window.removeEventListener('create-task', handleCreateTask);
      window.removeEventListener('open-wallet', handleOpenWallet);
      window.removeEventListener('open-notifications', handleOpenNotifications);
      window.removeEventListener('open-faq', handleOpenFAQ);
      window.removeEventListener('open-safety', handleOpenSafety);
      window.removeEventListener('open-admin', handleOpenAdmin);
      window.removeEventListener('open-voice-assistant', handleOpenVoiceAssistant);
      window.removeEventListener('open-language-settings', handleOpenLanguageSettings);
      window.removeEventListener('set-profile-tab', handleSetProfileTab);
    };
  }, []);

  const handleSignIn = () => {
    setShowAuth(true);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0021A5]"></div>
      </div>
    );
  }

  return (
    <LingoProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Bolt.new Badge */}
          <a 
            href="https://bolt.new" 
            target="_blank" 
            rel="noopener noreferrer"
            className="fixed top-4 right-4 z-50 transition-opacity hover:opacity-80"
            style={{ width: '40px', height: '40px' }}
          >
            <img 
              src="/black_circle_360x360.png" 
              alt="Powered by Bolt.new" 
              className="w-full h-full"
            />
          </a>

          {/* Navigation Bar */}
          <nav className="bg-gradient-to-r from-[#0F2557] to-[#0038FF] text-white p-4 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 mr-2">
                  <img src="/files_5770123-1751251303321-image.png" alt="Hustl Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-xl font-bold">Hustl</span>
              </div>
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('create-task'))}
                      className="bg-[#FA4616] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#E63A0B] transition duration-200"
                    >
                      Post Task
                    </button>
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('open-wallet'))}
                      className="text-white hover:text-gray-200 transition"
                    >
                      Wallet
                    </button>
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('open-notifications'))}
                      className="text-white hover:text-gray-200 transition"
                    >
                      Notifications
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="text-white hover:text-gray-200 transition"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSignIn}
                      className="text-white hover:text-gray-200 transition"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setShowAuth(true)}
                      className="bg-white text-[#0F2557] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto py-4">
            <Routes>
              <Route path="/" element={
                activeTab === 'home' ? (
                  <TaskMarketplace userLocation={userLocation as Location} />
                ) : activeTab === 'profile' ? (
                  <UserProfile />
                ) : activeTab === 'messages' ? (
                  <ChatList userId={user?.uid} currentUser={user} />
                ) : (
                  <TaskMarketplace userLocation={userLocation as Location} />
                )
              } />
              <Route path="/checkout-success" element={<TaskCheckoutSuccess onClose={() => {}} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          {/* Modals */}
          {showAuth && <Auth onClose={() => setShowAuth(false)} />}
          {showCreateTask && <CreateTask onClose={() => setShowCreateTask(false)} userLocation={userLocation as Location} />}
          {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}
          {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
          {showFAQ && <FAQSupport onClose={() => setShowFAQ(false)} />}
          {showSafety && <SafetyFeatures onClose={() => setShowSafety(false)} />}
          {showAdmin && <AdminTools onClose={() => setShowAdmin(false)} />}
          {showQuickStart && (
            <QuickStartGuide 
              onClose={() => {
                setShowQuickStart(false);
                localStorage.setItem('quickStartGuideShown', 'true');
              }}
              onCreateTask={() => {
                setShowQuickStart(false);
                setShowCreateTask(true);
                localStorage.setItem('quickStartGuideShown', 'true');
              }}
              onBrowseTasks={() => {
                setShowQuickStart(false);
                setActiveTab('home');
                localStorage.setItem('quickStartGuideShown', 'true');
              }}
            />
          )}
          {showVoiceAssistant && (
            <VoiceAssistantManager 
              onClose={() => setShowVoiceAssistant(false)}
              userLocation={userLocation as Location}
              onCreateTask={() => {
                setShowVoiceAssistant(false);
                setShowCreateTask(true);
              }}
              onBrowseTasks={() => {
                setShowVoiceAssistant(false);
                setActiveTab('home');
              }}
              onOpenWallet={() => {
                setShowVoiceAssistant(false);
                setShowWallet(true);
              }}
              onOpenProfile={() => {
                setShowVoiceAssistant(false);
                setActiveTab('profile');
              }}
              onOpenHelp={() => {
                setShowVoiceAssistant(false);
                setShowFAQ(true);
              }}
              onOpenSafety={() => {
                setShowVoiceAssistant(false);
                setShowSafety(true);
              }}
            />
          )}
          {showVoiceTooltip && (
            <VoiceCommandTooltip onClose={() => setShowVoiceTooltip(false)} />
          )}
          {showLanguageSettings && (
            <LanguageSettingsModal onClose={() => setShowLanguageSettings(false)} />
          )}

          {/* Voice Assistant Button */}
          {user && (
            <VoiceAssistantButton onClick={() => setShowVoiceAssistant(true)} />
          )}

          {/* Toast Container */}
          <Toaster position="bottom-center" />
        </div>
      </Router>
    </LingoProvider>
  );
};

export default Sentry.withProfiler(App);