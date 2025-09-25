import React, { useEffect } from 'react';
import '../../css/toast-message.css';

const ToastMessage = ({ title, message, type, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration + 1000);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: 'fa-light fa-check',
    info: 'fa-solid fa-circle-info',
    warning: 'fa-solid fa-triangle-exclamation',
    error: 'fa-solid fa-bug'
  };

  const colors = {
    success: '#47d864',
    info: '#2f86eb',
    warning: '#ffc021',
    error: '#ff6243'
  };

  return (
    <div 
      className={`toast toast--${type}`}
      style={{
        animation: `slideInLeft ease 0.3s, fadeOut linear 1s ${duration/1000}s forwards`
      }}
    >
      <div className="toast__private">
        <div className="toast__icon">
          <i className={icons[type]}></i>
        </div>
        <div className="toast__body">
          <h3 className="toast__title">{title}</h3>
          <p className="toast__msg">{message}</p>
        </div>
        <div className="toast__close" onClick={onClose}>
          <i className="fa-regular fa-circle-xmark"></i>
        </div>
      </div>
      <div 
        className="toast__background"
        style={{ backgroundColor: colors[type] }}
      />
    </div>
  );
};

export default ToastMessage;