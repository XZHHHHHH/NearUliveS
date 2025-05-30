'use client';
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EntryPage() {
  const router = useRouter();
  const [IsSignedIn, SetSignedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');

    if(user) {
      SetSignedIn(true);
    } else {
      SetSignedIn(false);
    }
    },[]);

    useEffect(() => {
      if(IsSignedIn) {
        router.push('/home');
      } else {
        router.push('/login');
      }
      },[IsSignedIn]);
    };