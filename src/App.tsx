import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Zap, MessageSquare, User, Home, Package, Bell, Wallet, HelpCircle } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useGeolocation } from './hooks/useGeolocation';
import * as Sentry from "@sentry/react";

// Components
import Auth from './components/Auth';
import TaskMarketplace from './components/TaskMarketplace';
import TaskTemplates from './components/TaskTemplates';
import CreateTask from './components/CreateTask';
import TaskDetails from './components/TaskDetails';
import ChatList from './components/ChatList';
import UserProfile from './components/UserProfile';
import WalletModal from './components/WalletModal';
import NotificationsModal from './components/NotificationsModal';
import FAQSupport from './components/FAQSupport';
import SafetyFeatures from './components/SafetyFeatures';
import AdminTools from './components/AdminTools';
import QuickStartGuide from './components/QuickStartGuide';
import LearnMoreModal from './components/LearnMoreModal';
import VoiceAssistantButton from './components/VoiceAssistantButton';
import VoiceAssistantManager from './components/VoiceAssistantManager';
import VoiceCommandTooltip from './components/VoiceCommandTooltip';
import LanguageSettingsModal from './components/LanguageSettingsModal';
import MobileBottomNav from './components/MobileBottomNav';

// Providers
import { TranslationProvider } from './components/TranslationProvider';
import { LingoProvider } from 'lingo.dev/react/client';

function App() {
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
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [showVoiceTooltip, setShowVoiceTooltip] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const { location } = useGeolocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // Show quick start guide for new users
      if (currentUser && !localStorage.getItem('quickStartGuideShown')) {
        setShowQuickStart(true);
      }
      
      // Show voice assistant tooltip if not shown before
      if (currentUser && !localStorage.getItem('voiceTooltipShown')) {
        setTimeout(() => {
          setShowVoiceTooltip(true);
          localStorage.setItem('voiceTooltipShown', 'true');
        }, 5000);
      }
    });

    // Listen for custom events
    window.addEventListener('create-task', () => setShowCreateTask(true));
    window.addEventListener('open-wallet', () => setShowWallet(true));
    window.addEventListener('open-notifications', () => setShowNotifications(true));
    window.addEventListener('open-faq', () => setShowFAQ(true));
    window.addEventListener('open-safety', () => setShowSafety(true));
    window.addEventListener('open-admin', () => setShowAdmin(true));
    window.addEventListener('open-profile', () => setActiveTab('profile'));
    window.addEventListener('view-tasks', () => setActiveTab('tasks'));
    window.addEventListener('view-messages', () => setActiveTab('messages'));
    window.addEventListener('open-voice-assistant', () => setShowVoiceAssistant(true));
    window.addEventListener('open-language-settings', () => setShowLanguageSettings(true));

    return () => {
      unsubscribe();
      window.removeEventListener('create-task', () => setShowCreateTask(true));
      window.removeEventListener('open-wallet', () => setShowWallet(true));
      window.removeEventListener('open-notifications', () => setShowNotifications(true));
      window.removeEventListener('open-faq', () => setShowFAQ(true));
      window.removeEventListener('open-safety', () => setShowSafety(true));
      window.removeEventListener('open-admin', () => setShowAdmin(true));
      window.removeEventListener('open-profile', () => setActiveTab('profile'));
      window.removeEventListener('view-tasks', () => setActiveTab('tasks'));
      window.removeEventListener('view-messages', () => setActiveTab('messages'));
      window.removeEventListener('open-voice-assistant', () => setShowVoiceAssistant(true));
      window.removeEventListener('open-language-settings', () => setShowLanguageSettings(true));
    };
  }, []);

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
    <Router>
      <LingoProvider>
        <TranslationProvider>
          <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <nav className="bg-gradient-to-r from-[#002B7F] to-[#0038FF] text-white p-4 shadow-md">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center">
                  <Zap className="w-6 h-6 mr-2" />
                  <span className="font-bold text-xl">Hustl</span>
                </div>
                
                <div className="hidden md:flex items-center space-x-6">
                  <button 
                    onClick={() => setActiveTab('home')}
                    className={`nav-link ${activeTab === 'home' ? 'font-bold' : ''}`}
                  >
                    <Home className="w-5 h-5 inline mr-1" />
                    Home
                  </button>
                  <button 
                    onClick={() => setActiveTab('tasks')}
                    className={`nav-link ${activeTab === 'tasks' ? 'font-bold' : ''}`}
                  >
                    <Package className="w-5 h-5 inline mr-1" />
                    Tasks
                  </button>
                  <button 
                    onClick={() => setActiveTab('messages')}
                    className={`nav-link ${activeTab === 'messages' ? 'font-bold' : ''}`}
                  >
                    <MessageSquare className="w-5 h-5 inline mr-1" />
                    Messages
                  </button>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className={`nav-link ${activeTab === 'profile' ? 'font-bold' : ''}`}
                  >
                    <User className="w-5 h-5 inline mr-1" />
                    Profile
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  {user ? (
                    <>
                      <button 
                        onClick={() => setShowNotifications(true)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <Bell className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setShowWallet(true)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <Wallet className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setShowFAQ(true)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <HelpCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowAuth(true)}
                        className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => setShowLearnMore(true)}
                        className="bg-white text-[#002B7F] px-3 py-1 rounded-lg transition-colors font-medium"
                      >
                        Learn More
                      </button>
                    </>
                  )}
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <main className="pb-16 md:pb-0">
              {user ? (
                <>
                  {activeTab === 'home' && (
                    <div className="max-w-7xl mx-auto px-4 py-6">
                      <TaskTemplates 
                        onSelectTemplate={(template) => {
                          setShowCreateTask(true);
                        }}
                      />
                    </div>
                  )}
                  
                  {activeTab === 'tasks' && (
                    <TaskMarketplace userLocation={location} />
                  )}
                  
                  {activeTab === 'messages' && (
                    <div className="max-w-7xl mx-auto px-4 py-6">
                      <ChatList userId={user.uid} currentUser={user} />
                    </div>
                  )}
                  
                  {activeTab === 'profile' && (
                    <div className="max-w-7xl mx-auto px-4 py-6">
                      <UserProfile />
                    </div>
                  )}
                </>
              ) : (
                <div className="max-w-7xl mx-auto px-4 py-6">
                  <TaskTemplates 
                    onSelectTemplate={(template) => {
                      setShowAuth(true);
                    }}
                  />
                </div>
              )}
            </main>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav 
              activeTab={activeTab} 
              onCreateTask={() => setShowCreateTask(true)} 
            />

            {/* Modals */}
            {showAuth && <Auth onClose={() => setShowAuth(false)} />}
            
            {showCreateTask && (
              <CreateTask 
                onClose={() => setShowCreateTask(false)} 
                userLocation={location}
              />
            )}
            
            {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}
            
            {showNotifications && (
              <NotificationsModal onClose={() => setShowNotifications(false)} />
            )}
            
            {showFAQ && <FAQSupport onClose={() => setShowFAQ(false)} />}
            
            {showSafety && <SafetyFeatures onClose={() => setShowSafety(false)} />}
            
            {showAdmin && <AdminTools onClose={() => setShowAdmin(false)} />}
            
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
            
            {showLearnMore && <LearnMoreModal onClose={() => setShowLearnMore(false)} />}
            
            {showVoiceAssistant && (
              <VoiceAssistantManager 
                onClose={() => setShowVoiceAssistant(false)}
                userLocation={location}
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

            {/* Toast Notifications */}
            <Toaster position="top-center" />
          </div>
        </TranslationProvider>
      </LingoProvider>
    </Router>
  );
}

export default Sentry.withProfiler(App);