import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user, authFetch } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]); // popup banners
  const seenIds = useRef(new Set());
  const prevStatuses = useRef({});

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

  const addNotification = useCallback((notif) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [{ ...notif, id, time: new Date(), read: false }, ...prev].slice(0, 50));
    return id;
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Poll orders for status changes (customer only)
  const pollOrders = useCallback(async () => {
    if (!user || user.role !== "customer") return;
    try {
      const data = await authFetch("/orders");
      if (!data.success) return;
      (data.orders || []).forEach(ord => {
        const oid = ord._id || ord.id;
        const prev = prevStatuses.current[oid];
        const cur = ord.deliveryStatus || ord.status;

        if (prev === undefined) {
          prevStatuses.current[oid] = cur;
          return;
        }
        if (prev === cur) return;

        prevStatuses.current[oid] = cur;

        const shortId = oid?.toString().slice(-6).toUpperCase();

        if (cur === "out_for_delivery" || cur === "picked_up") {
          const msg = `Your order #${shortId} is out for delivery! 🚚`;
          if (!seenIds.current.has(`ofd-${oid}`)) {
            seenIds.current.add(`ofd-${oid}`);
            addNotification({ type: "delivery", title: "Out for Delivery", message: msg, orderId: oid });
            addAnnouncement({ type: "delivery", title: "🚚 On the Way!", message: msg, color: "#3b82f6" });
          }
        }

        if (cur === "delivered" || ord.status === "delivered") {
          const msg = `Your order #${shortId} has been delivered! 🎉`;
          if (!seenIds.current.has(`del-${oid}`)) {
            seenIds.current.add(`del-${oid}`);
            addNotification({ type: "delivered", title: "Order Delivered!", message: msg, orderId: oid });
            addAnnouncement({ type: "delivered", title: "✅ Delivered!", message: msg, color: "#10b981" });
          }
        }
      });
    } catch (_) {}
  }, [user, authFetch, addNotification, addAnnouncement]);

  // Notify on new order placed (called from CheckoutPage)
  const notifyOrderPlaced = useCallback((order) => {
    const oid = order._id || order.id;
    const shortId = oid?.toString().slice(-6).toUpperCase();
    const msg = `Order #${shortId} placed successfully! We'll deliver within 24 hours. 🌿`;
    addNotification({ type: "placed", title: "Order Placed!", message: msg, orderId: oid });
    addAnnouncement({ type: "placed", title: "🎉 Order Placed!", message: msg, color: "#52b788" });
    prevStatuses.current[oid] = order.deliveryStatus || "processing";
  }, [addNotification, addAnnouncement]);

  useEffect(() => {
    if (!user || user.role !== "customer") return;
    const iv = setInterval(pollOrders, 15000);
    pollOrders();
    return () => clearInterval(iv);
  }, [user, pollOrders]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications, announcements, unreadCount,
      addNotification, notifyOrderPlaced,
      markAllRead, clearAll, dismissAnnouncement,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
