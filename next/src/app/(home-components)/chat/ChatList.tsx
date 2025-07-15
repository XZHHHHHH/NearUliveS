'use client';
import { useEffect, useState, useCallback } from 'react';
import type { User, Message } from '@prisma/client';

export type UserWithProfile = User & { profile?: { username?: string } | null };

type MessageWithSender = Message & { sender: UserWithProfile };

interface ChatThread {
  conversationId: number;
  user: UserWithProfile;
  lastMessage: MessageWithSender;
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
      const res = await fetch(`/api/chat/threads?userId=${currentUser.id}`);
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
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}&excludeId=${currentUser.id}`);
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
      const res = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Messages</h2>
          <button
            onClick={() => setShowUserSearch(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-all hover:shadow-md active:scale-95 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* User Search Modal */}
      {showUserSearch && (
        <div className="absolute inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-start justify-center pt-20 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-96 max-h-96 flex flex-col animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Start New Conversation</h3>
              <button
                onClick={() => {
                  setShowUserSearch(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
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
            
            <div className="flex-1 overflow-y-auto">
              {searchLoading ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  Searching...
                </div>
              ) : searchResults.length === 0 ? (
                searchQuery.trim() ? (
                  <div className="text-center text-gray-500 py-8">
                    <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    No users found
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Type to search users
                  </div>
                )
              ) : (
                <div className="space-y-1">
                  {searchResults.map(user => (
                    <div
                      key={user.id}
                      onClick={() => startConversation(user)}
                      className="p-3 hover:bg-blue-50 cursor-pointer rounded-lg transition-colors flex items-center group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
                        {(user.profile?.username || user.email)
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {user.profile?.username || user.email}
                        </p>
                        {user.profile?.username && (
                          <p className="text-sm text-gray-500">{user.email}</p>
                        )}
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="text-gray-500 text-center">Loading...</div>
        ) : threads.length === 0 ? (
          <div className="text-gray-500 text-center">
            No conversations yet. Click "New Chat" to start one!
          </div>
        ) : (
          threads.map(thread => (
            <div
              key={thread.conversationId}
              onClick={() => onSelectThread(thread.conversationId, thread.user)}
              className={`p-3 mb-1 rounded-lg cursor-pointer transition-colors ${
                selectedConversationId === thread.conversationId
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                  {(thread.user.profile?.username || thread.user.email)
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium truncate">
                      {thread.user.profile?.username || thread.user.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(thread.lastMessage.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {thread.lastMessage.content}
                  </p>
                </div>
                {thread.unreadCount > 0 && (
                  <div className="ml-2 bg-red-500 text-white text-xs px-1 rounded-full">
                    {thread.unreadCount > 9 ? '9+' : thread.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}