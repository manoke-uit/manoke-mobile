import React, { createContext, useContext, useState, useCallback } from 'react';
import NotificationPopup from '@/components/NotificationPopup';

interface NotificationContextType {
  showNotification: (title: string, description: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const showNotification = useCallback((title: string, description: string) => {
    setNotification({ title, description });
  }, []);

  const handleClose = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <NotificationPopup
          title={notification.title}
          description={notification.description}
          onClose={handleClose}
        />
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}; 