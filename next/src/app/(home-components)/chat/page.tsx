'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatList, {UserWithProfile} from '@/app/(home-components)/chat/ChatList';
import ChatWindow from '@/app/(home-components)/chat/ChatWindow';


export default function ChatPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserWithProfile | null>(null);
  const [selected, setSelected] = useState<{
    conversationId: number;
    user: UserWithProfile;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user as UserWithProfile);
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

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
    <main className="flex h-screen bg-gray-100 overflow-hidden">
      <aside className="w-80 min-w-[320px] flex-shrink-0 bg-white shadow-lg">
        <ChatList
          currentUser={currentUser}
          onSelectThread={(convId, user) => setSelected({ conversationId: convId, user })}
          selectedConversationId={selected?.conversationId}
        />
      </aside>
      
      <section className="flex-1 flex flex-col min-w-0">
        <ChatWindow
          currentUser={currentUser}
          conversationId={selected?.conversationId ?? null}
          receiver={selected?.user ?? null}
        />
      </section>
    </main>
  );
}
