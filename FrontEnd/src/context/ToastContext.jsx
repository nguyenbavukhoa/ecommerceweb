import React, { createContext, useContext, useState } from 'react';
import ToastMessage from '../components/ToastMessage/ToastMessage';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = ({ title, message, type, duration = 3000 }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div id="toast">
        {toasts.map(toast => (
          <ToastMessage
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);