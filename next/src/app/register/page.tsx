'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

export default function Register() {
   const router = useRouter();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [error, setError] = useState('')

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // new take in: alert

      // sending a message(data) to server in JSON format.
      // declare a variable to store server's response in it.
      // fetch(): to send a request to a URL
      // POST is a HTTP method to send data, There are more GET for retrieve, DELETE and PUT.
      // stringfy the typescript into a string for server to understands
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          confirmPassword
        }),
      });

      // delcare a data varaible to wait for server's response, needs to convert the response back to typescript object using res.json()
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      alert("Registration successful");
      router.push("/login");
    }
// be aware of the error display at frontend
return(
<div className="flex items-center justify-center pt-50">
<div className="bg-white p-8 w-8/9 border border-gray-200 rounded max-w-md ">
                    <h1 className="text-2xl font-bold mb-4 text-center 
                    ">Register</h1>
                    <br/>
                    <h2><span className="text-red-500">*</span>Email Address</h2>
                    <form onSubmit={handleSubmit}>
                    <input
                        className="w-full p-2 border rounded mb-4"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                    <h3><span className="text-red-500">*</span>Password</h3>
                    <input
                        className="w-full p-2 border rounded mb-6"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                    <h4><span className="text-red-500">*</span>Confirm Password</h4>
                    <input
                        className="w-full p-2 border rounded mb-6"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >Register
                        </button>
                        {error && (
                        <p className="text-red-500">{error}</p>
                        )}
                    </form>
                </div>
                </div>
);
}