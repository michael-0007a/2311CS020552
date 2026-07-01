import { useState, useEffect } from "react";
import { fetchNotifications } from "../api/notifications";
import { Log } from "../api/logger";

export function compareNotifications(a, b) {
  const priorityMap = {
    Placement: 3,
    Result: 2,
    Event: 1
  };
  const pA = priorityMap[a.Type] || 0;
  const pB = priorityMap[b.Type] || 0;

  if (pA !== pB) {
    return pB - pA;
  }
  return b.Timestamp.localeCompare(a.Timestamp);
}

export function useNotifications(limit, page, notificationType) {
  const [notifications, setNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = localStorage.getItem("read_notification_ids");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const updateReadIds = (newIds) => {
    setReadIds(newIds);
    try {
      localStorage.setItem("read_notification_ids", JSON.stringify(newIds));
    } catch (e) {
      console.error("Failed to save read_notification_ids:", e);
    }
  };

  const markAsRead = async (id) => {
    if (!readIds.includes(id)) {
      updateReadIds([...readIds, id]);
      await Log("frontend", "info", "component", "Notification marked as read");
    }
  };

  const markAsUnread = async (id) => {
    if (readIds.includes(id)) {
      updateReadIds(readIds.filter(x => x !== id));
      await Log("frontend", "info", "component", "Notification marked as unread");
    }
  };

  const markAllAsRead = async (itemsToMark) => {
    const idsToMark = itemsToMark.map(n => n.ID);
    const newReadIds = Array.from(new Set([...readIds, ...idsToMark]));
    updateReadIds(newReadIds);
    await Log("frontend", "info", "component", "Mark all as read");
  };

  const mergeNotifications = (existing, incoming) => {
    const map = new Map();
    existing.forEach(n => map.set(n.ID, n));
    incoming.forEach(n => map.set(n.ID, n));
    return Array.from(map.values());
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      await Log("frontend", "info", "hook", "Loading state");
      try {
        const data = await fetchNotifications(limit, page, notificationType);
        if (active) {
          const list = data.notifications ?? [];
          setNotifications(list);
          setAllNotifications(prev => mergeNotifications(prev, list));
          if (list.length === 0) {
            await Log("frontend", "info", "hook", "Empty state");
          }
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to fetch notifications");
          await Log("frontend", "error", "hook", "Unexpected errors");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [limit, page, notificationType]);

  useEffect(() => {
    const interval = setInterval(async () => {
      await Log("frontend", "info", "hook", "Polling cycle started");
      try {
        const data = await fetchNotifications(10, 1, "");
        const list = data.notifications ?? [];
        setAllNotifications(prev => mergeNotifications(prev, list));
        await Log("frontend", "info", "hook", "Polling cycle successful");
      } catch (err) {
        await Log("frontend", "error", "hook", "Polling cycle failed");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    allNotifications,
    readIds,
    loading,
    error,
    markAsRead,
    markAsUnread,
    markAllAsRead
  };
}

