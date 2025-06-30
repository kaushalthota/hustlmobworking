import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Auth from './components/Auth';
import TaskMarketplace from './components/TaskMarketplace';
import UserProfile from './components/UserProfile';
import TaskHistory from './components/TaskHistory';
import CreateTask from './components/CreateTask';
import ChatList from './components/ChatList';
import WalletModal from './components/WalletModal';
import NotificationsModal from './components/NotificationsModal';
import AdminTools from './components/AdminTools';
import FAQSupport from './components/FAQSupport';
import SafetyFeatures from './components/SafetyFeatures';
import LearnMoreModal from './components/LearnMoreModal';
import QuickStartGuide from './components/QuickStartGuide';
import TaskTemplates from './components/TaskTemplates';
import TaskCreationSuccess from './components/TaskCreationSuccess';
import TaskCheckoutSuccess from './components/TaskCheckoutSuccess';
import VoiceAssistantButton from './components/VoiceAssistantButton';
import VoiceAssistantManager from './components/VoiceAssistantManager';
import VoiceCommandTooltip from './components/VoiceCommandTooltip';
import LanguageSettingsModal from './components/LanguageSettingsModal';
import { useGeolocation } from './hooks/useGeolocation';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Zap, Search, User, MessageSquare, Bell, Wallet, Menu, X, Info, HelpCircle, Shield, Languages } from 'lucide-react';
import * as Sentry from "@sentry/react";
import { captureMessage } from './lib/sentryUtils';
import ErrorBoundaryTest from './components/ErrorBoundaryTest';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAdminTools, setShowAdminTools] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'browse' | 'create' | 'messages' | 'profile'>('home');
  const [showTaskTemplates, setShowTaskTemplates] = useState(false);
  const [showTaskCreationSuccess, setShowTaskCreationSuccess] = useState(false);
  const [createdTaskId, setCreatedTaskId] = useState<string | null>(null);
  const [showTaskCheckoutSuccess, setShowTaskCheckoutSuccess] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [showVoiceTooltip, setShowVoiceTooltip] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const { location } = useGeolocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      // Show quick start guide for new users
      if (user && !localStorage.getItem('quickStartGuideShown')) {
        setShowQuickStart(true);
      }
      
      // Log authentication state to Sentry
      if (user) {
        captureMessage("User authenticated", "info");
      }
    });

    // Listen for custom events
    window.addEventListener('create-task', handleCreateTask);
    window.addEventListener('view-tasks', handleViewTasks);
    window.addEventListener('open-profile', handleOpenProfile);
    window.addEventListener('open-wallet', handleOpenWallet);
    window.addEventListener('open-faq', handleOpenFAQ);
    window.addEventListener('open-safety', handleOpenSafety);
    window.addEventListener('view-messages', handleViewMessages);
    
    // Show voice tooltip after a delay if not shown before
    const voiceTooltipShown = localStorage.getItem('voiceTooltipShown');
    if (!voiceTooltipShown) {
      setTimeout(() => {
        setShowVoiceTooltip(true);
        localStorage.setItem('voiceTooltipShown', 'true');
      }, 30000); // Show after 30 seconds
    }

    return () => {
      unsubscribe();
      window.removeEventListener('create-task', handleCreateTask);
      window.removeEventListener('view-tasks', handleViewTasks);
      window.removeEventListener('open-profile', handleOpenProfile);
      window.removeEventListener('open-wallet', handleOpenWallet);
      window.removeEventListener('open-faq', handleOpenFAQ);
      window.removeEventListener('open-safety', handleOpenSafety);
      window.removeEventListener('view-messages', handleViewMessages);
    };
  }, []);

  const handleCreateTask = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setShowTaskTemplates(true);
  };

  const handleViewTasks = () => {
    setActiveTab('browse');
  };

  const handleOpenProfile = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setShowProfile(true);
  };

  const handleOpenWallet = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setShowWallet(true);
  };

  const handleOpenFAQ = () => {
    setShowFAQ(true);
  };

  const handleOpenSafety = () => {
    setShowSafety(true);
  };

  const handleViewMessages = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setShowChat(true);
  };

  const handleTaskCreated = (taskId: string) => {
    setShowTaskTemplates(false);
    setShowCreateTask(false);
    setCreatedTaskId(taskId);
    setShowTaskCreationSuccess(true);
  };

  const handleVoiceAssistantClick = () => {
    setShowVoiceAssistant(true);
    setShowVoiceTooltip(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-[#0038FF] to-[#0021A5]">
        <div className="w-32 h-32 mb-8 animate-pulse">
          <img src="/files_5770123-1751251303321-image.png" alt="Hustl Logo" className="w-full h-full object-contain" />
        </div>
        <div className="w-16 h-16 border-t-4 border-white rounded-full animate-spin"></div>
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
              <span className="font-bold text-xl hidden sm:block">Hustl</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <button 
                    onClick={() => setActiveTab('home')}
                    className={`nav-link px-3 py-2 rounded-md ${activeTab === 'home' ? 'bg-white/10' : ''}`}
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => setActiveTab('browse')}
                    className={`nav-link px-3 py-2 rounded-md ${activeTab === 'browse' ? 'bg-white/10' : ''}`}
                  >
                    Browse Tasks
                  </button>
                  <button 
                    onClick={handleCreateTask}
                    className="nav-button flex items-center"
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Post Task
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleOpenProfile}
                    className="nav-link"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => setShowAuth(true)}
                    className="nav-button"
                  >
                    Sign Up
                  </button>
                </>
              )}
              <button
                onClick={() => setShowLanguageSettings(true)}
                className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Language settings"
              >
                <Languages className="w-5 h-5" />
              </button>
            </nav>
            
            {/* User Menu (Desktop) */}
            {user && (
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => setShowNotifications(true)}
                  className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowWallet(true)}
                  className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Wallet"
                >
                  <Wallet className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowChat(true)}
                  className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowProfile(true)}
                  className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Profile"
                >
                  <User className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-md text-white hover:bg-white/10 transition-colors"
                aria-label="Menu"
              >
                {showMobileMenu ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    setShowMobileMenu(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    activeTab === 'home' ? 'bg-blue-50 text-[#0038FF]' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setActiveTab('browse');
                    setShowMobileMenu(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    activeTab === 'browse' ? 'bg-blue-50 text-[#0038FF]' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Browse Tasks
                </button>
                <button
                  onClick={() => {
                    handleCreateTask();
                    setShowMobileMenu(false);
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium w-full text-left bg-[#0038FF] text-white"
                >
                  Post Task
                </button>
                <button
                  onClick={() => {
                    setShowChat(true);
                    setShowMobileMenu(false);
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium w-full text-left text-gray-700 hover:bg-gray-50"
                >
                  Messages
                </button>
                <button
                  onClick={() => {
                    setShowWallet(true);
                    setShowMobileMenu(false);
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium w-full text-left text-gray-700 hover:bg-gray-50"
                >
                  Wallet
                </button>
                <button
                  onClick={() => {
                    setShowProfile(true);
                    setShowMobileMenu(false);
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium w-full text-left text-gray-700 hover:bg-gray-50"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setShowNotifications(true);
                    setShowMobileMenu(false);
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium w-full text-left text-gray-700 hover:bg-gray-50"
                >
                  Notifications
                </button>
                <button
                  onClick={() => {
                    setShowLanguageSettings(true);
                    setShowMobileMenu(false);
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium w-full text-left text-gray-700 hover:bg-gray-50"
                >
                  Language Settings
                </button>
                <button
                  onClick={() => {
                    auth.signOut();
                    setShowMobileMenu(false);
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium w-full text-left text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowAuth(true);
                    setShowMobileMenu(false);
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium w-full text-left text-gray-700 hover:bg-gray-50"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setShowAuth(true);
                    setShowMobileMenu(false);
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium w-full text-left bg-[#0038FF] text-white"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => {
                    setShowLanguageSettings(true);
                    setShowMobileMenu(false);
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium w-full text-left text-gray-700 hover:bg-gray-50"
                >
                  Language Settings
                </button>
              </>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-4 py-2">
              <button
                onClick={() => {
                  setShowFAQ(true);
                  setShowMobileMenu(false);
                }}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium w-full text-left text-gray-700 hover:bg-gray-50"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                Help & Support
              </button>
              <button
                onClick={() => {
                  setShowSafety(true);
                  setShowMobileMenu(false);
                }}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium w-full text-left text-gray-700 hover:bg-gray-50"
              >
                <Shield className="w-5 h-5 mr-2" />
                Safety Features
              </button>
              <button
                onClick={() => {
                  setShowLearnMore(true);
                  setShowMobileMenu(false);
                }}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium w-full text-left text-gray-700 hover:bg-gray-50"
              >
                <Info className="w-5 h-5 mr-2" />
                About Hustl
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Navigation Bar */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 md:hidden z-10">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activeTab === 'home' ? 'text-[#0038FF]' : 'text-gray-500'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activeTab === 'browse' ? 'text-[#0038FF]' : 'text-gray-500'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs mt-1">Browse</span>
          </button>
          <button
            onClick={handleCreateTask}
            className="flex flex-col items-center justify-center w-full h-full"
          >
            <div className="bg-[#0038FF] rounded-full p-3 -mt-6 shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs mt-1 text-[#0038FF]">Post</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('messages');
              setShowChat(true);
            }}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activeTab === 'messages' ? 'text-[#0038FF]' : 'text-gray-500'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs mt-1">Messages</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('profile');
              setShowProfile(true);
            }}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activeTab === 'profile' ? 'text-[#0038FF]' : 'text-gray-500'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      )}
      
      {/* Main Content */}
      <main className={`${user ? 'pb-20 md:pb-0' : ''}`}>
        {activeTab === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto mb-4">
                <img src="/files_5770123-1751251303321-image.png" alt="Hustl Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Welcome to Hustl</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                UF's campus task platform. Get help with quick tasks or earn money helping others.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleCreateTask}
                  className="btn-gradient-secondary btn-shine px-6 py-3 text-lg font-semibold"
                >
                  Post a Task
                </button>
                <button
                  onClick={handleViewTasks}
                  className="btn-gradient-primary btn-shine px-6 py-3 text-lg font-semibold"
                >
                  Browse Tasks
                </button>
              </div>
            </div>
            
            {!user && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAuth(true)}
                  className="text-[#0038FF] hover:text-[#0021A5] font-medium"
                >
                  Sign in to get started
                </button>
              </div>
            )}
            
            <div className="mt-12">
              <TaskTemplates 
                onSelectTemplate={(template) => {
                  if (!user) {
                    setShowAuth(true);
                    return;
                  }
                  setShowCreateTask(true);
                }}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'browse' && (
          <TaskMarketplace userLocation={location} />
        )}
        
        {/* Admin Tools Button (only visible for admin users) */}
        {user && (user.email === 'kaushalthota1@gmail.com' || user.email === 'apoorvamahajan94@gmail.com') && (
          <div className="fixed bottom-20 right-6 z-20">
            <button
              onClick={() => setShowAdminTools(true)}
              className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors"
            >
              <Shield className="w-6 h-6" />
            </button>
          </div>
        )}
        
        {/* Voice Assistant Button */}
        <VoiceAssistantButton onClick={handleVoiceAssistantClick} />
        
        {/* Voice Assistant Tooltip */}
        {showVoiceTooltip && (
          <VoiceCommandTooltip onClose={() => setShowVoiceTooltip(false)} />
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 mr-2">
                <img src="/files_5770123-1751251303321-image.png" alt="Hustl Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold">Hustl</span>
            </div>
            
            <div className="flex space-x-6">
              <button
                onClick={() => setShowLearnMore(true)}
                className="text-gray-600 hover:text-gray-900"
              >
                About
              </button>
              <button
                onClick={() => setShowFAQ(true)}
                className="text-gray-600 hover:text-gray-900"
              >
                Help
              </button>
              <button
                onClick={() => setShowSafety(true)}
                className="text-gray-600 hover:text-gray-900"
              >
                Safety
              </button>
            </div>
            
            <div className="mt-4 md:mt-0 text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Hustl. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      
      {/* Modals */}
      {showAuth && <Auth onClose={() => setShowAuth(false)} />}
      {showProfile && <UserProfile />}
      {showCreateTask && (
        <CreateTask 
          onClose={() => setShowCreateTask(false)} 
          onTaskCreated={handleTaskCreated}
          userLocation={location}
        />
      )}
      {showChat && <ChatList userId={user?.uid} currentUser={user} />}
      {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}
      {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
      {showAdminTools && <AdminTools onClose={() => setShowAdminTools(false)} />}
      {showFAQ && <FAQSupport onClose={() => setShowFAQ(false)} />}
      {showSafety && <SafetyFeatures onClose={() => setShowSafety(false)} />}
      {showLearnMore && <LearnMoreModal onClose={() => setShowLearnMore(false)} />}
      {showQuickStart && (
        <QuickStartGuide 
          onClose={() => setShowQuickStart(false)} 
          onCreateTask={handleCreateTask}
          onBrowseTasks={handleViewTasks}
        />
      )}
      {showTaskTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Create a Task</h2>
              <button onClick={() => setShowTaskTemplates(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <TaskTemplates 
                onSelectTemplate={(template) => {
                  setShowTaskTemplates(false);
                  setShowCreateTask(true);
                }}
              />
            </div>
          </div>
        </div>
      )}
      {showTaskCreationSuccess && createdTaskId && (
        <TaskCreationSuccess 
          taskId={createdTaskId} 
          onClose={() => setShowTaskCreationSuccess(false)}
          onViewTask={() => {
            setShowTaskCreationSuccess(false);
            setActiveTab('browse');
          }}
        />
      )}
      {showTaskCheckoutSuccess && (
        <TaskCheckoutSuccess 
          onClose={() => setShowTaskCheckoutSuccess(false)}
          onViewTask={(taskId) => {
            setShowTaskCheckoutSuccess(false);
            setActiveTab('browse');
          }}
        />
      )}
      {showVoiceAssistant && (
        <VoiceAssistantManager 
          onClose={() => setShowVoiceAssistant(false)}
          userLocation={location}
          onCreateTask={handleCreateTask}
          onBrowseTasks={handleViewTasks}
          onOpenWallet={() => setShowWallet(true)}
          onOpenProfile={() => setShowProfile(true)}
          onOpenHelp={() => setShowFAQ(true)}
          onOpenSafety={() => setShowSafety(true)}
        />
      )}
      {showLanguageSettings && (
        <LanguageSettingsModal onClose={() => setShowLanguageSettings(false)} />
      )}
      
      {/* Sentry Test Component - Only in development */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 left-4 z-50">
          <ErrorBoundaryTest showControls={false} />
        </div>
      )}
    </div>
  );
}

export default Sentry.withProfiler(App);