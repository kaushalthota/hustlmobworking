import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import * as Sentry from "@sentry/react";

// Components
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
import TaskTemplates from './components/TaskTemplates';
import ErrorBoundaryTest from './components/ErrorBoundaryTest';
import SentryTest from './components/SentryTest';

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
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [showVoiceTooltip, setShowVoiceTooltip] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'tasks' | 'messages' | 'profile'>('home');
  const { location: userLocation } = useGeolocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      // Show quick start guide for new users
      if (user && !localStorage.getItem('quickStartShown')) {
        setShowQuickStart(true);
        localStorage.setItem('quickStartShown', 'true');
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
    window.addEventListener('open-wallet', () => setShowWallet(true));
    window.addEventListener('open-notifications', () => setShowNotifications(true));
    window.addEventListener('open-faq', () => setShowFAQ(true));
    window.addEventListener('open-safety', () => setShowSafety(true));
    window.addEventListener('open-admin', () => setShowAdmin(true));
    window.addEventListener('open-profile', () => setActiveTab('profile'));
    window.addEventListener('create-task', () => setShowCreateTask(true));
    window.addEventListener('view-tasks', () => setActiveTab('tasks'));
    window.addEventListener('view-messages', () => setActiveTab('messages'));
    window.addEventListener('open-language-settings', () => setShowLanguageSettings(true));
    
    // Listen for profile tab changes
    window.addEventListener('set-profile-tab', (event: any) => {
      if (event.detail && event.detail.tab) {
        setActiveTab(event.detail.tab);
      }
    });

    return () => {
      unsubscribe();
      window.removeEventListener('open-wallet', () => setShowWallet(true));
      window.removeEventListener('open-notifications', () => setShowNotifications(true));
      window.removeEventListener('open-faq', () => setShowFAQ(true));
      window.removeEventListener('open-safety', () => setShowSafety(true));
      window.removeEventListener('open-admin', () => setShowAdmin(true));
      window.removeEventListener('open-profile', () => setActiveTab('profile'));
      window.removeEventListener('create-task', () => setShowCreateTask(true));
      window.removeEventListener('view-tasks', () => setActiveTab('tasks'));
      window.removeEventListener('view-messages', () => setActiveTab('messages'));
      window.removeEventListener('open-language-settings', () => setShowLanguageSettings(true));
      window.removeEventListener('set-profile-tab', () => {});
    };
  }, []);

  const handleCreateTask = () => {
    if (!user) {
      setShowAuth(true);
    } else {
      setShowCreateTask(true);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0021A5]"></div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <Auth initialMode="signin" />
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#002B7F] to-[#0038FF] text-white p-4 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Hustl</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowWallet(true)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                Wallet
              </button>
              <button
                onClick={() => setShowNotifications(true)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                Notifications
              </button>
              <button
                onClick={() => setShowAuth(true)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                Account
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto p-4">
          {/* Navigation Tabs */}
          <div className="flex justify-between mb-6 border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'home'
                    ? 'text-[#0038FF] border-b-2 border-[#0038FF]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'tasks'
                    ? 'text-[#0038FF] border-b-2 border-[#0038FF]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Tasks
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'messages'
                    ? 'text-[#0038FF] border-b-2 border-[#0038FF]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Messages
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'profile'
                    ? 'text-[#0038FF] border-b-2 border-[#0038FF]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
            </div>
            <button
              onClick={handleCreateTask}
              className="bg-[#FF5A1F] text-white px-4 py-2 rounded-lg hover:bg-[#E63A0B] transition-colors"
            >
              Create Task
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'home' && (
            <TaskTemplates 
              onSelectTemplate={(template) => {
                setShowCreateTask(true);
              }}
            />
          )}
          
          {activeTab === 'tasks' && (
            <TaskMarketplace userLocation={userLocation as Location} />
          )}
          
          {activeTab === 'messages' && (
            <ChatList userId={user.uid} currentUser={user} />
          )}
          
          {activeTab === 'profile' && (
            <UserProfile />
          )}
        </main>
      </div>
    );
  };

  return (
    <Router>
      <div className="App">
        {/* Bolt.new badge */}
        <a 
          href="https://bolt.new" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed top-4 right-4 z-50 opacity-80 hover:opacity-100 transition-opacity"
          style={{ width: '40px', height: '40px' }}
        >
          <img 
            src="/black_circle_360x360.png" 
            alt="Powered by Bolt.new" 
            className="w-full h-full"
          />
        </a>

        <Toaster position="top-center" />
        
        <Routes>
          <Route path="/" element={renderContent()} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
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
            userLocation={userLocation as Location}
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
        
        {/* Task Checkout Success Handler */}
        <TaskCheckoutSuccess 
          onClose={() => {}} 
          onViewTask={(taskId) => {
            // Handle viewing the task
          }}
        />
      </div>
    </Router>
  );
}

export default Sentry.withProfiler(App);