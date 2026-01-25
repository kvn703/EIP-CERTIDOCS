import React, { useState, useEffect } from 'react';
import '../CSS/modern2025.css';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

let notificationId = 0;
const notifications = [];
const listeners = [];

export const showNotification = (message, type = 'info', duration = 3000) => {
  const id = notificationId++;
  const notification = { id, message, type, duration };
  notifications.push(notification);
  listeners.forEach(listener => listener([...notifications]));
  
  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }
  
  return id;
};

export const removeNotification = (id) => {
  const index = notifications.findIndex(n => n.id === id);
  if (index > -1) {
    notifications.splice(index, 1);
    listeners.forEach(listener => listener([...notifications]));
  }
};

const NotificationSystem = () => {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    listeners.push(setNotifs);
    return () => {
      const index = listeners.indexOf(setNotifs);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const getIcon = (type) => {
    switch(type) {
      case 'success':
        return <FaCheckCircle />;
      case 'error':
        return <FaTimesCircle />;
      case 'warning':
        return <FaExclamationTriangle />;
      default:
        return <FaInfoCircle />;
    }
  };

  return (
    <div className="notification-container">
      {notifs.map((notif) => (
        <div
          key={notif.id}
          className={`notification ${notif.type}`}
          onClick={() => removeNotification(notif.id)}
        >
          <span className="notification-icon">{getIcon(notif.type)}</span>
          <span className="notification-message">{notif.message}</span>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;

