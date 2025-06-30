import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { LingoProvider } from 'lingo.dev/react/client';
import dictionary from './lingo/dictionary';

// Import components
import Auth from './components/Auth';
import QuickStartGuide from './components/QuickStartGuide';
import TaskTemplates from './components/TaskTemplates';
import TaskMarketplace from './components/TaskMarketplace';
import UserProfile from './components/UserProfile';
import ChatList from './components/ChatList';
import WalletModal from './components/WalletModal';
import NotificationsModal from './components/NotificationsModal';
import FAQSupport from './components/FAQSupport';
import SafetyFeatures from './components/SafetyFeatures';
import LearnMoreModal from './components/LearnMoreModal';
import AdminTools from './components/AdminTools';
import VoiceAssistantButton from './components/VoiceAssistantButton';
import VoiceAssistantManager from './components/VoiceAssistantManager';
import VoiceCommandTooltip from './components/VoiceCommandTooltip';
import LanguageSettingsModal from './components/LanguageSettingsModal';

// Import hooks and services
import { useGeolocation } from './hooks/useGeolocation';
import { auth, subscribeToAuthChanges } from './lib/auth';

function App() {
  // State for authentication and user
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // State for modals and UI components
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showQuickStart, setShowQuickStart] = useState<boolean>(false);
  const [showCreateTask, setShowCreateTask] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showMessages, setShowMessages] = useState<boolean>(false);
  const [showWallet, setShowWallet] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showFAQ, setShowFAQ] = useState<boolean>(false);
  const [showSafety, setShowSafety] = useState<boolean>(false);
  const [showLearnMore, setShowLearnMore] = useState<boolean>(false);
  const [showAdmin, setShowAdmin] = useState<boolean>(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState<boolean>(false);
  const [showVoiceTooltip, setShowVoiceTooltip] = useState<boolean>(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState<boolean>(false);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'home' | 'tasks' | 'messages' | 'profile'>('home');
  
  // Get user's location
  const { location: userLocation, loading: locationLoading } = useGeolocation();

  // Check authentication status on mount
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setIsAuthenticated(!!user);
      setCurrentUser(user);
      setIsLoading(false);
      
      // Show quick start guide for new users
      if (user && !localStorage.getItem('quickStartGuideShown')) {
        setShowQuickStart(true);
      }
      
      // Show voice assistant tooltip if not shown before
      if (user && !localStorage.getItem('voiceTooltipShown')) {
        setTimeout(() => {
          setShowVoiceTooltip(true);
          localStorage.setItem('voiceTooltipShown', 'true');
        }, 5000);
      }
    });
    
    // Listen for custom events
    window.addEventListener('create-task', () => setShowCreateTask(true));
    window.addEventListener('view-tasks', () => setActiveTab('tasks'));
    window.addEventListener('view-messages', () => setShowMessages(true));
    window.addEventListener('open-profile', () => setShowProfile(true));
    window.addEventListener('open-wallet', () => setShowWallet(true));
    window.addEventListener('open-faq', () => setShowFAQ(true));
    window.addEventListener('open-safety', () => setShowSafety(true));
    
    return () => {
      unsubscribe();
      window.removeEventListener('create-task', () => setShowCreateTask(true));
      window.removeEventListener('view-tasks', () => setActiveTab('tasks'));
      window.removeEventListener('view-messages', () => setShowMessages(true));
      window.removeEventListener('open-profile', () => setShowProfile(true));
      window.removeEventListener('open-wallet', () => setShowWallet(true));
      window.removeEventListener('open-faq', () => setShowFAQ(true));
      window.removeEventListener('open-safety', () => setShowSafety(true));
    };
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-[#0021A5] animate-spin" />
      </div>
    );
  }

  return (
    <LingoProvider dictionary={dictionary}>
      <div className="min-h-screen bg-gray-50">
        {/* Bolt.new badge */}
        <a 
          href="https://bolt.new" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="fixed top-4 right-4 z-50"
        >
          <img 
            src="https://github.com/kickiniteasy/bolt-hackathon-badge/raw/main/src/public/bolt-badge/black_circle_360x360/black_circle_360x360.svg" 
            alt="Powered by Bolt.new" 
            className="w-12 h-12 hover:opacity-90 transition-opacity"
          />
        </a>
        
        {/* Navigation */}
        <nav className="bg-gradient-to-r from-[#0038FF] to-[#0021A5] text-white p-4 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <img src="/image.png" alt="Hustl Logo" className="h-8 w-8 mr-2" />
              <h1 className="text-xl font-bold">Hustl</h1>
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setShowCreateTask(true)}
                  className="bg-[#FF5A1F] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#E63A0B] transition duration-200 shadow-sm"
                >
                  Post Task
                </button>
                <button 
                  onClick={() => setShowNotifications(true)}
                  className="text-white hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <button 
                  onClick={() => setShowWallet(true)}
                  className="text-white hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setShowLanguageSettings(true)}
                  className="text-white hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowProfile(true)}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0038FF] font-bold"
                  >
                    {currentUser?.displayName?.charAt(0) || 'U'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setShowLearnMore(true)}
                  className="text-white hover:text-gray-200"
                >
                  Learn More
                </button>
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-white text-[#0038FF] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {isAuthenticated ? (
            <>
              {/* Tabs for authenticated users */}
              <div className="mb-6 border-b border-gray-200">
                <div className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('home')}
                    className={`mr-8 py-4 text-sm font-medium ${
                      activeTab === 'home'
                        ? 'border-b-2 border-[#0038FF] text-[#0038FF]'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`mr-8 py-4 text-sm font-medium ${
                      activeTab === 'tasks'
                        ? 'border-b-2 border-[#0038FF] text-[#0038FF]'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Tasks
                  </button>
                  <button
                    onClick={() => setShowMessages(true)}
                    className={`mr-8 py-4 text-sm font-medium ${
                      activeTab === 'messages'
                        ? 'border-b-2 border-[#0038FF] text-[#0038FF]'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Messages
                  </button>
                  <button
                    onClick={() => setShowProfile(true)}
                    className={`py-4 text-sm font-medium ${
                      activeTab === 'profile'
                        ? 'border-b-2 border-[#0038FF] text-[#0038FF]'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Profile
                  </button>
                </div>
              </div>

              {/* Content based on active tab */}
              {activeTab === 'home' && (
                <TaskTemplates 
                  onSelectTemplate={(template) => {
                    // Handle template selection
                    console.log('Selected template:', template);
                    setShowCreateTask(true);
                  }}
                />
              )}

              {activeTab === 'tasks' && (
                <TaskMarketplace userLocation={userLocation} />
              )}
            </>
          ) : (
            /* Content for non-authenticated users */
            <div className="text-center py-12">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Connect with fellow Gators
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Get help with quick tasks or earn money helping others on the University of Florida campus.
              </p>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="btn-gradient-primary btn-shine px-8 py-3 text-lg"
                >
                  Get Started
                </button>
                <button
                  onClick={() => setShowLearnMore(true)}
                  className="ml-4 bg-white text-[#0038FF] px-8 py-3 rounded-lg text-lg font-semibold border border-[#0038FF] hover:bg-blue-50 transition duration-200"
                >
                  Learn More
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Mobile Navigation */}
        {isAuthenticated && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 md:hidden">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center p-2 ${
                activeTab === 'home' ? 'text-[#0038FF]' : 'text-gray-500'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs">Home</span>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex flex-col items-center p-2 ${
                activeTab === 'tasks' ? 'text-[#0038FF]' : 'text-gray-500'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="text-xs">Tasks</span>
            </button>
            <button
              onClick={() => setShowMessages(true)}
              className="flex flex-col items-center p-2 text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="text-xs">Messages</span>
            </button>
            <button
              onClick={() => setShowProfile(true)}
              className={`flex flex-col items-center p-2 ${
                activeTab === 'profile' ? 'text-[#0038FF]' : 'text-gray-500'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs">Profile</span>
            </button>
          </div>
        )}

        {/* Modals */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Auth 
              initialMode="signin" 
              onClose={() => setShowAuthModal(false)} 
            />
          </div>
        )}

        {showQuickStart && (
          <QuickStartGuide 
            onClose={() => setShowQuickStart(false)}
            onCreateTask={() => {
              setShowQuickStart(false);
              setShowCreateTask(true);
            }}
            onBrowseTasks={() => {
              setShowQuickStart(false);
              setActiveTab('tasks');
            }}
          />
        )}

        {showCreateTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* CreateTask component would go here */}
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-4">Create Task</h2>
              <p>Task creation form would go here</p>
              <button 
                onClick={() => setShowCreateTask(false)}
                className="mt-4 bg-[#0038FF] text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-h-[90vh] overflow-y-auto w-full max-w-4xl">
              <UserProfile />
              <div className="p-4 border-t flex justify-end">
                <button 
                  onClick={() => setShowProfile(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showMessages && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-h-[90vh] overflow-hidden w-full max-w-4xl flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Messages</h2>
                <button 
                  onClick={() => setShowMessages(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatList userId={currentUser?.uid} currentUser={currentUser} />
              </div>
            </div>
          </div>
        )}

        {showWallet && (
          <WalletModal onClose={() => setShowWallet(false)} />
        )}

        {showNotifications && (
          <NotificationsModal onClose={() => setShowNotifications(false)} />
        )}

        {showFAQ && (
          <FAQSupport onClose={() => setShowFAQ(false)} />
        )}

        {showSafety && (
          <SafetyFeatures onClose={() => setShowSafety(false)} />
        )}

        {showLearnMore && (
          <LearnMoreModal onClose={() => setShowLearnMore(false)} />
        )}

        {showAdmin && (
          <AdminTools onClose={() => setShowAdmin(false)} />
        )}

        {showVoiceAssistant && (
          <VoiceAssistantManager 
            onClose={() => setShowVoiceAssistant(false)}
            userLocation={userLocation}
            onCreateTask={() => {
              setShowVoiceAssistant(false);
              setShowCreateTask(true);
            }}
            onBrowseTasks={() => {
              setShowVoiceAssistant(false);
              setActiveTab('tasks');
            }}
            onOpenWallet={() => {
              setShowVoiceAssistant(false);
              setShowWallet(true);
            }}
            onOpenProfile={() => {
              setShowVoiceAssistant(false);
              setShowProfile(true);
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
        {isAuthenticated && (
          <VoiceAssistantButton onClick={() => setShowVoiceAssistant(true)} />
        )}

        {/* Toast notifications */}
        <Toaster position="bottom-center" />
      </div>
    </LingoProvider>
  );
}

export default App;