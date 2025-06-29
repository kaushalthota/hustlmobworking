import React, { useState, useEffect, useRef } from 'react';
import { Send, User, X, Paperclip, Loader, Phone, Video, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';

interface TaskChatProps {
  taskId: string;
  currentUser: any;
  otherUser: any;
}

interface Message {
  id: string;
  content: string;
  created_at: any;
  sender_id: string;
  image_url?: string;
  is_read?: boolean;
}

const TaskChat: React.FC<TaskChatProps> = ({ taskId, currentUser, otherUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!taskId || !currentUser?.uid || !otherUser?.id) {
      console.warn('TaskChat missing required props:', { taskId, currentUserUid: currentUser?.uid, otherUserId: otherUser?.id });
      return;
    }
    
    const unsubscribe = loadMessages();
    setConnectionStatus('connected');
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [taskId, currentUser, otherUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = () => {
    if (!taskId || !currentUser?.uid || !otherUser?.id) {
      console.warn('Cannot load messages: missing required data');
      return () => {};
    }

    // Use the new chat structure: chats/{taskId}/messages
    const messagesRef = collection(db, 'chats', taskId, 'messages');
    const q = query(messagesRef, orderBy('created_at', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate() || new Date()
      })) as Message[];
      
      setMessages(messageData);
      
      // Mark messages as read
      markMessagesAsRead(messageData);
      
      scrollToBottom();
      setConnectionStatus('connected');
    }, (error) => {
      console.error('Error loading messages:', error);
      toast.error('Error loading messages');
      setConnectionStatus('disconnected');
    });

    return unsubscribe;
  };

  const markMessagesAsRead = async (messageList: Message[]) => {
    if (!currentUser?.uid) return;
    
    const unreadMessages = messageList.filter(
      msg => msg.sender_id !== currentUser.uid && !msg.is_read
    );
    
    for (const message of unreadMessages) {
      try {
        const messageRef = doc(db, 'chats', taskId, 'messages', message.id);
        await updateDoc(messageRef, {
          is_read: true
        });
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const removeImagePreview = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      if (!currentUser?.uid) {
        throw new Error('User not authenticated');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `chat/${taskId}/${fileName}`;

      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() && !imageFile) {
      return;
    }
    
    if (!currentUser?.uid || !otherUser?.id || !taskId) {
      toast.error('Missing required information to send message');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        setUploadingImage(true);
        imageUrl = await uploadImage(imageFile);
        setUploadingImage(false);
      }

      const messageData = {
        sender_id: currentUser.uid,
        content: newMessage.trim() || (imageUrl ? 'Sent an image' : ''),
        image_url: imageUrl || null,
        is_read: false,
        created_at: serverTimestamp()
      };

      // Add to the new chat structure
      const messagesRef = collection(db, 'chats', taskId, 'messages');
      await addDoc(messagesRef, messageData);

      setNewMessage('');
      removeImagePreview();
      
      setTimeout(scrollToBottom, 100);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error sending message. Please try again.');
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url.toLowerCase());
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const isOwnMessage = (message: Message) => {
    return currentUser?.uid && message.sender_id === currentUser.uid;
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'disconnected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (!taskId || !currentUser?.uid || !otherUser?.id) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-gray-500">
        <p>Unable to load chat. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {otherUser.avatar_url ? (
              <img
                src={otherUser.avatar_url}
                alt={otherUser.full_name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div className="ml-3">
              <h3 className="font-medium">{otherUser.full_name}</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}></div>
                <p className="text-sm text-gray-500">
                  {connectionStatus === 'connected' ? 'Online' : 
                   connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium mb-2">Start the conversation!</p>
            <p className="text-sm">Send a message to {otherUser.full_name} about the task.</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwn = isOwnMessage(message);
            const showAvatar = index === 0 || messages[index - 1].sender_id !== message.sender_id;
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${
                  showAvatar ? 'mt-4' : 'mt-1'
                }`}
              >
                <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[70%]`}>
                  {showAvatar && !isOwn && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 flex-shrink-0">
                      {otherUser.avatar_url ? (
                        <img
                          src={otherUser.avatar_url}
                          alt={otherUser.full_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  )}
                  
                  <div
                    className={`rounded-2xl px-4 py-2 max-w-full ${
                      isOwn
                        ? 'bg-[#0038FF] text-white rounded-br-md'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md shadow-sm'
                    }`}
                  >
                    {message.image_url && isImage(message.image_url) && (
                      <div className="mb-2">
                        <img 
                          src={message.image_url} 
                          alt="Shared image" 
                          className="rounded-lg max-h-60 w-auto cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(message.image_url, '_blank')}
                        />
                      </div>
                    )}
                    {message.content && (
                      <p className="text-sm break-words">{message.content}</p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs ${
                        isOwn ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {formatTimestamp(message.created_at)}
                      </span>
                      {isOwn && (
                        <span className={`text-xs ml-2 ${
                          message.is_read ? 'text-blue-200' : 'text-blue-300'
                        }`}>
                          {message.is_read ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {showAvatar && isOwn && (
                    <div className="w-8 h-8 rounded-full bg-[#0038FF] flex items-center justify-center ml-2 flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="p-4 border-t bg-white">
          <div className="relative inline-block">
            <img 
              src={imagePreview} 
              alt="Upload preview" 
              className="h-20 w-auto rounded-lg border border-gray-200"
            />
            <button 
              onClick={removeImagePreview}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t bg-white">
        <div className="flex items-end space-x-2">
          <button
            type="button"
            onClick={handleImageClick}
            disabled={loading || uploadingImage}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder="Type a message..."
              className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-2 pr-12 focus:border-[#0038FF] focus:ring-1 focus:ring-[#0038FF] focus:outline-none max-h-32"
              rows={1}
              disabled={loading || uploadingImage}
              style={{
                minHeight: '40px',
                height: 'auto'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 128) + 'px';
              }}
            />
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          
          <button
            type="submit"
            disabled={loading || uploadingImage || (!newMessage.trim() && !imageFile)}
            className="p-2 bg-[#0038FF] text-white rounded-full hover:bg-[#0021A5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading || uploadingImage ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskChat;