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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  const fetchMessages = useCallback(async () => {
    if (!currentUser?.id || !conversationId) return;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/chat/thread?conversationId=${conversationId}`
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setMessages(data.messages);

      await fetch('/api/chat/mark-seen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, userId: currentUser.id })
      });
    } catch {
      // handle errors if desired
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
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, data.message]);
      }
    } catch {
      // handle errors
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

  if (!currentUser || !receiver || !conversationId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a conversation
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b sticky top-0 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
            {(receiver.profile?.username || receiver.email)
              .charAt(0)
              .toUpperCase()}
          </div>
          <h3 className="font-semibold">
            {receiver.profile?.username || receiver.email}
          </h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-2">
        {loading && messages.length === 0 && (
          <div className="text-center text-gray-500">Loading...</div>
        )}

        {messages.map(msg => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs break-words ${
                  isMe
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900 border'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className="text-xs mt-1 text-gray-500 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
                {isMe && (
                  <p className="text-xs mt-1 text-blue-100">
                    {msg.seen ? '✓✓' : '✓'}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex items-end space-x-3">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a message..."
            className="flex-1 p-3 border rounded-2xl resize-none min-h-[44px] max-h-[120px] focus:outline-none"
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="p-3 rounded-full bg-blue-500 text-white disabled:bg-gray-300"
          >
            {sending ? (
              <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full" />
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}