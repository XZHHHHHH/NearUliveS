'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import type { Message, User } from '@prisma/client';
import { getUserDisplayData } from '@/lib/userUtils';

type UserWithProfile = User & { profile?: { username?: string; bio?: string; profileImage?: string } | null };

interface ChatWindowProps {
  currentUser: UserWithProfile | null;
  conversationId: number | null;
  receiver: UserWithProfile | null;
}

export default function ChatWindow({
  currentUser,
  conversationId,
  receiver
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  const fetchMessages = useCallback(async () => {
    if (!currentUser?.id || !conversationId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/chat/thread?conversationId=${conversationId}`
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setMessages(data.messages || []);

      // Mark messages as seen
      await fetch('/api/chat/markSeen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ conversationId, userId: currentUser.id })
      });
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, conversationId]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);
  useEffect(() => { scrollToBottom(); }, [messages]);
  useEffect(() => {
    const iv = setInterval(fetchMessages, 10000);
    return () => clearInterval(iv);
  }, [fetchMessages]);

  const handleSend = async () => {
    if (!text.trim() || !currentUser?.id || !conversationId || sending) return;

    const msg = text.trim();
    setText('');
    setSending(true);
    setError(null);

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          conversationId,
          senderId: currentUser.id,
          receiverId: receiver?.id,
          content: msg
        })
      });
      
      if (!res.ok) throw new Error(`Status ${res.status}`);
      
      const data = await res.json();
      setMessages(prev => [...prev, data.message]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      setText(msg); // Restore the message if sending failed
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageTime = (date: Date | string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return messageDate.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (!currentUser || !receiver || !conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50">
        <div className="text-center max-w-sm">
          <svg className="w-20 h-20 mx-auto mb-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Messages</h3>
          <p className="text-gray-500">Select a conversation from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center space-x-3">
          <img 
            src={getUserDisplayData(receiver).profileImage} 
            alt={getUserDisplayData(receiver).username} 
            className="w-11 h-11 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {getUserDisplayData(receiver).username}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
        <div className="p-4 space-y-3">
          {loading && messages.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-500">Loading messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6 shadow-lg">
                {getUserDisplayData(receiver).avatarLetter}
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Start a conversation with {getUserDisplayData(receiver).username}
              </h4>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                This is the beginning of your conversation. Send a message to get started!
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.senderId === currentUser.id;
              const prevMsg = messages[index - 1];
              const showTimestamp = !prevMsg || 
                new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() > 300000; // 5 minutes
              
              return (
                <div key={msg.id} className="space-y-1">
                  {showTimestamp && (
                    <div className="text-center">
                      <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {formatMessageTime(msg.createdAt)}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md ${isMe ? 'order-1' : 'order-2'}`}>
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-sm ${
                          isMe
                            ? 'bg-blue-500 text-white ml-auto'
                            : 'bg-white text-gray-900 border border-gray-200'
                        } ${isMe ? 'rounded-br-md' : 'rounded-bl-md'}`}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        <div className={`flex items-center justify-between mt-1 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                          <span className="text-xs">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {isMe && (
                            <span className="text-xs ml-2">
                              {msg.seen ? (
                                <span className="text-blue-200">✓✓</span>
                              ) : (
                                <span className="text-blue-300">✓</span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="p-4 border-t bg-white">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder={`Message ${getUserDisplayData(receiver).username}...`}
              className="w-full p-3 border border-gray-300 rounded-2xl resize-none min-h-[44px] max-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={sending}
              rows={1}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className={`p-3 rounded-full transition-all ${
              !text.trim() || sending
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg active:scale-95'
            }`}
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}