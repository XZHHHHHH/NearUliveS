'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

export default function Register() {
   const router = useRouter();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   
   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/login');};
return(
<div className="flex items-center justify-center pt-50">
<div className="bg-white p-8 w-8/9 border border-gray-200 rounded max-w-md ">
                    <h1 className="text-2xl font-bold mb-4 text-center 
                    ">Register</h1>
                    <br/>
                    <h2>Email Address</h2>
                    <form onSubmit={handleSubmit}>
                    <input
                        className="w-full p-2 border rounded mb-4"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                    <h3>Password</h3>
                    <input
                        className="w-full p-2 border rounded mb-6"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                    <h4>Confirm Password</h4>
                    <input
                        className="w-full p-2 border rounded mb-6"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >Register
                        </button>
                    </form>
                </div>
                </div>
);
}