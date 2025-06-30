import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Auth from './components/Auth';
import TaskMarketplace from './components/TaskMarketplace';
import UserProfile from './components/UserProfile';
import CreateTask from './components/CreateTask';
import ChatList from './components/ChatList';
import WalletModal from './components/WalletModal';
import NotificationsModal from './components/NotificationsModal';
import AdminTools from './components/AdminTools';
import FAQSupport from './components/FAQSupport';
import SafetyFeatures from './components/SafetyFeatures';
import LearnMoreModal from './components/LearnMoreModal';
import QuickStartGuide from './components/QuickStartGuide';
import VoiceAssistantButton from './components/VoiceAssistantButton';
import VoiceAssistantManager from './components/VoiceAssistantManager';
import VoiceCommandTooltip from './components/VoiceCommandTooltip';
import { useGeolocation } from './hooks/useGeolocation';
import { Bell, MessageSquare, Wallet, User, Package, Search, Menu, X, HelpCircle, Shield, Info, LogOut } from 'lucide-react';
import TaskTemplates from './components/TaskTemplates';
import TaskHistory from './components/TaskHistory';
import LanguageSettingsModal from './components/LanguageSettingsModal';
import { useTranslation } from './components/TranslationProvider';
import * as Sentry from "@sentry/react";
import ErrorBoundaryTest from './components/ErrorBoundaryTest';
import SentryTest from './components/SentryTest';
import TaskCheckoutSuccess from './components/TaskCheckoutSuccess';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'tasks' | 'messages' | 'profile'>('home');
  const [showAuth, setShowAuth] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAdminTools, setShowAdminTools] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [showVoiceTooltip, setShowVoiceTooltip] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const { location, loading: locationLoading } = useGeolocation();
  const { currentLanguage } = useTranslation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
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
    window.addEventListener('view-messages', () => setActiveTab('messages'));
    window.addEventListener('open-wallet', () => setShowWallet(true));
    window.addEventListener('open-profile', () => setActiveTab('profile'));
    window.addEventListener('open-faq', () => setShowFAQ(true));
    window.addEventListener('open-safety', () => setShowSafety(true));
    window.addEventListener('open-admin', () => setShowAdminTools(true));

    // Check URL parameters for checkout success
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true' && urlParams.get('task_id')) {
      setShowCheckoutSuccess(true);
    }

    return () => {
      unsubscribe();
      window.removeEventListener('create-task', () => setShowCreateTask(true));
      window.removeEventListener('view-tasks', () => setActiveTab('tasks'));
      window.removeEventListener('view-messages', () => setActiveTab('messages'));
      window.removeEventListener('open-wallet', () => setShowWallet(true));
      window.removeEventListener('open-profile', () => setActiveTab('profile'));
      window.removeEventListener('open-faq', () => setShowFAQ(true));
      window.removeEventListener('open-safety', () => setShowSafety(true));
      window.removeEventListener('open-admin', () => setShowAdminTools(true));
    };
  }, []);

  const handleSignOut = () => {
    auth.signOut();
    setActiveTab('home');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-[#0038FF] to-[#0021A5]">
        <div className="w-24 h-24 mb-4">
          <img src="/files_5770123-1751251303321-image.png" alt="Hustl Logo" className="w-full h-full object-contain" />
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0038FF] to-[#0021A5] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 mr-2">
                <img src="/files_5770123-1751251303321-image.png" alt="Hustl Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-xl">Hustl</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4 items-center">
              {user ? (
                <>
                  <button
                    onClick={() => setActiveTab('home')}
                    className={`nav-link ${activeTab === 'home' ? 'font-bold' : ''}`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`nav-link ${activeTab === 'tasks' ? 'font-bold' : ''}`}
                  >
                    Browse Tasks
                  </button>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className={`nav-link ${activeTab === 'messages' ? 'font-bold' : ''}`}
                  >
                    Messages
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`nav-link ${activeTab === 'profile' ? 'font-bold' : ''}`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setShowWallet(true)}
                    className="nav-link"
                  >
                    Wallet
                  </button>
                  <button
                    onClick={() => setShowNotifications(true)}
                    className="nav-link"
                  >
                    Notifications
                  </button>
                  <button
                    onClick={() => setShowCreateTask(true)}
                    className="nav-button"
                  >
                    Post Task
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLearnMore(true)}
                    className="nav-link"
                  >
                    Learn More
                  </button>
                  <button
                    onClick={() => setShowAuth(true)}
                    className="nav-button"
                  >
                    Sign In
                  </button>
                </>
              )}
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-white p-2"
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white shadow-lg z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setActiveTab('tasks');
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Browse Tasks
                </button>
                <button
                  onClick={() => {
                    setActiveTab('messages');
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Messages
                </button>
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setShowWallet(true);
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Wallet
                </button>
                <button
                  onClick={() => {
                    setShowNotifications(true);
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Notifications
                </button>
                <button
                  onClick={() => {
                    setShowCreateTask(true);
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-[#0038FF] text-white hover:bg-[#0021A5]"
                >
                  Post Task
                </button>
                <div className="border-t border-gray-200 my-2"></div>
                <button
                  onClick={() => {
                    setShowFAQ(true);
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Help & Support
                </button>
                <button
                  onClick={() => {
                    setShowSafety(true);
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Safety Features
                </button>
                <button
                  onClick={() => {
                    setShowLanguageSettings(true);
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Language Settings
                </button>
                <button
                  onClick={() => {
                    handleSignOut();
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowLearnMore(true);
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Learn More
                </button>
                <button
                  onClick={() => {
                    setShowAuth(true);
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-[#0038FF] text-white hover:bg-[#0021A5]"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto pb-16">
        {user ? (
          <>
            {activeTab === 'home' && (
              <div className="px-4 sm:px-6 lg:px-8 py-6">
                <TaskTemplates 
                  onSelectTemplate={(template) => {
                    setShowCreateTask(true);
                  }}
                  onSelectLocation={(location) => {
                    // Handle location selection
                  }}
                />
              </div>
            )}
            
            {activeTab === 'tasks' && (
              <TaskMarketplace userLocation={location} />
            )}
            
            {activeTab === 'messages' && (
              <div className="px-4 sm:px-6 lg:px-8 py-6">
                <ChatList userId={user.uid} currentUser={user} />
              </div>
            )}
            
            {activeTab === 'profile' && (
              <div className="px-4 sm:px-6 lg:px-8 py-6">
                <UserProfile />
              </div>
            )}
          </>
        ) : (
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <TaskTemplates 
              onSelectTemplate={(template) => {
                setShowAuth(true);
              }}
            />
          </div>
        )}
      </main>
      
      {/* Mobile Navigation */}
      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="grid grid-cols-5 h-16">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center ${
                activeTab === 'home' ? 'text-[#0038FF]' : 'text-gray-500'
              }`}
            >
              <Package className="h-6 w-6" />
              <span className="text-xs mt-1">Home</span>
            </button>
            
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex flex-col items-center justify-center ${
                activeTab === 'tasks' ? 'text-[#0038FF]' : 'text-gray-500'
              }`}
            >
              <Search className="h-6 w-6" />
              <span className="text-xs mt-1">Tasks</span>
            </button>
            
            <button
              onClick={() => setShowCreateTask(true)}
              className="flex flex-col items-center justify-center"
            >
              <div className="bg-[#0038FF] text-white rounded-full p-3 -mt-6 shadow-lg">
                <Package className="h-6 w-6" />
              </div>
              <span className="text-xs mt-1 text-[#0038FF]">Post</span>
            </button>
            
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex flex-col items-center justify-center ${
                activeTab === 'messages' ? 'text-[#0038FF]' : 'text-gray-500'
              }`}
            >
              <MessageSquare className="h-6 w-6" />
              <span className="text-xs mt-1">Messages</span>
            </button>
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center ${
                activeTab === 'profile' ? 'text-[#0038FF]' : 'text-gray-500'
              }`}
            >
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">Profile</span>
            </button>
          </div>
        </nav>
      )}
      
      {/* Modals */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Auth onClose={() => setShowAuth(false)} />
        </div>
      )}
      
      {showCreateTask && (
        <CreateTask onClose={() => setShowCreateTask(false)} userLocation={location} />
      )}
      
      {showWallet && (
        <WalletModal onClose={() => setShowWallet(false)} />
      )}
      
      {showNotifications && (
        <NotificationsModal onClose={() => setShowNotifications(false)} />
      )}
      
      {showAdminTools && (
        <AdminTools onClose={() => setShowAdminTools(false)} />
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
        <VoiceCommandTooltip onClose={() => setShowVoiceTooltip(false)} />
      )}
      
      {showLanguageSettings && (
        <LanguageSettingsModal onClose={() => setShowLanguageSettings(false)} />
      )}
      
      {showCheckoutSuccess && (
        <TaskCheckoutSuccess 
          onClose={() => setShowCheckoutSuccess(false)}
          onViewTask={(taskId) => {
            setShowCheckoutSuccess(false);
            setActiveTab('tasks');
          }}
        />
      )}
      
      {/* Voice Assistant Button */}
      {user && (
        <VoiceAssistantButton onClick={() => setShowVoiceAssistant(true)} />
      )}
      
      {/* Admin Button - Only visible for specific users */}
      {user && (user.email === 'kaushalthota1@gmail.com' || user.email === 'apoorvamahajan94@gmail.com') && (
        <div className="fixed bottom-6 left-6 z-30">
          <button
            onClick={() => setShowAdminTools(true)}
            className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors"
            title="Admin Tools"
          >
            <Shield className="w-6 h-6" />
          </button>
        </div>
      )}
      
      {/* Language Settings Button */}
      <div className="fixed bottom-6 left-6 z-20">
        <button
          onClick={() => setShowLanguageSettings(true)}
          className="bg-white text-[#0038FF] p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
          title={`Current Language: ${currentLanguage.toUpperCase()}`}
        >
          {currentLanguage.toUpperCase()}
        </button>
      </div>
      
      {/* Help Button */}
      <div className="fixed bottom-20 left-6 z-20">
        <button
          onClick={() => setShowFAQ(true)}
          className="bg-white text-[#0038FF] p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
          title="Help & Support"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
      
      {/* Safety Button */}
      <div className="fixed bottom-32 left-6 z-20">
        <button
          onClick={() => setShowSafety(true)}
          className="bg-white text-[#0038FF] p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
          title="Safety Features"
        >
          <Shield className="w-5 h-5" />
        </button>
      </div>
      
      {/* Info Button */}
      <div className="fixed bottom-44 left-6 z-20">
        <button
          onClick={() => setShowLearnMore(true)}
          className="bg-white text-[#0038FF] p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
          title="About Hustl"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
      
      {/* Sentry Test Components - Only in development */}
      {import.meta.env.DEV && (
        <div className="fixed top-20 right-4 z-50">
          <ErrorBoundaryTest showControls={false} />
        </div>
      )}
    </div>
  );
};

export default App;