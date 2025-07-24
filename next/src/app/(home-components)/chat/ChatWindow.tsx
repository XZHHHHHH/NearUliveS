'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import type { Message, User } from '@prisma/client';

type UserWithProfile = User & { profile?: { username?: string } | null };

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
      <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-50">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-lg font-medium">Select a conversation</p>
        <p className="text-sm">Choose a chat from the sidebar to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b sticky top-0 bg-white shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
            {(receiver.profile?.username || receiver.email)
              .charAt(0)
              .toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {receiver.profile?.username || receiver.email}
            </h3>
            {receiver.profile?.username && (
              <p className="text-sm text-gray-500">{receiver.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-2">
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-500">Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-4">
              {(receiver.profile?.username || receiver.email)
                .charAt(0)
                .toUpperCase()}
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              Start a conversation with {receiver.profile?.username || receiver.email}
            </p>
            <p className="text-sm text-gray-500">
              This is the beginning of your conversation. Send a message to get started!
            </p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs lg:max-w-md break-words ${
                    isMe
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className={`text-xs ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatMessageTime(msg.createdAt)}
                    </p>
                    {isMe && (
                      <p className="text-xs text-blue-100 ml-2">
                        {msg.seen ? '✓✓' : '✓'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder={`Message ${receiver.profile?.username || receiver.email}...`}
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