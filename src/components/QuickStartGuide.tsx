import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Calendar, Clock, Users, MessageSquare, Star, ChevronLeft, ChevronRight, Volume as VolumeUp } from 'lucide-react';
import { elevenLabsService } from '../lib/elevenLabsService';
import { StarBorder } from './ui/star-border';

interface QuickStartGuideProps {
  onClose: () => void;
  onCreateTask?: () => void;
  onBrowseTasks?: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  velocity: { x: number; y: number };
  size: number;
}

const CONFETTI_COLORS = ['#FA4616', '#0F2557', '#FFD700', '#FF69B4', '#00CED1', '#32CD32', '#FF6347'];

// Audio manager singleton for TaskCreationSuccess
const taskCreationAudioManager = {
  isPlaying: false,
  currentAudio: null as HTMLAudioElement | null,
  
  async playAudio(audioUrl: string): Promise<void> {
    // If already playing, stop current audio
    if (this.isPlaying && this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    
    this.isPlaying = true;
    
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        this.isPlaying = false;
        this.currentAudio = null;
        resolve();
      };
      
      audio.onerror = (e) => {
        URL.revokeObjectURL(audioUrl);
        this.isPlaying = false;
        this.currentAudio = null;
        reject(e);
      };
      
      audio.play().catch(err => {
        this.isPlaying = false;
        this.currentAudio = null;
        reject(err);
      });
    });
  },
  
  stopAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    this.isPlaying = false;
  }
};

const QuickStartGuide: React.FC<QuickStartGuideProps> = ({ onClose, onCreateTask, onBrowseTasks }) => {
  const [hasShown, setHasShown] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);

  useEffect(() => {
    // Check if the guide has been shown before
    const guideShown = localStorage.getItem('quickStartGuideShown');
    if (guideShown) {
      setHasShown(true);
    }
    
    // Play welcome message only once
    if (!hasPlayedAudio) {
      playWelcomeMessage();
      setHasPlayedAudio(true);
    }
    
    return () => {
      // Clean up any playing audio when component unmounts
      taskCreationAudioManager.stopAudio();
    };
  }, []);

  const playWelcomeMessage = async () => {
    // Check if we've already played this message in this session
    const messageKey = 'quickstart_welcome';
    if (sessionStorage.getItem(messageKey) === 'played') {
      return;
    }
    
    setIsPlayingAudio(true);
    try {
      await elevenLabsService.speakText(
        "Welcome to Hustl! I'm your campus task assistant. I'll help you get started with creating and finding tasks around campus.",
        undefined,
        taskCreationAudioManager
      );
      // Mark this message as played in this session
      sessionStorage.setItem(messageKey, 'played');
    } catch (error) {
      console.warn("Couldn't play welcome message:", error);
      // Silently fail - don't disable audio as this is just an enhancement
    } finally {
      setIsPlayingAudio(false);
    }
  };
  
  const handleCategoryClick = (template: string) => {
    markGuideAsShown();
    onClose();
    onCreateTask?.();
  };

  const handleGetStarted = () => {
    markGuideAsShown();
    onClose();
  };
  
  const markGuideAsShown = () => {
    localStorage.setItem('quickStartGuideShown', 'true');
    setHasShown(true);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-4 sm:p-6 mx-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 mr-2">
              <img src="/circular-logo.svg" alt="Hustl Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0F2557]">Welcome to Hustl</h2>
              <p className="text-gray-600 mt-1">
                Your campus task marketplace - get help or earn money helping others
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-full mr-2 ${isPlayingAudio ? 'bg-blue-100 text-[#0038FF]' : 'text-gray-500 hover:text-[#0038FF] hover:bg-blue-50'} transition-colors`}
              aria-label={isPlayingAudio ? "Disable audio" : "Enable audio"}
            >
              <VolumeUp className={`w-5 h-5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-[#0F2557] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center">What would you like to do?</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <button
                  onClick={() => {
                    markGuideAsShown();
                    onCreateTask?.();
                  }}
                  className="btn-gradient-secondary btn-shine p-4 sm:p-5 rounded-lg group w-full"
                >
                  <div className="flex items-center justify-between mb-3">
                    <img src="/circular-logo.svg" alt="Hustl Logo" className="w-6 h-6 sm:w-7 sm:h-7" />
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                  <h3 className="text-lg font-semibold text-left mb-2">Post a Task</h3>
                  <p className="text-left text-orange-100 text-sm">
                    Need help with something? Create a task and find someone to help you.
                  </p>
                </button>

                <button
                  onClick={() => {
                    markGuideAsShown();
                    onBrowseTasks?.();
                  }}
                  className="btn-gradient-primary btn-shine p-4 sm:p-5 rounded-lg group w-full"
                >
                  <div className="flex items-center justify-between mb-3">
                    <img src="/circular-logo.svg" alt="Hustl Logo" className="w-6 h-6 sm:w-7 sm:h-7" />
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                  <h3 className="text-lg font-semibold text-left mb-2">Browse Tasks</h3>
                  <p className="text-left text-blue-100 text-sm">
                    Want to earn money? Find tasks you can help with around campus.
                  </p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center">Popular Task Categories</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Coffee Runs', 'Academic Help', 'Pet Care', 'Campus Rides', 'Meal Swipes', 'Study Groups', 'Quick Rides', 'Print & Pickup'].map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category.toLowerCase().replace(' ', '-'))}
                    className="bg-white px-3 py-2 rounded-xl text-sm hover:bg-[#0F2557] hover:text-white transition-colors flex items-center justify-center group shadow-sm border border-gray-200"
                  >
                    <img src="/circular-logo.svg" alt="Hustl Logo" className="w-4 h-4 mr-2 group-hover:filter group-hover:brightness-0 group-hover:invert" />
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center">Key Features</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
                  <img src="/circular-logo.svg" alt="Hustl Logo" className="w-8 h-8 mb-2" />
                  <h3 className="font-bold mb-1 text-sm text-[#0F2557]">Safe & Secure</h3>
                  <p className="text-gray-600 text-sm">
                    Verified UF students only with built-in safety features.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
                  <Star className="w-6 h-6 text-[#0F2557] mb-2" />
                  <h3 className="font-bold mb-1 text-sm text-[#0F2557]">Earn Points</h3>
                  <p className="text-gray-600 text-sm">
                    Complete tasks to earn points and unlock rewards.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
                  <img src="/circular-logo.svg" alt="Hustl Logo" className="w-8 h-8 mb-2" />
                  <h3 className="font-bold mb-1 text-sm text-[#0F2557]">Flexible Earnings</h3>
                  <p className="text-gray-600 text-sm">
                    Set your schedule and earn between classes.
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
                <div className="flex items-center mb-2">
                  <VolumeUp className="w-5 h-5 text-[#0F2557] mr-2" />
                  <h3 className="font-bold text-sm text-[#0F2557]">Voice Assistant</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Use our voice assistant to create tasks, find help, and navigate the app hands-free.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          {currentStep > 1 ? (
            <button
              onClick={prevStep}
              className="text-[#0F2557] hover:text-[#0A1B3D] font-medium flex items-center"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
          ) : (
            <button
              onClick={() => {
                markGuideAsShown();
                onClose();
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Skip Guide
            </button>
          )}

          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              className="btn-gradient-primary btn-shine px-5 py-2 text-sm font-semibold flex items-center"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleGetStarted}
              className="btn-gradient-secondary btn-shine px-5 py-2 text-sm font-semibold flex items-center"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickStartGuide;