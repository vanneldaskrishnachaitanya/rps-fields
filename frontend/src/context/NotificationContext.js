import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user, authFetch } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]); // popup banners
  const seenIds = useRef(new Set());

  const addAnnouncement = useCallback((ann) => {
    const id = Date.now() + Math.random();
    setAnnouncements(prev => [...prev, { ...ann, id }]);
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }, 7000);
  }, []);

  const dismissAnnouncement = useCallback((id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  }, []);

  const markAllRead = useCallback(async () => {
    if (!user) return;
    try {
      await authFetch("/notifications/read-all", { method: "PUT" });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      // Track globals in localstorage so they don't show up again
      const globals = notifications.filter(n => !n.recipientId).map(n => n._id);
      if (globals.length > 0) {
        let readGlobals = [];
        try { readGlobals = JSON.parse(localStorage.getItem(`readGlobals_${user._id}`) || "[]"); } catch(e){}
        const merged = Array.from(new Set([...readGlobals, ...globals]));
        localStorage.setItem(`readGlobals_${user._id}`, JSON.stringify(merged));
      }
    } catch (_) {}
  }, [user, authFetch, notifications]);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Poll backend for real notifications
  const pollNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const data = await authFetch("/notifications");
      if (!data.success) return;

      let readGlobals = [];
      try { readGlobals = JSON.parse(localStorage.getItem(`readGlobals_${user._id}`) || "[]"); } catch(e){}

      const fetchedNotifs = (data.notifications || []).map(n => {
        // global notifications read state tracking
        if (!n.recipientId && readGlobals.includes(n._id)) {
          return { ...n, read: true };
        }
        return n;
      });

      setNotifications(fetchedNotifs);

      fetchedNotifs.forEach(n => {
        if (!n.read && !seenIds.current.has(n._id)) {
          seenIds.current.add(n._id);
          
          let color = "#3b82f6";
          let icon = "🔔";
          if (n.type === "product") { color = "#f59e0b"; icon = "✨"; }
          else if (n.type === "delivery") { color = "#10b981"; icon = "🚚"; }
          else if (n.type === "order") { color = "#52b788"; icon = "🌿"; }

          addAnnouncement({ type: n.type, title: `${icon} ${n.title}`, message: n.message, color });
        }
      });
    } catch (_) {}
  }, [user, authFetch, addAnnouncement]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const iv = setInterval(pollNotifications, 8000);
    pollNotifications();
    return () => clearInterval(iv);
  }, [user, pollNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications, announcements, unreadCount,
      markAllRead, clearAll, dismissAnnouncement,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
