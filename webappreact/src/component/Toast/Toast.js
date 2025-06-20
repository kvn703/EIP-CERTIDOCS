import React, { useState, useEffect } from 'react';
import './Toast.css';

const Toast = ({ 
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose, 
  id 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose(id);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-times-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
      default:
        return 'fas fa-info-circle';
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`toast ${type} ${isExiting ? 'exiting' : ''}`}
      style={{
        animation: isExiting ? 'toastSlideOut 0.3s ease forwards' : undefined
      }}
    >
      <i className={`toast-icon ${getIcon()}`}></i>
      
      <div className="toast-content">
        {title && <div className="toast-title">{title}</div>}
        {message && <div className="toast-message">{message}</div>}
      </div>
      
      <button className="toast-close" onClick={handleClose}>
        <i className="fas fa-times"></i>
      </button>
      
      <div className="toast-progress"></div>
    </div>
  );
};

export default Toast; 