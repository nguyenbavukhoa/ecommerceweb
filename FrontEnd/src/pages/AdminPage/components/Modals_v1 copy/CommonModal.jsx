import React from "react";
import styles from "./CommonModal.module.scss";

const CommonModal = ({ isOpen, onClose, title, children, customWidth }) => {
  if (!isOpen) return null;

  // Ngăn sự kiện click từ modal lan ra ngoài
  const handleContainerClick = (e) => e.stopPropagation();

  return (
    // Click vào backdrop (lớp mờ) để đóng
    <div className={styles.modal} onClick={onClose}>
      <div
        className={styles.modalContainer}
        style={customWidth ? { width: customWidth } : {}}
        onClick={handleContainerClick}
      >
        {title && <h3 className={styles.modalContainerTitle}>{title}</h3>}
        <button className={styles.modalClose} onClick={onClose}>
          <i className="fa-regular fa-xmark"></i>
        </button>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
};

export default CommonModal;
