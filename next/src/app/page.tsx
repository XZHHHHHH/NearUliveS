// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EntryPage() {
  const router = useRouter();

  useEffect(() => {
    const user = sessionStorage.getItem('user');

    if (user) {
      // if an authenticated user is found, send them to /home
      router.replace('/home');
    } else {
      // otherwise send them to /login
      router.replace('/login');
    }
  }, [router]);

  // nothing to render while redirecting
  return null;
}
