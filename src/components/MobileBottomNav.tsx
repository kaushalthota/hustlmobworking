import React from 'react';
import { Home, Package, MessageSquare, User, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StarBorder } from './ui/star-border';

interface MobileBottomNavProps {
  activeTab: string;
  onCreateTask: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, onCreateTask }) => {
  return (
    <div className="mobile-bottom-nav safe-area-bottom">
      <Link 
        to="/" 
        className={`flex-1 flex flex-col items-center justify-center py-2 ${
          activeTab === 'home' ? 'text-[#0038FF]' : 'text-gray-500'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      
      <Link 
        to="/tasks" 
        className={`flex-1 flex flex-col items-center justify-center py-2 ${
          activeTab === 'tasks' ? 'text-[#0038FF]' : 'text-gray-500'
        }`}
      >
        <Package className="w-5 h-5" />
        <span className="text-xs mt-1">Tasks</span>
      </Link>
      
      <div className="flex-1 flex flex-col items-center -mt-5">
        <StarBorder color="#FF5A1F">
          <button
            onClick={onCreateTask}
            className="bg-gradient-to-r from-[#FF5A1F] to-[#E63A0B] text-white p-3 rounded-full shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </button>
        </StarBorder>
        <span className="text-xs mt-1">Create</span>
      </div>
      
      <Link 
        to="/messages" 
        className={`flex-1 flex flex-col items-center justify-center py-2 ${
          activeTab === 'messages' ? 'text-[#0038FF]' : 'text-gray-500'
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-xs mt-1">Messages</span>
      </Link>
      
      <Link 
        to="/profile" 
        className={`flex-1 flex flex-col items-center justify-center py-2 ${
          activeTab === 'profile' ? 'text-[#0038FF]' : 'text-gray-500'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </div>
  );
};

export default MobileBottomNav;