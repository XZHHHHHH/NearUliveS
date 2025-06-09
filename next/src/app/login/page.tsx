'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import Link from 'next/link';

export default function Login() {
   const router = useRouter();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   
   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/home');};
    
    return(
        <main className="flex h-screen">
            <div className="w-1/2 bg-[#1E40B0]">
            <div className="flex justify-center items-center">
                <img src="/login_image.png" 
                    className="w-4/5 h-auto mb-4"
                    width={600} 
                    height={600}
                    style={{marginTop:'120px'}}
                />
            </div>
                <h1 className="welcomeText text-white text-center text-large md:text-xl lg:text-2xl mb-4">
                    Welcome to <span className=" text-orange-500">N</span>ear
                    <span className="text-orange-500">U</span>live<span className="text-orange-500">S</span>
                </h1>
                <h2 className=" text-white text-center text-xs md:text-l lg:text-xl">
                    Log in to know more about
                </h2>
                <h3 className=" text-white text-center text-xs md:text-l lg:text-xl"> 
                    wonderful events in <span className="text-orange-500">NUS</span>
                </h3>
                <div className="flex justify-center items-center">
                    <img src="/login_image1.jpg"
                        className="w-4/5 h-auto mb-4"
                        width={600} 
                        height={600}
                        style={{marginTop:'30px'}}
                    />
            </div>
            </div> 

            <div className="w-1/2 flex justify-center items-center bg-white">
                <div className="flex flex-col items-center">
                    <img src="NearUlives@NUS_white_logo.png" 
                        className="w-2/3 h-auto mb-2"
                        width={300} 
                        height={300}
                        style={{marginTop:'-20px'}}
                    />
                <div className="bg-white p-8 w-8/9 border border-gray-200 rounded max-w-md">
                    <h1 className="text-2xl font-bold mb-4 text-center 
                    ">Sign In</h1>
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
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >Log In
                        </button>
                    </form>
                    <p className="mt-4 text-center text-sm">
                    Don’t have an account?{' '}
                    <Link href="/register" className="text-orange-500 hover:underline">
                        Register
                    </Link>
                    </p>
                </div>
            </div>
            </div>
        </main>
    );
}