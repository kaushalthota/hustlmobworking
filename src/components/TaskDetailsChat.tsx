import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MessageSquare, Map, Clock } from 'lucide-react';
import TaskChat from './TaskChat';
import TaskProgressChat from './TaskProgressChat';
import TaskProgress from './TaskProgress';

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
          <div className="p-4 overflow-y-auto h-full">
            <TaskProgress
              progressUpdates={progressUpdates}
              taskStatus={taskStatus}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsChat;