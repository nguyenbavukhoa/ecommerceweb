// src/components/common/Modal.jsx
import React from "react";
import styles from "./Modal.module.css";

const Modal = ({ isOpen, onClose, children, customWidth }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.content}
        onClick={(e) => e.stopPropagation()}
        // [FIX QUAN TRỌNG]
        // - width: "100%" -> Để trên mobile nó tự co giãn theo màn hình
        // - maxWidth: customWidth -> Để trên PC nó không vượt quá 1100px
        style={customWidth ? { width: "95%", maxWidth: customWidth } : {}}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
