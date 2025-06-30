import React, { useState, useEffect, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader } from 'lucide-react';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useGeolocation } from './hooks/useGeolocation';
import * as Sentry from "@sentry/react";
import { LingoProvider } from "lingo.dev/react/client";
import dictionary from './lingo/dictionary';

// Lazy-loaded components
const Auth = React.lazy(() => import('./components/Auth'));
const TaskMarketplace = React.lazy(() => import('./components/TaskMarketplace'));
const CreateTask = React.lazy(() => import('./components/CreateTask'));
const UserProfile = React.lazy(() => import('./components/UserProfile'));
const ChatList = React.lazy(() => import('./components/ChatList'));
const WalletModal = React.lazy(() => import('./components/WalletModal'));
const NotificationsModal = React.lazy(() => import('./components/NotificationsModal'));
const FAQSupport = React.lazy(() => import('./components/FAQSupport'));
const SafetyFeatures = React.lazy(() => import('./components/SafetyFeatures'));
const LearnMoreModal = React.lazy(() => import('./components/LearnMoreModal'));
const QuickStartGuide = React.lazy(() => import('./components/QuickStartGuide'));
const AdminTools = React.lazy(() => import('./components/AdminTools'));
const TaskTemplates = React.lazy(() => import('./components/TaskTemplates'));
const VoiceAssistantManager = React.lazy(() => import('./components/VoiceAssistantManager'));
const VoiceAssistantButton = React.lazy(() => import('./components/VoiceAssistantButton'));
const VoiceCommandTooltip = React.lazy(() => import('./components/VoiceCommandTooltip'));
const LanguageSettingsModal = React.lazy(() => import('./components/LanguageSettingsModal'));
const TaskCheckoutSuccess = React.lazy(() => import('./components/TaskCheckoutSuccess'));

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
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [showAdminTools, setShowAdminTools] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'browse' | 'messages' | 'profile'>('home');
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [showVoiceTooltip, setShowVoiceTooltip] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  
  // Get user's location
  const { location: userLocation, loading: locationLoading } = useGeolocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      // Show quick start guide for new users
      if (user && !localStorage.getItem('quickStartGuideShown')) {
        setShowQuickStart(true);
      }
      
      // Check URL parameters for checkout success
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get('success') === 'true';
      const taskId = urlParams.get('task_id');
      
      if (success && taskId) {
        setShowCheckoutSuccess(true);
      }
    });

    // Listen for custom events
    window.addEventListener('create-task', () => setShowCreateTask(true));
    window.addEventListener('view-tasks', () => setActiveTab('browse'));
    window.addEventListener('view-messages', () => setActiveTab('messages'));
    window.addEventListener('open-profile', () => setShowProfile(true));
    window.addEventListener('open-wallet', () => setShowWallet(true));
    window.addEventListener('open-faq', () => setShowFAQ(true));
    window.addEventListener('open-safety', () => setShowSafety(true));
    window.addEventListener('open-admin', () => setShowAdminTools(true));
    
    // Show voice assistant tooltip after a delay
    const tooltipTimer = setTimeout(() => {
      if (!localStorage.getItem('voiceTooltipShown')) {
        setShowVoiceTooltip(true);
        localStorage.setItem('voiceTooltipShown', 'true');
      }
    }, 10000);

    return () => {
      unsubscribe();
      window.removeEventListener('create-task', () => setShowCreateTask(true));
      window.removeEventListener('view-tasks', () => setActiveTab('browse'));
      window.removeEventListener('view-messages', () => setActiveTab('messages'));
      window.removeEventListener('open-profile', () => setShowProfile(true));
      window.removeEventListener('open-wallet', () => setShowWallet(true));
      window.removeEventListener('open-faq', () => setShowFAQ(true));
      window.removeEventListener('open-safety', () => setShowSafety(true));
      window.removeEventListener('open-admin', () => setShowAdminTools(true));
      clearTimeout(tooltipTimer);
    };
  }, []);

  // Loading screen
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#0038FF] to-[#0021A5]">
        <div className="w-32 h-32 mb-8">
          <img 
            src="https://i.ibb.co/Qj1bHWG/hustl-logo.png" 
            alt="Hustl Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  // Home screen for non-authenticated users
  if (!user) {
    return (
      <LingoProvider dictionary={dictionary}>
        <div className="min-h-screen bg-gradient-to-r from-[#0038FF] to-[#0021A5] flex flex-col">
          <Toaster position="top-center" />
          
          {/* Header */}
          <header className="p-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-2">
                <img 
                  src="https://i.ibb.co/Qj1bHWG/hustl-logo.png" 
                  alt="Hustl Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-white">Hustl</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowLearnMore(true)}
                className="text-white hover:text-gray-200 transition"
              >
                Learn More
              </button>
              <button 
                onClick={() => setShowAuth(true)}
                className="bg-white text-[#0038FF] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Sign In
              </button>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-32 h-32 mb-6">
              <img 
                src="https://i.ibb.co/Qj1bHWG/hustl-logo.png" 
                alt="Hustl Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">UF's Campus Task Platform</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl">
              Connect with fellow Gators to get help with quick tasks or earn money helping others on the University of Florida campus.
            </p>
            <button 
              onClick={() => setShowAuth(true)}
              className="bg-white text-[#0038FF] px-6 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Get Started
            </button>
          </main>
          
          {/* Footer */}
          <footer className="p-4 text-center text-blue-200 text-sm">
            <p>© 2025 Hustl - UF's Campus Task Platform</p>
          </footer>
          
          {/* Modals */}
          <Suspense fallback={<div>Loading...</div>}>
            {showAuth && <Auth onClose={() => setShowAuth(false)} />}
            {showLearnMore && <LearnMoreModal onClose={() => setShowLearnMore(false)} />}
            {showLanguageSettings && (
              <LanguageSettingsModal onClose={() => setShowLanguageSettings(false)} />
            )}
          </Suspense>
        </div>
      </LingoProvider>
    );
  }

  // Authenticated user view
  return (
    <LingoProvider dictionary={dictionary}>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-center" />
        
        {/* Header */}
        <header className="bg-gradient-to-r from-[#0038FF] to-[#0021A5] text-white p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 mr-2">
                <img 
                  src="https://i.ibb.co/Qj1bHWG/hustl-logo.png" 
                  alt="Hustl Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-xl font-bold">Hustl</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowWallet(true)}
                className="text-white hover:text-gray-200 transition"
              >
                Wallet
              </button>
              <button 
                onClick={() => setShowNotifications(true)}
                className="text-white hover:text-gray-200 transition"
              >
                Notifications
              </button>
              <button 
                onClick={() => setShowLanguageSettings(true)}
                className="text-white hover:text-gray-200 transition"
              >
                Language
              </button>
              <button 
                onClick={() => setShowProfile(true)}
                className="text-white hover:text-gray-200 transition"
              >
                Profile
              </button>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="p-4">
          {activeTab === 'home' && (
            <Suspense fallback={<div className="flex justify-center"><Loader className="animate-spin" /></div>}>
              <TaskTemplates 
                onSelectTemplate={(template) => {
                  setShowCreateTask(true);
                }}
              />
            </Suspense>
          )}
          
          {activeTab === 'browse' && (
            <Suspense fallback={<div className="flex justify-center"><Loader className="animate-spin" /></div>}>
              <TaskMarketplace userLocation={userLocation} />
            </Suspense>
          )}
          
          {activeTab === 'messages' && (
            <Suspense fallback={<div className="flex justify-center"><Loader className="animate-spin" /></div>}>
              <ChatList userId={user.uid} currentUser={user} />
            </Suspense>
          )}
        </main>
        
        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-20">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center p-2 ${activeTab === 'home' ? 'text-[#0038FF]' : 'text-gray-500'}`}
          >
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => setActiveTab('browse')}
            className={`flex flex-col items-center p-2 ${activeTab === 'browse' ? 'text-[#0038FF]' : 'text-gray-500'}`}
          >
            <span className="text-xs">Browse</span>
          </button>
          <button 
            onClick={() => setShowCreateTask(true)}
            className="bg-[#0038FF] text-white rounded-full p-3 -mt-5 shadow-lg"
          >
            <span className="text-xs">Post</span>
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`flex flex-col items-center p-2 ${activeTab === 'messages' ? 'text-[#0038FF]' : 'text-gray-500'}`}
          >
            <span className="text-xs">Messages</span>
          </button>
          <button 
            onClick={() => setShowProfile(true)}
            className={`flex flex-col items-center p-2 ${activeTab === 'profile' ? 'text-[#0038FF]' : 'text-gray-500'}`}
          >
            <span className="text-xs">Profile</span>
          </button>
        </nav>
        
        {/* Modals */}
        <Suspense fallback={<div>Loading...</div>}>
          {showCreateTask && (
            <CreateTask 
              onClose={() => setShowCreateTask(false)} 
              userLocation={userLocation}
            />
          )}
          {showProfile && (
            <UserProfile onClose={() => setShowProfile(false)} />
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
                setActiveTab('browse');
                localStorage.setItem('quickStartGuideShown', 'true');
              }}
            />
          )}
          {showAdminTools && (
            <AdminTools onClose={() => setShowAdminTools(false)} />
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
                setActiveTab('browse');
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
          {showCheckoutSuccess && (
            <TaskCheckoutSuccess 
              onClose={() => setShowCheckoutSuccess(false)}
              onViewTask={() => {
                setShowCheckoutSuccess(false);
                setActiveTab('browse');
              }}
            />
          )}
        </Suspense>
        
        {/* Voice Assistant Button */}
        <Suspense fallback={null}>
          <VoiceAssistantButton onClick={() => setShowVoiceAssistant(true)} />
        </Suspense>
      </div>
    </LingoProvider>
  );
}

export default Sentry.withProfiler(App);