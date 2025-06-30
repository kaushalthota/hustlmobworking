import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Zap, MessageSquare, User, Home, Package, Bell, Wallet, HelpCircle, Shield, Volume2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { auth } from './lib/firebase';
import { useGeolocation } from './hooks/useGeolocation';
import { Location } from './lib/locationService';
import { subscribeToAuthChanges } from './lib/auth';

// Components
import Auth from './components/Auth';
import TaskTemplates from './components/TaskTemplates';
import CreateTask from './components/CreateTask';
import TaskMarketplace from './components/TaskMarketplace';
import UserProfile from './components/UserProfile';
import ChatList from './components/ChatList';
import WalletModal from './components/WalletModal';
import NotificationsModal from './components/NotificationsModal';
import FAQSupport from './components/FAQSupport';
import SafetyFeatures from './components/SafetyFeatures';
import QuickStartGuide from './components/QuickStartGuide';
import VoiceAssistantButton from './components/VoiceAssistantButton';
import VoiceAssistantManager from './components/VoiceAssistantManager';
import VoiceCommandTooltip from './components/VoiceCommandTooltip';
import LearnMoreModal from './components/LearnMoreModal';
import AdminTools from './components/AdminTools';
import LanguageSettingsModal from './components/LanguageSettingsModal';
import MobileBottomNav from './components/MobileBottomNav';
import ResponsiveWrapper from './components/ResponsiveWrapper';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [showVoiceTooltip, setShowVoiceTooltip] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showAdminTools, setShowAdminTools] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isMobile, setIsMobile] = useState(false);
  
  const { location: userLocation } = useGeolocation();
  
  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Check authentication status
    const unsubscribe = subscribeToAuthChanges((user) => {
      setIsAuthenticated(!!user);
      
      // Show quick start guide for new users
      if (user) {
        const hasSeenGuide = localStorage.getItem('quickStartGuideShown');
        if (!hasSeenGuide) {
          setShowQuickStart(true);
        }
        
        // Show voice tooltip after a delay
        setTimeout(() => {
          const hasSeenVoiceTooltip = localStorage.getItem('voiceTooltipShown');
          if (!hasSeenVoiceTooltip) {
            setShowVoiceTooltip(true);
            localStorage.setItem('voiceTooltipShown', 'true');
          }
        }, 30000);
      }
    });
    
    // Listen for custom events
    window.addEventListener('create-task', () => setShowCreateTask(true));
    window.addEventListener('open-wallet', () => setShowWallet(true));
    window.addEventListener('open-notifications', () => setShowNotifications(true));
    window.addEventListener('open-faq', () => setShowFAQ(true));
    window.addEventListener('open-safety', () => setShowSafety(true));
    window.addEventListener('open-profile', () => setActiveTab('profile'));
    window.addEventListener('view-tasks', () => setActiveTab('tasks'));
    window.addEventListener('view-messages', () => setActiveTab('messages'));
    
    return () => {
      unsubscribe();
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('create-task', () => setShowCreateTask(true));
      window.removeEventListener('open-wallet', () => setShowWallet(true));
      window.removeEventListener('open-notifications', () => setShowNotifications(true));
      window.removeEventListener('open-faq', () => setShowFAQ(true));
      window.removeEventListener('open-safety', () => setShowSafety(true));
      window.removeEventListener('open-profile', () => setActiveTab('profile'));
      window.removeEventListener('view-tasks', () => setActiveTab('tasks'));
      window.removeEventListener('view-messages', () => setActiveTab('messages'));
    };
  }, []);
  
  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#002B7F] to-[#0038FF]">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4">
            <img src="/files_5770123-1751251303321-image.png" alt="Hustl Logo" className="w-full h-full object-contain" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    );
  }
  
  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#002B7F] to-[#0038FF] flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-32 h-32 mx-auto mb-6">
            <img src="/files_5770123-1751251303321-image.png" alt="Hustl Logo" className="w-full h-full object-contain" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">Welcome to Hustl</h1>
          <p className="text-blue-100 text-center mb-8 max-w-md">
            UF's campus task platform. Connect with fellow Gators to get help with quick tasks or earn money helping others.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setShowAuth(true)}
              className="btn-gradient-primary btn-shine px-8 py-3 text-lg"
            >
              Get Started
            </button>
            <button 
              onClick={() => setShowLearnMore(true)}
              className="bg-white text-[#002B7F] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200 text-lg"
            >
              Learn More
            </button>
          </div>
        </div>
        
        {showAuth && <Auth onClose={() => setShowAuth(false)} />}
        {showLearnMore && <LearnMoreModal onClose={() => setShowLearnMore(false)} />}
        
        <Toaster position="top-center" />
      </div>
    );
  }
  
  // Authenticated
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Top Navigation - Hidden on mobile */}
        <header className="bg-gradient-to-r from-[#002B7F] to-[#0038FF] text-white py-3 px-4 desktop-nav">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-2">
                <img src="/files_5770123-1751251303321-image.png" alt="Hustl Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-xl font-bold">Hustl</h1>
            </div>
            
            <nav className="flex items-center space-x-6">
              <button 
                onClick={() => setActiveTab('home')}
                className={`nav-link flex items-center ${activeTab === 'home' ? 'font-bold' : ''}`}
              >
                <Home className="w-5 h-5 mr-1" />
                <span>Home</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('tasks')}
                className={`nav-link flex items-center ${activeTab === 'tasks' ? 'font-bold' : ''}`}
              >
                <Package className="w-5 h-5 mr-1" />
                <span>Tasks</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('messages')}
                className={`nav-link flex items-center ${activeTab === 'messages' ? 'font-bold' : ''}`}
              >
                <MessageSquare className="w-5 h-5 mr-1" />
                <span>Messages</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('profile')}
                className={`nav-link flex items-center ${activeTab === 'profile' ? 'font-bold' : ''}`}
              >
                <User className="w-5 h-5 mr-1" />
                <span>Profile</span>
              </button>
            </nav>
            
            <div className="flex items-center space-x-3">
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
                onClick={() => setShowLanguageSettings(true)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <span className="text-sm font-medium">EN</span>
              </button>
              
              <button 
                onClick={() => setShowCreateTask(true)}
                className="nav-button flex items-center"
              >
                <Zap className="w-4 h-4 mr-1" />
                <span>Post Task</span>
              </button>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <ResponsiveWrapper className="flex-1">
          {activeTab === 'home' && (
            <div className="p-4">
              <TaskTemplates 
                onSelectTemplate={(template) => {
                  setShowCreateTask(true);
                }}
                onSelectLocation={(location: Location) => {
                  // Handle location selection
                }}
              />
            </div>
          )}
          
          {activeTab === 'tasks' && (
            <TaskMarketplace userLocation={userLocation} />
          )}
          
          {activeTab === 'messages' && (
            <div className="h-[calc(100vh-4rem)]">
              <ChatList userId={auth.currentUser?.uid || ''} currentUser={auth.currentUser} />
            </div>
          )}
          
          {activeTab === 'profile' && (
            <UserProfile />
          )}
        </ResponsiveWrapper>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav 
          activeTab={activeTab} 
          onCreateTask={() => setShowCreateTask(true)} 
        />
        
        {/* Modals */}
        {showCreateTask && (
          <CreateTask 
            onClose={() => setShowCreateTask(false)} 
            userLocation={userLocation}
          />
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
        
        {showAdminTools && (
          <AdminTools onClose={() => setShowAdminTools(false)} />
        )}
        
        {showLanguageSettings && (
          <LanguageSettingsModal onClose={() => setShowLanguageSettings(false)} />
        )}
        
        {/* Voice Assistant Button */}
        <VoiceAssistantButton onClick={() => setShowVoiceAssistant(true)} />
        
        {/* Toast notifications */}
        <Toaster position="top-center" />
      </div>
    </Router>
  );
};

export default App;