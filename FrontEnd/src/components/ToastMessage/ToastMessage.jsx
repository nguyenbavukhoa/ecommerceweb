import React, { useEffect } from "react";
// Import file module CSS
import styles from "./ToastMessage.module.css";

const ToastMessage = ({ title, message, type, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration + 1000);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: "fa-light fa-check",
    info: "fa-solid fa-circle-info",
    warning: "fa-solid fa-triangle-exclamation",
    error: "fa-solid fa-bug",
  };

  const colors = {
    success: "#47d864",
    info: "#2f86eb",
    warning: "#ffc021",
    error: "#ff6243",
  };

  // Sử dụng object `styles` để lấy class
  const toastTypeClass = styles[type]; // styles.success, styles.info, etc.

  return (
    <div
      className={`${styles.toast} ${toastTypeClass}`}
      style={{
        animation: `slideInLeft ease 0.3s, fadeOut linear 1s ${
          duration / 1000
        }s forwards`,
      }}
    >
      <div className={styles.private}>
        <div className={styles.icon}>
          <i className={icons[type]}></i>
        </div>
        <div className={styles.body}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.msg}>{message}</p>
        </div>
        <div className={styles.close} onClick={onClose}>
          <i className="fa-regular fa-circle-xmark"></i>
        </div>
      </div>
      <div
        className={styles.background}
        style={{
          backgroundColor: colors[type],
          animationName: styles.background_time, // Cần tham chiếu tới keyframe nếu nó cũng bị hash
          animationDuration: `${duration / 1000}s`,
        }}
      />
    </div>
  );
};

export default ToastMessage;
