import { useState, useEffect } from 'react';

export interface Notification {
  id: number;
  userId: number;
  type: 'like' | 'comment';
  postId?: number;
  fromUserId: number;
  read: boolean;
  createdAt: string;
  fromUser: {
    id: number;
    email: string;
    profile?: {
      username?: string;
      profileImage?: string;
    };
  };
}

export interface NotificationCounts {
  all: number;
  likes: number;
  comments: number;
}

export function useNotifications(type: string = 'all') {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notifications?type=${type}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationIds: number[]) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationIds }),
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => 
            notificationIds.includes(notification.id) 
              ? { ...notification, read: true }
              : notification
          )
        );
        
        // Trigger a custom event to refresh counts
        window.dispatchEvent(new CustomEvent('notificationsUpdated'));
        console.log('Notifications marked as read, triggering count refresh');
      }
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [type]);

  return {
    notifications,
    loading,
    error,
    markAsRead,
    refreshNotifications: fetchNotifications,
  };
}

export function useNotificationCounts() {
  const [counts, setCounts] = useState<NotificationCounts>({
    all: 0,
    likes: 0,
    comments: 0,
  });

  const fetchCounts = async () => {
    try {
      const response = await fetch('/api/notifications/counts');
      if (response.ok) {
        const data = await response.json();
        setCounts(data);
      }
    } catch (err) {
      console.error('Failed to fetch notification counts:', err);
    }
  };

  useEffect(() => {
    fetchCounts();
    // Refresh counts every 30 seconds
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  return { counts, refreshCounts: fetchCounts };
}
