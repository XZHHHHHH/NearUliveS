'use client';

import { useState } from "react";
import { useNotifications, useNotificationCounts } from "../../../hooks/useNotifications";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { notifications, loading, error, markAsRead } = useNotifications(activeTab);
  const { counts } = useNotificationCounts();
  const router = useRouter();

  const handleNotificationClick = async (notification: any) => {
    // Mark it read if not already read
    if (!notification.read) {
      await markAsRead([notification.id]);
    }

    if (notification.postId) {
      router.push(`/post/${notification.postId}`);
    }
  };

  const getNotificationText = (notification: any) => {
    const username = notification.fromUser.profile?.username || notification.fromUser.email;
    
    switch (notification.type) {
      case 'like':
        return `${username} liked your post`;
      case 'comment':
        return `${username} commented on your post`;
      default:
        return `${username} interacted with your content`;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  if (loading) {
    return (
      <main className="w-full bg-yellow-50 min-h-screen">
        <div className="p-4 border-b bg-white">
          <h1 className="text-xl font-bold text-center">Notifications</h1>
        </div>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading notifications...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full bg-yellow-50 min-h-screen">
        <div className="p-4 border-b bg-white">
          <h1 className="text-xl font-bold text-center">Notifications</h1>
        </div>
        <div className="p-6 text-center text-red-500">
          Error loading notifications: {error}
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-yellow-50 min-h-screen">
      <div className="p-4 border-b bg-white">
        <h1 className="text-xl font-bold text-center">Notifications</h1>
      </div>

      <div className="flex border-b bg-white">
        <button 
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-4 px-2 text-center transition-colors ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          <div className="flex items-center justify-center">
            <span className="font-medium">All</span>
            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">{counts.all}</span>
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('like')}
          className={`flex-1 py-4 px-2 text-center transition-colors ${activeTab === 'like' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          <div className="flex items-center justify-center">
            <span className="font-medium">Likes</span>
            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">{counts.likes}</span>
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('comment')}
          className={`flex-1 py-4 px-2 text-center transition-colors ${activeTab === 'comment' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          <div className="flex items-center justify-center">
            <span className="font-medium">Comments</span>
            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">{counts.comments}</span>
          </div>
        </button>
      </div>

      <div className="space-y-2 p-4">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500 bg-white rounded-lg">
            No notifications to show
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 cursor-pointer rounded-lg border-l-4 ${
                !notification.read 
                  ? "bg-blue-50 border-blue-500" 
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                  {notification.type === "like" && "❤️"}
                  {notification.type === "comment" && "💬"}
                </div>
                
                <div className="flex-1">
                  <p className="text-sm">
                    {getNotificationText(notification)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {getTimeAgo(notification.createdAt)}
                  </p>
                </div>
                
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
