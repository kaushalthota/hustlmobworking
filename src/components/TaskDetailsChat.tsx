import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock } from 'lucide-react';
import TaskProgressChat from './TaskProgressChat';

interface TaskDetailsChatProps {
  taskId: string;
  currentUser: any;
  otherUser: any;
  progressUpdates: any[];
  taskStatus: string;
  onStatusUpdate?: (status: string) => void;
}

const TaskDetailsChat: React.FC<TaskDetailsChatProps> = ({
  taskId,
  currentUser,
  otherUser,
  progressUpdates,
  taskStatus,
  onStatusUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'progress'>('chat');

  const handleStatusUpdate = (status: string) => {
    if (onStatusUpdate) {
      onStatusUpdate(status);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-3 font-medium flex items-center ${
              activeTab === 'chat'
                ? 'text-[#0038FF] border-b-2 border-[#0038FF]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-3 font-medium flex items-center ${
              activeTab === 'progress'
                ? 'text-[#0038FF] border-b-2 border-[#0038FF]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock className="w-4 h-4 mr-2" />
            Progress
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && (
          <TaskProgressChat
            taskId={taskId}
            currentUser={currentUser}
            otherUser={otherUser}
            onStatusUpdate={handleStatusUpdate}
          />
        )}

        {activeTab === 'progress' && (
          <div className="p-4 overflow-y-auto h-full bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
              <h3 className="text-xl font-bold mb-4 text-blue-900">Task Progress Timeline</h3>
              
              {progressUpdates.length > 0 ? (
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-200" />

                  {/* Progress Steps */}
                  <div className="space-y-8">
                    {progressUpdates.map((update, index) => (
                      <div key={update.id} className="relative flex items-start">
                        {/* Step Icon */}
                        <div className="w-12 h-12 rounded-full bg-blue-100 border-2 border-[#0021A5] flex items-center justify-center z-10 shadow-md">
                          <div className="w-6 h-6 text-[#0038FF]">
                            {getStatusIcon(update.status)}
                          </div>
                        </div>

                        {/* Step Content */}
                        <div className="ml-6 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-lg text-[#0021A5]">
                              {formatStatus(update.status)}
                            </h4>
                            
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatTime(update.created_at)}
                            </div>
                          </div>
                          
                          {update.notes && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg border-l-4 border-[#0021A5]">
                              <p className="text-sm text-gray-700 italic">
                                "{update.notes}"
                              </p>
                            </div>
                          )}
                          
                          {index === progressUpdates.length - 1 && (
                            <div className="mt-2 flex items-center text-sm text-[#0021A5] font-medium">
                              <div className="w-2 h-2 bg-[#0021A5] rounded-full mr-2 animate-pulse"></div>
                              Current Status
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No progress updates yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
const formatStatus = (status: string): string => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatTime = (timestamp: any): string => {
  if (!timestamp) return '';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString([], { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'accepted':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      );
    case 'picked_up':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      );
    case 'in_progress':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      );
    case 'on_way':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      );
    case 'delivered':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
          <line x1="4" y1="22" x2="4" y2="15"></line>
        </svg>
      );
    case 'completed':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      );
  }
};

export default TaskDetailsChat;