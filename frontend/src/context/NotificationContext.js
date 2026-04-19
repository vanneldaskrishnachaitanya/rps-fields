import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user, authFetch } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]); // popup banners
  const seenIds = useRef(new Set());

  const getStoredIds = useCallback((key) => {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (_) {
      return [];
    }
  }, []);

  const storeIds = useCallback((key, ids) => {
    localStorage.setItem(key, JSON.stringify(Array.from(new Set(ids))));
  }, []);

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
        const readKey = `readGlobals_${user._id}`;
        const readGlobals = getStoredIds(readKey);
        storeIds(readKey, [...readGlobals, ...globals]);
      }
    } catch (_) {}
  }, [user, authFetch, notifications, getStoredIds, storeIds]);

  const deleteNotification = useCallback(async (id) => {
    if (!user || !id) return;

    const target = notifications.find(n => (n._id || n.id) === id);
    setNotifications(prev => prev.filter(n => (n._id || n.id) !== id));

    // Global notifications are dismissed per-user in local storage.
    if (!target || !target.recipientId) {
      const dismissedKey = `dismissedGlobals_${user._id}`;
      const dismissed = getStoredIds(dismissedKey);
      storeIds(dismissedKey, [...dismissed, id]);
      return;
    }

    try {
      await authFetch(`/notifications/${id}`, { method: "DELETE" });
    } catch (_) {
      if (target) {
        setNotifications(prev => [target, ...prev]);
      }
    }
  }, [user, notifications, authFetch, getStoredIds, storeIds]);

  const clearAll = useCallback(async () => {
    if (!user) return;

    const globals = notifications.filter(n => !n.recipientId).map(n => n._id || n.id).filter(Boolean);
    const dismissedKey = `dismissedGlobals_${user._id}`;
    const dismissed = getStoredIds(dismissedKey);
    if (globals.length > 0) {
      storeIds(dismissedKey, [...dismissed, ...globals]);
    }

    setNotifications([]);

    try {
      await authFetch("/notifications", { method: "DELETE" });
    } catch (_) {}
  }, [user, notifications, authFetch, getStoredIds, storeIds]);

  // Poll backend for real notifications
  const pollNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const data = await authFetch("/notifications");
      if (!data.success) return;

      const readGlobals = getStoredIds(`readGlobals_${user._id}`);
      const dismissedGlobals = getStoredIds(`dismissedGlobals_${user._id}`);

      const fetchedNotifs = (data.notifications || []).filter(n => {
        if (!n.recipientId && dismissedGlobals.includes(n._id)) return false;
        return true;
      }).map(n => {
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
  }, [user, authFetch, addAnnouncement, getStoredIds]);

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
      markAllRead, clearAll, deleteNotification, dismissAnnouncement,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
