import React, { useState, useCallback } from 'react';
import Toast from './Toast';
import './Toast.css';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((type, title, message, duration = 5000) => {
    return addToast({ type, title, message, duration });
  }, [addToast]);

  // Exposer les méthodes globalement
  React.useEffect(() => {
    window.showToast = showToast;
    window.toast = {
      success: (title, message, duration) => showToast('success', title, message, duration),
      error: (title, message, duration) => showToast('error', title, message, duration),
      warning: (title, message, duration) => showToast('warning', title, message, duration),
      info: (title, message, duration) => showToast('info', title, message, duration),
    };
  }, [showToast]);

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer; 