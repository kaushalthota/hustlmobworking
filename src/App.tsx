import React, { useState, useEffect, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader } from 'lucide-react';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useGeolocation } from './hooks/useGeolocation';
import * as Sentry from "@sentry/react";

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
const VoiceAssistantManager = React.lazy(() => import('./components/VoiceAssistantManager'));
const VoiceAssistantButton = React.lazy(() => import('./components/VoiceAssistantButton'));
const VoiceCommandTooltip = React.lazy(() => import('./components/VoiceCommandTooltip'));
const TaskTemplates = React.lazy(() => import('./components/TaskTemplates'));
const TaskCheckoutSuccess = React.lazy(() => import('./components/TaskCheckoutSuccess'));
const LanguageSettingsModal = React.lazy(() => import('./components/LanguageSettingsModal'));

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
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [showVoiceTooltip, setShowVoiceTooltip] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'tasks' | 'messages' | 'profile'>('home');
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  
  // Get user's location
  const { location: userLocation, loading: loadingLocation } = useGeolocation();
  
  // Check if user is admin
  const isAdmin = user?.email === 'kaushalthota1@gmail.com' || user?.email === 'apoorvamahajan94@gmail.com';

  useEffect(() => {
    // Listen for auth state changes
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
        }, 10000); // Show after 10 seconds
      }
    });
    
    // Listen for custom events
    window.addEventListener('create-task', () => setShowCreateTask(true));
    window.addEventListener('view-tasks', () => setActiveTab('tasks'));
    window.addEventListener('view-messages', () => setActiveTab('messages'));
    window.addEventListener('open-profile', () => setShowProfile(true));
    window.addEventListener('open-wallet', () => setShowWallet(true));
    window.addEventListener('open-faq', () => setShowFAQ(true));
    window.addEventListener('open-safety', () => setShowSafety(true));
    window.addEventListener('open-admin', () => setShowAdminTools(true));
    
    return () => {
      unsubscribe();
      window.removeEventListener('create-task', () => setShowCreateTask(true));
      window.removeEventListener('view-tasks', () => setActiveTab('tasks'));
      window.removeEventListener('view-messages', () => setActiveTab('messages'));
      window.removeEventListener('open-profile', () => setShowProfile(true));
      window.removeEventListener('open-wallet', () => setShowWallet(true));
      window.removeEventListener('open-faq', () => setShowFAQ(true));
      window.removeEventListener('open-safety', () => setShowSafety(true));
      window.removeEventListener('open-admin', () => setShowAdminTools(true));
    };
  }, []);

  // Loading screen
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#0038FF] to-[#0021A5]">
        <div className="w-32 h-32 mb-8">
          <img 
            src="https://i.ibb.co/Qj1bHWS/hustl-logo.png" 
            alt="Hustl Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#0038FF] to-[#0021A5] flex flex-col items-center justify-center p-4">
        <Toaster position="top-center" />
        
        <div className="w-32 h-32 mb-6">
          <img 
            src="https://i.ibb.co/Qj1bHWS/hustl-logo.png" 
            alt="Hustl Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <Suspense fallback={<div className="flex justify-center"><Loader className="animate-spin" /></div>}>
            <Auth 
              initialMode="signin" 
              onClose={() => setShowAuth(false)} 
            />
          </Suspense>
        </div>
        
        <button 
          onClick={() => setShowLearnMore(true)}
          className="mt-6 text-white hover:text-gray-200 transition-colors"
        >
          Learn more about Hustl
        </button>
        
        {showLearnMore && (
          <Suspense fallback={<div className="flex justify-center"><Loader className="animate-spin" /></div>}>
            <LearnMoreModal onClose={() => setShowLearnMore(false)} />
          </Suspense>
        )}
      </div>
    );
  }

  // Logged in - Main app
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0038FF] to-[#0021A5] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 mr-2">
              <img 
                src="https://i.ibb.co/Qj1bHWS/hustl-logo.png" 
                alt="Hustl Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-xl font-bold">Hustl</h1>
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
              onClick={() => setShowLanguageSettings(true)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              Language
            </button>
            
            {isAdmin && (
              <button 
                onClick={() => setShowAdminTools(true)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                Admin
              </button>
            )}
            
            <button 
              onClick={() => auth.signOut()}
              className="bg-white text-[#0038FF] px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Suspense fallback={<div className="flex justify-center"><Loader className="animate-spin" /></div>}>
          {activeTab === 'home' && (
            <TaskTemplates 
              onSelectTemplate={(template) => {
                setShowCreateTask(true);
                // Pass template to CreateTask component via event
                window.dispatchEvent(new CustomEvent('select-template', { detail: template }));
              }}
            />
          )}
          
          {activeTab === 'tasks' && (
            <TaskMarketplace userLocation={userLocation} />
          )}
          
          {activeTab === 'messages' && (
            <ChatList userId={user.uid} currentUser={user} />
          )}
          
          {activeTab === 'profile' && showProfile && (
            <UserProfile />
          )}
        </Suspense>
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-3 px-6 ${activeTab === 'home' ? 'text-[#0038FF]' : 'text-gray-500'}`}
          >
            Home
          </button>
          
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`flex flex-col items-center py-3 px-6 ${activeTab === 'tasks' ? 'text-[#0038FF]' : 'text-gray-500'}`}
          >
            Tasks
          </button>
          
          <button 
            onClick={() => setShowCreateTask(true)}
            className="flex flex-col items-center py-2 px-6"
          >
            <div className="bg-gradient-to-r from-[#0038FF] to-[#0021A5] text-white rounded-full p-3 shadow-lg">
              +
            </div>
          </button>
          
          <button 
            onClick={() => setActiveTab('messages')}
            className={`flex flex-col items-center py-3 px-6 ${activeTab === 'messages' ? 'text-[#0038FF]' : 'text-gray-500'}`}
          >
            Messages
          </button>
          
          <button 
            onClick={() => {
              setShowProfile(true);
              setActiveTab('profile');
            }}
            className={`flex flex-col items-center py-3 px-6 ${activeTab === 'profile' ? 'text-[#0038FF]' : 'text-gray-500'}`}
          >
            Profile
          </button>
        </div>
      </nav>
      
      {/* Modals */}
      {showCreateTask && (
        <Suspense fallback={<div className="flex justify-center"><Loader className="animate-spin" /></div>}>
          <CreateTask 
            onClose={() => setShowCreateTask(false)} 
            userLocation={userLocation}
          />
        </Suspense>
      )}
      
      {showWallet && (
        <Suspense fallback={<div className="flex justify-center"><Loader className="animate-spin" /></div>}>
          <WalletModal onClose={() => setShowWallet(false)} />
        </Suspense>
      )}
      
      {showNotifications && (
        <Suspense fallback={<div className="flex justify-center"><Loader className="animate-spin" /></div>}>
          <NotificationsModal onClose={() => setShowNotifications(false)} />
        </Suspense>
      )}
      
      {showFAQ && (
        <Suspense fallback={<div className="flex justify-center"><Loader className="animate-spin" /></div>}>
          <FAQSupport onClose={() => setShowFAQ(false)} />
        </Suspense>
      )}
      
      {showSafety && (
        <Suspense fallback={<div className="flex justify-center"><Loader className="animate-spin" /></div>}>
          <SafetyFeatures onClose={() => setShowSafety(false)} />
        </Suspense>
      )}
      
      {showQuickStart && (
        <Suspense fallback={<div className="flex justify-center"><Loader className="animate-spin" /></div>}>
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
              setActiveTab('tasks');
              localStorage.setItem('quickStartGuideShown', 'true');
            }}
          />
        </Suspense>
      )}
      
      {showAdminTools && (
        <Suspense fallback={<div className="flex justify-center"><Loader className="animate-spin" /></div>}>
          <AdminTools onClose={() => setShowAdminTools(false)} />
        </Suspense>
      )}
      
      {showVoiceAssistant && (
        <Suspense fallback={<div className="flex justify-center"><Loader className="animate-spin" /></div>}>
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
        </Suspense>
      )}
      
      {showVoiceTooltip && (
        <Suspense fallback={<div className="flex justify-center"><Loader className="animate-spin" /></div>}>
          <VoiceCommandTooltip onClose={() => setShowVoiceTooltip(false)} />
        </Suspense>
      )}
      
      {/* Voice Assistant Button */}
      <Suspense fallback={null}>
        <VoiceAssistantButton onClick={() => setShowVoiceAssistant(true)} />
      </Suspense>
      
      {/* Task Checkout Success Modal */}
      <Suspense fallback={null}>
        <TaskCheckoutSuccess 
          onClose={() => {
            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
          }}
          onViewTask={(taskId) => {
            // Navigate to tasks tab
            setActiveTab('tasks');
            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
          }}
        />
      </Suspense>
      
      {/* Language Settings Modal */}
      {showLanguageSettings && (
        <Suspense fallback={<div className="flex justify-center"><Loader className="animate-spin" /></div>}>
          <LanguageSettingsModal onClose={() => setShowLanguageSettings(false)} />
        </Suspense>
      )}
    </div>
  );
}

export default Sentry.withProfiler(App);