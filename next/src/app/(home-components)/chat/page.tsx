'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EntryPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem('user');
      if (user) {
        router.push('/home');
      } else {
        router.push('/login');
      }
    }
  }, [router]);
  return null;
}