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

  useEffect(() => { fetchThreads(); }, [fetchThreads]);
  useEffect(() => {
    const iv = setInterval(fetchThreads, 30000);
    return () => clearInterval(iv);
  }, [fetchThreads]);

  if (!currentUser) {
    return <div className="p-4 text-center text-gray-500">Please log in</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="text-gray-500 text-center">Loading...</div>
        ) : threads.length === 0 ? (
          <div className="text-gray-500 text-center">No conversations</div>
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
