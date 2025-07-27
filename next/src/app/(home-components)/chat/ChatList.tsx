'use client';
import { useEffect, useState, useCallback } from 'react';
import type { User, Message } from '@prisma/client';
import { getUserDisplayData } from '@/lib/userUtils';

export type UserWithProfile = User & { profile?: { username?: string; bio?: string; profileImage?: string } | null };

type MessageWithSender = Message & { sender: UserWithProfile };

interface ChatThread {
  conversationId: number;
  user: UserWithProfile;
  lastMessage: MessageWithSender | null;
  unreadCount: number;
}

interface ChatListProps {
  currentUser: UserWithProfile | null;
  onSelectThread: (convId: number, user: UserWithProfile) => void;
  selectedConversationId?: number;
}

export default function ChatList({
  currentUser,
  onSelectThread,
  selectedConversationId
}: ChatListProps) {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<UserWithProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchThreads = useCallback(async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/chat/threads?userId=${currentUser.id}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setThreads(data.threads || []);
    } catch (err) {
      console.error('Error fetching threads', err);
      setError(err instanceof Error ? err.message : 'Failed to load threads');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim() || !currentUser?.id) return;
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}&excludeId=${currentUser.id}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSearchResults(data.users || []);
    } catch (err) {
      console.error('Error searching users', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, [currentUser?.id]);

  const startConversation = async (targetUser: UserWithProfile) => {
    if (!currentUser?.id) return;
    
    try {
      const res = await fetch('/api/chat/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          user1Id: currentUser.id,
          user2Id: targetUser.id,
        }),
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      
      // Close search modal and select the new conversation
      setShowUserSearch(false);
      setSearchQuery('');
      setSearchResults([]);
      
      // Refresh threads to include the new conversation
      await fetchThreads();
      
      // Select the new conversation
      onSelectThread(data.conversationId, targetUser);
    } catch (err) {
      console.error('Error starting conversation', err);
      setError(err instanceof Error ? err.message : 'Failed to start conversation');
    }
  };

  useEffect(() => { fetchThreads(); }, [fetchThreads]);
  useEffect(() => {
    const iv = setInterval(fetchThreads, 30000);
    return () => clearInterval(iv);
  }, [fetchThreads]);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, searchUsers]);

  if (!currentUser) {
    return <div className="p-4 text-center text-gray-500">Please log in</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          <button
            onClick={() => setShowUserSearch(true)}
            className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600 transition-all hover:shadow-lg active:scale-95 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New</span>
          </button>
        </div>
      </div>

      {showUserSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-96 max-w-[90vw] max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Start New Conversation</h3>
              <button
                onClick={() => {
                  setShowUserSearch(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search users by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                autoFocus
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="flex-1 overflow-y-auto min-h-[200px]">
              {searchLoading ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p>Searching...</p>
                </div>
              ) : searchResults.length === 0 ? (
                searchQuery.trim() ? (
                  <div className="text-center text-gray-500 py-8">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p>No users found</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p>Type to search users</p>
                  </div>
                )
              ) : (
                <div className="space-y-2">
                  {searchResults.map(user => (
                    <div
                      key={user.id}
                      onClick={() => startConversation(user)}
                      className="p-3 hover:bg-blue-50 cursor-pointer rounded-lg transition-all duration-200 flex items-center group border border-transparent hover:border-blue-200"
                    >
                      <img 
                        src={getUserDisplayData(user).profileImage} 
                        alt={getUserDisplayData(user).username} 
                        className="w-11 h-11 rounded-full object-cover shadow-sm"
                      />
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {getUserDisplayData(user).username}
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-500">Loading...</span>
          </div>
        ) : threads.length === 0 ? (
          <div className="text-center py-12 px-4">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-500 mb-2">No conversations yet</p>
            <p className="text-sm text-gray-400">Click &ldquo;New&rdquo; to start chatting!</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {threads.map(thread => (
              <div
                key={thread.conversationId}
                onClick={() => onSelectThread(thread.conversationId, thread.user)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedConversationId === thread.conversationId
                    ? 'bg-blue-50 border-l-4 border-blue-500 shadow-sm'
                    : 'hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <img 
                      src={getUserDisplayData(thread.user).profileImage} 
                      alt={getUserDisplayData(thread.user).username} 
                      className="w-12 h-12 rounded-full object-cover shadow-sm"
                    />
                    {thread.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                        {thread.unreadCount > 9 ? '9+' : thread.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium text-gray-900 truncate">
                        {getUserDisplayData(thread.user).username}
                      </p>
                      <p className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {thread.lastMessage?.createdAt ? new Date(thread.lastMessage.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : ''}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {thread.lastMessage?.content || 'No messages yet'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}