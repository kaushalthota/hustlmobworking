import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { LingoProvider } from 'lingo.dev/react/client';
import dictionary from './lingo/dictionary';

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
import VoiceAssistantButton from './components/VoiceAssistantButton';
import VoiceAssistantManager from './components/VoiceAssistantManager';
import VoiceCommandTooltip from './components/VoiceCommandTooltip';
import LanguageSettingsModal from './components/LanguageSettingsModal';
import TaskCheckoutSuccess from './components/TaskCheckoutSuccess';
import MobileBottomNav from './components/MobileBottomNav';
import ErrorBoundaryTest from './components/ErrorBoundaryTest';

// Import hooks and services
import { useGeolocation } from './hooks/useGeolocation';
import { auth } from './lib/firebase';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChat, setShowChat] = useState(false);
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
  const [isMobile, setIsMobile] = useState(false);
  
  // Get user's location
  const { location: userLocation, loading: locationLoading } = useGeolocation();

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Check auth state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      
      // Show quick start guide for new users
      if (user && !localStorage.getItem('quickStartShown')) {
        setShowQuickStart(true);
        localStorage.setItem('quickStartShown', 'true');
      }
      
      // Show voice assistant tooltip after a delay
      if (user && !localStorage.getItem('voiceTooltipShown')) {
        setTimeout(() => {
          setShowVoiceTooltip(true);
          localStorage.setItem('voiceTooltipShown', 'true');
        }, 60000); // Show after 1 minute
      }
    });
    
    // Listen for custom events
    window.addEventListener('create-task', () => setShowCreateTask(true));
    window.addEventListener('view-tasks', () => setActiveTab('tasks'));
    window.addEventListener('view-messages', () => setActiveTab('messages'));
    window.addEventListener('open-profile', () => setShowProfile(true));
    window.addEventListener('open-wallet', () => setShowWallet(true));
    window.addEventListener('open-notifications', () => setShowNotifications(true));
    window.addEventListener('open-faq', () => setShowFAQ(true));
    window.addEventListener('open-safety', () => setShowSafety(true));
    window.addEventListener('open-admin', () => setShowAdmin(true));
    window.addEventListener('open-language-settings', () => setShowLanguageSettings(true));
    
    // Listen for profile tab changes
    window.addEventListener('set-profile-tab', (event: any) => {
      if (event.detail && event.detail.tab) {
        setActiveTab(event.detail.tab);
      }
    });
    
    return () => {
      unsubscribe();
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('create-task', () => setShowCreateTask(true));
      window.removeEventListener('view-tasks', () => setActiveTab('tasks'));
      window.removeEventListener('view-messages', () => setActiveTab('messages'));
      window.removeEventListener('open-profile', () => setShowProfile(true));
      window.removeEventListener('open-wallet', () => setShowWallet(true));
      window.removeEventListener('open-notifications', () => setShowNotifications(true));
      window.removeEventListener('open-faq', () => setShowFAQ(true));
      window.removeEventListener('open-safety', () => setShowSafety(true));
      window.removeEventListener('open-admin', () => setShowAdmin(true));
      window.removeEventListener('open-language-settings', () => setShowLanguageSettings(true));
      window.removeEventListener('set-profile-tab', () => {});
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#0021A5]" />
      </div>
    );
  }

  return (
    <LingoProvider dictionary={dictionary}>
      <div className="min-h-screen bg-gray-50">
        {/* Bolt.new Badge */}
        <a 
          href="https://bolt.new" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed top-4 right-4 z-50 opacity-80 hover:opacity-100 transition-opacity"
          style={{ width: '60px', height: '60px' }}
        >
          <img 
            src="/black_circle_360x360.png" 
            alt="Powered by Bolt.new" 
            className="w-full h-full"
          />
        </a>

        {/* Header */}
        <header className="bg-gradient-to-r from-[#0021A5] to-[#0038FF] text-white p-4 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-2">
                <img src="/files_5770123-1751251303321-image.png" alt="Hustl Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-2xl font-bold">Hustl</h1>
            </div>
            
            {!isMobile && (
              <nav className="flex items-center space-x-4">
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
                  Tasks
                </button>
                <button 
                  onClick={() => setActiveTab('messages')}
                  className={`nav-link ${activeTab === 'messages' ? 'font-bold' : ''}`}
                >
                  Messages
                </button>
                {user ? (
                  <>
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
                      onClick={() => setShowProfile(true)}
                      className="nav-link"
                    >
                      Profile
                    </button>
                    <button 
                      onClick={() => auth.signOut()}
                      className="nav-button"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setShowAuth(true)}
                    className="nav-button"
                  >
                    Sign In
                  </button>
                )}
              </nav>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="pb-16 md:pb-0">
          {!user ? (
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Welcome to Hustl</h2>
                <p className="text-xl text-gray-600 mb-6">UF's Campus Task Platform</p>
                <button 
                  onClick={() => setShowAuth(true)}
                  className="btn-gradient-primary btn-shine px-8 py-3 text-lg"
                >
                  Get Started
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="task-icon-container mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#0021A5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L4 12h6v8l8-10h-6z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Post Tasks</h3>
                  <p className="text-gray-600">Need help with something? Post a task and find someone to help you.</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="task-icon-container mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#0021A5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Stay Safe</h3>
                  <p className="text-gray-600">Our platform is exclusively for UF students with built-in safety features.</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="task-icon-container mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#0021A5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M16 8l-8 8" />
                      <path d="M8 8l8 8" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Earn Money</h3>
                  <p className="text-gray-600">Help fellow students with tasks and earn money in your spare time.</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-[#0021A5] to-[#0038FF] text-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Join the Hustl Community</h2>
                <p className="mb-6">Connect with fellow Gators to get help with quick tasks or earn money helping others on the University of Florida campus.</p>
                <button 
                  onClick={() => setShowAuth(true)}
                  className="bg-white text-[#0021A5] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
                >
                  Sign Up Now
                </button>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'home' && (
                <div className="max-w-7xl mx-auto px-4 py-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-gradient-to-r from-[#0021A5] to-[#0038FF] text-white p-6 rounded-lg shadow-lg">
                      <h2 className="text-2xl font-bold mb-4">Post a Task</h2>
                      <p className="mb-6">Need help with something? Create a task and find someone to help you.</p>
                      <button 
                        onClick={() => setShowCreateTask(true)}
                        className="bg-white text-[#0021A5] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
                      >
                        Create Task
                      </button>
                    </div>
                    
                    <div className="bg-gradient-to-r from-[#FF5A1F] to-[#E63A0B] text-white p-6 rounded-lg shadow-lg">
                      <h2 className="text-2xl font-bold mb-4">Find Tasks</h2>
                      <p className="mb-6">Want to earn money? Browse available tasks and help fellow students.</p>
                      <button 
                        onClick={() => setActiveTab('tasks')}
                        className="bg-white text-[#FF5A1F] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
                      >
                        Browse Tasks
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <button 
                        onClick={() => setShowWallet(true)}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto mb-2 text-[#0021A5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                          <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                        </svg>
                        <span>Wallet</span>
                      </button>
                      
                      <button 
                        onClick={() => setShowNotifications(true)}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto mb-2 text-[#0021A5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                        </svg>
                        <span>Notifications</span>
                      </button>
                      
                      <button 
                        onClick={() => setShowSafety(true)}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto mb-2 text-[#0021A5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <span>Safety</span>
                      </button>
                      
                      <button 
                        onClick={() => setShowFAQ(true)}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto mb-2 text-[#0021A5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                          <path d="M12 17h.01" />
                        </svg>
                        <span>Help</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-2 text-blue-800">SafeWalk Feature</h3>
                    <p className="text-blue-700 mb-4">Need someone to walk with you? Request a SafeWalk companion for added security on campus.</p>
                    <button 
                      onClick={() => setShowSafety(true)}
                      className="bg-[#0021A5] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#001B8C] transition duration-200"
                    >
                      Request SafeWalk
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'tasks' && (
                <TaskMarketplace userLocation={userLocation} />
              )}
              
              {activeTab === 'messages' && (
                <div className="max-w-7xl mx-auto px-4 py-8">
                  <ChatList userId={user.uid} currentUser={user} />
                </div>
              )}
              
              {activeTab === 'profile' && (
                <div className="max-w-7xl mx-auto px-4 py-8">
                  <UserProfile />
                </div>
              )}
            </>
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        {isMobile && user && (
          <MobileBottomNav 
            activeTab={activeTab} 
            onCreateTask={() => setShowCreateTask(true)} 
          />
        )}

        {/* Modals */}
        {showAuth && <Auth onClose={() => setShowAuth(false)} />}
        {showCreateTask && <CreateTask onClose={() => setShowCreateTask(false)} userLocation={userLocation} />}
        {showProfile && <UserProfile />}
        {showChat && <ChatList userId={user?.uid} currentUser={user} />}
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
        {user && (
          <VoiceAssistantButton onClick={() => setShowVoiceAssistant(true)} />
        )}
        
        {/* Toast Container */}
        <Toaster position="bottom-center" />
        
        {/* Task Checkout Success Handler */}
        <TaskCheckoutSuccess 
          onClose={() => {
            // Clear URL parameters
            const url = new URL(window.location.href);
            url.searchParams.delete('success');
            url.searchParams.delete('task_id');
            window.history.replaceState({}, '', url.toString());
          }}
          onViewTask={(taskId) => {
            // Navigate to tasks tab
            setActiveTab('tasks');
          }}
        />
      </div>
    </LingoProvider>
  );
}

export default App;