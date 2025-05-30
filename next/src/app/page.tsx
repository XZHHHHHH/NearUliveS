'use client';
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EntryPage() {
  const router = useRouter();
  const [IsSignedIn, SetSignedIn] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Add real authentication logic here
    console.log('Logging in with', email, password);
    router.push('/feed'); // Redirect after login
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </a>
        </p>
        <br/>
        <Link href='/login'>LoginPage</Link>
        <Link href='/home'>HomePage</Link>
      </div>
    </main>
  );
}

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