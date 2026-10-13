"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type NotificationType = "success" | "error";

type NotificationContextType = {
  showNotification: (message: string, type?: NotificationType) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotification = useCallback(
    (message: string, type: NotificationType = "success") => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setNotification({ message, type });
      timerRef.current = setTimeout(() => setNotification(null), 3000);
    },
    []
  );

  const value = useMemo(() => ({ showNotification }), [showNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notification && (
        <div
          role={notification.type === "error" ? "alert" : "status"}
          className={`fixed right-5 top-5 z-50 rounded-lg px-4 py-3 text-white ${
            notification.type === "error" ? "bg-red-600" : "bg-black"
          }`}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used inside NotificationProvider");
  }
  return context;
}