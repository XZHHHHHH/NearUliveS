'use client';
import { useEffect, useState } from 'react';
import ChatList, {UserWithProfile} from '@/app/(home-components)/chat/ChatList';
import ChatWindow from '@/app/(home-components)/chat/ChatWindow';


export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<UserWithProfile | null>(null);
  const [selected, setSelected] = useState<{
    conversationId: number;
    user: UserWithProfile;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setCurrentUser(JSON.parse(stored) as UserWithProfile);
    }
  }, []);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Please{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          log in
        </a>
      </div>
    );
  }

  return (
    <main className="flex h-screen bg-gray-100">
      <aside className="w-80 border-r bg-white">
        <ChatList
          currentUser={currentUser}
          onSelectThread={(convId, user) => setSelected({ conversationId: convId, user })}
          selectedConversationId={selected?.conversationId}
        />
      </aside>
      <section className="flex-1">
        <ChatWindow
          currentUser={currentUser}
          conversationId={selected?.conversationId ?? null}
          receiver={selected?.user ?? null}
        />
      </section>
    </main>
  );
}
