'use client';
import React, { useState } from 'react';

export default function Notification() {
  // This keeps track of which tab is selected
  const [activeTab, setActiveTab] = useState('all');
  return (
    <main className="w-full bg-yellow-50 min-h-screen">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <h1 className="text-xl font-bold text-center">Notifications</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-white">
        <button 
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-3 ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          All <span className="ml-1 text-xs bg-gray-100 px-2 py-1 rounded-full">1</span>
        </button>
        <button 
          onClick={() => setActiveTab('likes')}
          className={`flex-1 py-3 ${activeTab === 'likes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Likes <span className="ml-1 text-xs bg-gray-100 px-2 py-1 rounded-full">1</span>
        </button>
        <button 
          onClick={() => setActiveTab('comments')}
          className={`flex-1 py-3 ${activeTab === 'comments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Comments <span className="ml-1 text-xs bg-gray-100 px-2 py-1 rounded-full">1</span>
        </button>
        <button 
          onClick={() => setActiveTab('follows')}
          className={`flex-1 py-3 ${activeTab === 'follows' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Follows <span className="ml-1 text-xs bg-gray-100 px-2 py-1 rounded-full">1</span>
        </button>
      </div>

      {/* Single Notification */}
      <div className="p-4 bg-blue-50 border-l-4 border-blue-500 w-full">
        <div className="flex items-start space-x-3">
          {/* User Avatar */}
          <img
            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          
          {/* Notification Content */}
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-bold">XZH</span>
              <span className="text-gray-600"> liked your post</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Great picture!
            </p>
            <p className="text-xs text-gray-400 mt-1">2m ago</p>
          </div>
          
          {/* Post Thumbnail */}
          <img
            src="https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2025/06/1200/675/shohei-ohtani-1.jpg?ve=1&tl=1"
            alt="Post"
            className="w-12 h-12 rounded-lg"
          />
        </div>
      </div>
    </main>
  );
}
