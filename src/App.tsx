import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Zap, MessageSquare, User, Home, Package, Bell, Wallet, HelpCircle } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Auth from './components/Auth';
import TaskMarketplace from './components/TaskMarketplace';
import ChatList from './components/ChatList';
import UserProfile from './components/UserProfile';
import CreateTask from './components/CreateTask';
import TaskTemplates from './components/TaskTemplates';
import MobileBottomNav from './components/MobileBottomNav';
import NotificationsModal from './components/NotificationsModal';
import WalletModal from './components/WalletModal';
import FAQSupport from './components/FAQSupport';
import SafetyFeatures from './components/SafetyFeatures';
import LearnMoreModal from './components/LearnMoreModal';
import QuickStartGuide from './components/QuickStartGuide';
import AdminTools from './components/AdminTools';
import TaskCheckoutSuccess from './components/TaskCheckoutSuccess';
import VoiceAssistantButton from './components/VoiceAssistantButton';
import VoiceAssistantManager from './components/VoiceAssistantManager';
import LanguageSettingsModal from './components/LanguageSettingsModal';
import { useGeolocation } from './hooks/useGeolocation';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import * as Sentry from "@sentry/react";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [showAdminTools, setShowAdminTools] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const { location } = useGeolocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // Set user in Sentry
      if (currentUser) {
        Sentry.setUser({
          id: currentUser.uid,
          email: currentUser.email || undefined,
          username: currentUser.displayName || undefined
        });
      } else {
        Sentry.setUser(null);
      }
    });

    // Listen for custom events
    window.addEventListener('create-task', () => setShowCreateTask(true));
    window.addEventListener('view-tasks', () => setActiveTab('tasks'));
    window.addEventListener('view-messages', () => setActiveTab('messages'));
    window.addEventListener('open-profile', () => setActiveTab('profile'));
    window.addEventListener('open-notifications', () => setShowNotifications(true));
    window.addEventListener('open-wallet', () => setShowWallet(true));
    window.addEventListener('open-faq', () => setShowFAQ(true));
    window.addEventListener('open-safety', () => setShowSafety(true));
    window.addEventListener('open-language-settings', () => setShowLanguageSettings(true));
    
    // Check URL parameters for task checkout success
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success') === 'true';
    const taskId = urlParams.get('task_id');
    
    if (success && taskId) {
      // Show task checkout success modal
      // This will be handled by the TaskCheckoutSuccess component
    }

    return () => {
      unsubscribe();
      window.removeEventListener('create-task', () => setShowCreateTask(true));
      window.removeEventListener('view-tasks', () => setActiveTab('tasks'));
      window.removeEventListener('view-messages', () => setActiveTab('messages'));
      window.removeEventListener('open-profile', () => setActiveTab('profile'));
      window.removeEventListener('open-notifications', () => setShowNotifications(true));
      window.removeEventListener('open-wallet', () => setShowWallet(true));
      window.removeEventListener('open-faq', () => setShowFAQ(true));
      window.removeEventListener('open-safety', () => setShowSafety(true));
      window.removeEventListener('open-language-settings', () => setShowLanguageSettings(true));
    };
  }, []);

  const handleCreateTask = () => {
    if (!user) {
      setShowAuth(true);
    } else {
      setShowCreateTask(true);
    }
  };

  const handleSignIn = () => {
    setShowAuth(true);
  };

  const handleSignOut = () => {
    auth.signOut();
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
      <div className="min-h-screen bg-gray-50">
        {/* Bolt Badge */}
        <a 
          href="https://bolt.new" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed top-4 right-4 z-50 transition-opacity hover:opacity-100 opacity-70"
          title="Powered by Bolt.new"
        >
          <img 
            src="/black_circle_360x360.png" 
            alt="Powered by Bolt.new" 
            className="w-12 h-12"
          />
        </a>

        {/* Navigation */}
        <nav className="bg-gradient-to-r from-[#0F2557] to-[#0038FF] text-white p-4 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <Zap className="w-6 h-6 mr-2" />
              <span className="text-xl font-bold">Hustl</span>
            </div>
            <div className="hidden md:flex space-x-6 items-center">
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
              {user && (
                <>
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
                </>
              )}
              <button
                onClick={() => setShowLearnMore(true)}
                className="nav-link"
              >
                About
              </button>
            </div>
            <div className="flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-2">
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
                    className="nav-button"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="nav-button"
                >
                  Sign In
                </button>
              )}
              <button
                onClick={handleCreateTask}
                className="bg-[#FF4D23] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#E63A0B] transition duration-200 shadow-md flex items-center"
              >
                <Zap className="w-5 h-5 mr-2" />
                Post Task
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {activeTab === 'home' && (
            <TaskTemplates 
              onSelectTemplate={(template) => {
                if (user) {
                  setShowCreateTask(true);
                } else {
                  setShowAuth(true);
                }
              }}
            />
          )}
          {activeTab === 'tasks' && (
            <TaskMarketplace userLocation={location} />
          )}
          {activeTab === 'messages' && user && (
            <ChatList userId={user.uid} currentUser={user} />
          )}
          {activeTab === 'profile' && user && (
            <UserProfile />
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden">
          <MobileBottomNav 
            activeTab={activeTab} 
            onCreateTask={handleCreateTask} 
          />
        </div>

        {/* Modals */}
        {showAuth && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Auth onClose={() => setShowAuth(false)} />
          </div>
        )}

        {showCreateTask && (
          <CreateTask 
            onClose={() => setShowCreateTask(false)} 
            userLocation={location}
          />
        )}

        {showNotifications && (
          <NotificationsModal onClose={() => setShowNotifications(false)} />
        )}

        {showWallet && (
          <WalletModal onClose={() => setShowWallet(false)} />
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

        {showAdminTools && (
          <AdminTools onClose={() => setShowAdminTools(false)} />
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

        {showLanguageSettings && (
          <LanguageSettingsModal onClose={() => setShowLanguageSettings(false)} />
        )}

        {/* Voice Assistant Button */}
        {user && (
          <VoiceAssistantButton onClick={() => setShowVoiceAssistant(true)} />
        )}

        {/* Task Checkout Success Modal */}
        <TaskCheckoutSuccess 
          onClose={() => {
            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
          }}
          onViewTask={() => {
            // Clear URL parameters and switch to tasks tab
            window.history.replaceState({}, document.title, window.location.pathname);
            setActiveTab('tasks');
          }}
        />

        {/* Toast Container */}
        <Toaster position="bottom-center" />
      </div>
    </Router>
  );
}

export default App;