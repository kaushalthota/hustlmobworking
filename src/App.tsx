import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Home, Package, MessageSquare, User, Menu, X, Bell, Wallet, HelpCircle, Shield, Plus } from 'lucide-react';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useGeolocation } from './hooks/useGeolocation';
import { LingoProvider } from 'lingo.dev/react/client';
import * as Sentry from "@sentry/react";

// Components
import Auth from './components/Auth';
import TaskMarketplace from './components/TaskMarketplace';
import UserProfile from './components/UserProfile';
import ChatList from './components/ChatList';
import CreateTask from './components/CreateTask';
import NotificationsModal from './components/NotificationsModal';
import WalletModal from './components/WalletModal';
import FAQSupport from './components/FAQSupport';
import SafetyFeatures from './components/SafetyFeatures';
import LearnMoreModal from './components/LearnMoreModal';
import QuickStartGuide from './components/QuickStartGuide';
import VoiceAssistantButton from './components/VoiceAssistantButton';
import VoiceAssistantManager from './components/VoiceAssistantManager';
import VoiceCommandTooltip from './components/VoiceCommandTooltip';
import LanguageSettingsModal from './components/LanguageSettingsModal';
import AdminTools from './components/AdminTools';
import TaskTemplates from './components/TaskTemplates';
import TaskCheckoutSuccess from './components/TaskCheckoutSuccess';

// Mobile Bottom Navigation
import MobileBottomNav from './components/MobileBottomNav';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [showVoiceTooltip, setShowVoiceTooltip] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [showAdminTools, setShowAdminTools] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  const { location } = useGeolocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      // Show quick start guide for new users
      if (user && !localStorage.getItem('quickStartGuideShown')) {
        setShowQuickStart(true);
      }
      
      // Show voice tooltip after a delay if not shown before
      if (user && !localStorage.getItem('voiceTooltipShown')) {
        setTimeout(() => {
          setShowVoiceTooltip(true);
          localStorage.setItem('voiceTooltipShown', 'true');
        }, 10000);
      }
    });

    // Listen for custom events
    window.addEventListener('create-task', () => setShowCreateTask(true));
    window.addEventListener('open-auth', () => setShowAuth(true));
    window.addEventListener('open-notifications', () => setShowNotifications(true));
    window.addEventListener('open-wallet', () => setShowWallet(true));
    window.addEventListener('open-faq', () => setShowFAQ(true));
    window.addEventListener('open-safety', () => setShowSafety(true));
    window.addEventListener('open-learn-more', () => setShowLearnMore(true));
    window.addEventListener('open-quick-start', () => setShowQuickStart(true));
    window.addEventListener('open-voice-assistant', () => setShowVoiceAssistant(true));
    window.addEventListener('open-language-settings', () => setShowLanguageSettings(true));
    window.addEventListener('open-admin-tools', () => setShowAdminTools(true));
    window.addEventListener('open-profile', () => setActiveTab('profile'));
    window.addEventListener('view-tasks', () => setActiveTab('tasks'));
    window.addEventListener('view-messages', () => setActiveTab('messages'));

    return () => {
      unsubscribe();
      window.removeEventListener('create-task', () => setShowCreateTask(true));
      window.removeEventListener('open-auth', () => setShowAuth(true));
      window.removeEventListener('open-notifications', () => setShowNotifications(true));
      window.removeEventListener('open-wallet', () => setShowWallet(true));
      window.removeEventListener('open-faq', () => setShowFAQ(true));
      window.removeEventListener('open-safety', () => setShowSafety(true));
      window.removeEventListener('open-learn-more', () => setShowLearnMore(true));
      window.removeEventListener('open-quick-start', () => setShowQuickStart(true));
      window.removeEventListener('open-voice-assistant', () => setShowVoiceAssistant(true));
      window.removeEventListener('open-language-settings', () => setShowLanguageSettings(true));
      window.removeEventListener('open-admin-tools', () => setShowAdminTools(true));
      window.removeEventListener('open-profile', () => setActiveTab('profile'));
      window.removeEventListener('view-tasks', () => setActiveTab('tasks'));
      window.removeEventListener('view-messages', () => setActiveTab('messages'));
    };
  }, []);

  const handleCreateTask = () => {
    if (!user) {
      setShowAuth(true);
    } else {
      setShowCreateTask(true);
    }
  };

  const handleVoiceTooltipClose = () => {
    setShowVoiceTooltip(false);
    localStorage.setItem('voiceTooltipShown', 'true');
  };

  const handleMobileMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <TaskTemplates onSelectTemplate={() => setShowCreateTask(true)} />;
      case 'tasks':
        return <TaskMarketplace userLocation={location} />;
      case 'messages':
        return user ? <ChatList userId={user.uid} currentUser={user} /> : <div>Please sign in to view messages</div>;
      case 'profile':
        return user ? <UserProfile /> : <div>Please sign in to view your profile</div>;
      default:
        return <TaskTemplates onSelectTemplate={() => setShowCreateTask(true)} />;
    }
  };

  return (
    <LingoProvider>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#002B7F] to-[#0038FF] text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo and Navigation */}
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <div className="w-10 h-10 mr-2">
                    <img src="/files_5770123-1751251303321-image.png" alt="Hustl Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-bold text-xl">Hustl</span>
                </div>
                <nav className="hidden md:ml-6 md:flex md:space-x-4">
                  <button 
                    onClick={() => setActiveTab('home')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'home' ? 'bg-[#0021A5] text-white' : 'text-white hover:bg-[#0021A5]/50'}`}
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => setActiveTab('tasks')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'tasks' ? 'bg-[#0021A5] text-white' : 'text-white hover:bg-[#0021A5]/50'}`}
                  >
                    Tasks
                  </button>
                  {user && (
                    <>
                      <button 
                        onClick={() => setActiveTab('messages')}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'messages' ? 'bg-[#0021A5] text-white' : 'text-white hover:bg-[#0021A5]/50'}`}
                      >
                        Messages
                      </button>
                      <button 
                        onClick={() => setActiveTab('profile')}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'profile' ? 'bg-[#0021A5] text-white' : 'text-white hover:bg-[#0021A5]/50'}`}
                      >
                        Profile
                      </button>
                    </>
                  )}
                </nav>
              </div>

              {/* Right side buttons */}
              <div className="flex items-center space-x-2">
                {/* Create Task Button - Hidden on mobile */}
                <button
                  onClick={handleCreateTask}
                  className="hidden md:flex items-center bg-[#FF4D23] hover:bg-[#E63A0B] text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
                >
                  <Plus className="w-5 h-5 mr-1" />
                  Post Task
                </button>

                {/* Notifications Button */}
                {user && (
                  <button
                    onClick={() => setShowNotifications(true)}
                    className="p-2 text-white hover:bg-[#0021A5] rounded-full transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                  </button>
                )}

                {/* Wallet Button */}
                {user && (
                  <button
                    onClick={() => setShowWallet(true)}
                    className="p-2 text-white hover:bg-[#0021A5] rounded-full transition-colors"
                  >
                    <Wallet className="w-5 h-5" />
                  </button>
                )}

                {/* Help Button */}
                <button
                  onClick={() => setShowFAQ(true)}
                  className="p-2 text-white hover:bg-[#0021A5] rounded-full transition-colors"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>

                {/* Safety Button */}
                <button
                  onClick={() => setShowSafety(true)}
                  className="p-2 text-white hover:bg-[#0021A5] rounded-full transition-colors"
                >
                  <Shield className="w-5 h-5" />
                </button>

                {/* Auth Button */}
                {!user ? (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="hidden md:block bg-white text-[#002B7F] hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold transition duration-200"
                  >
                    Sign In
                  </button>
                ) : (
                  <button
                    onClick={() => auth.signOut()}
                    className="hidden md:block bg-white text-[#002B7F] hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold transition duration-200"
                  >
                    Sign Out
                  </button>
                )}

                {/* Mobile Menu Button */}
                <button
                  onClick={handleMobileMenuToggle}
                  className="md:hidden p-2 text-white hover:bg-[#0021A5] rounded-full transition-colors"
                >
                  {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden bg-[#0021A5] py-2 px-4">
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab('home');
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#001B8C]"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setActiveTab('tasks');
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#001B8C]"
                >
                  Tasks
                </button>
                {user && (
                  <>
                    <button
                      onClick={() => {
                        setActiveTab('messages');
                        setShowMobileMenu(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#001B8C]"
                    >
                      Messages
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowMobileMenu(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#001B8C]"
                    >
                      Profile
                    </button>
                  </>
                )}
                {!user ? (
                  <button
                    onClick={() => {
                      setShowAuth(true);
                      setShowMobileMenu(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#001B8C]"
                  >
                    Sign In
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      auth.signOut();
                      setShowMobileMenu(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#001B8C]"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 pb-16 md:pb-0">
          {renderContent()}
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden">
          <MobileBottomNav 
            activeTab={activeTab} 
            onCreateTask={handleCreateTask}
          />
        </div>

        {/* Modals */}
        {showAuth && <Auth onClose={() => setShowAuth(false)} />}
        {showCreateTask && <CreateTask onClose={() => setShowCreateTask(false)} userLocation={location} />}
        {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
        {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}
        {showFAQ && <FAQSupport onClose={() => setShowFAQ(false)} />}
        {showSafety && <SafetyFeatures onClose={() => setShowSafety(false)} />}
        {showLearnMore && <LearnMoreModal onClose={() => setShowLearnMore(false)} />}
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
          <VoiceCommandTooltip onClose={handleVoiceTooltipClose} />
        )}
        {showLanguageSettings && (
          <LanguageSettingsModal onClose={() => setShowLanguageSettings(false)} />
        )}
        {showAdminTools && (
          <AdminTools onClose={() => setShowAdminTools(false)} />
        )}

        {/* Voice Assistant Button */}
        <VoiceAssistantButton onClick={() => setShowVoiceAssistant(true)} />

        {/* Toast Container */}
        <Toaster position="top-center" />

        {/* Task Checkout Success */}
        <TaskCheckoutSuccess 
          onClose={() => {}} 
          onViewTask={(taskId) => {
            setActiveTab('tasks');
          }}
        />
      </div>
    </LingoProvider>
  );
}

export default Sentry.withProfiler(App);