// src/pages/ProfilePage/AccountInfo.jsx
import React from "react";
import styles from "./styles/AccountInfo.module.css";

const AccountInfo = ({ user, onEdit }) => {
  return (
    <div className={styles.accountInfo}>
      <div className={styles.infoGrid}>
        <div className={styles.infoField}>
          <span className={styles.infoLabel}>Họ và tên</span>
          <span className={styles.infoValue}>
            {user.fullName || user.accountName}
          </span>
        </div>
        <div className={styles.infoField}>
          <span className={styles.infoLabel}>Số điện thoại</span>
          <span className={styles.infoValue}>
            {user.phoneNumber || user.phone || "Chưa cập nhật"}
          </span>
        </div>
        <div className={styles.infoField}>
          <span className={styles.infoLabel}>Email</span>
          <span className={styles.infoValue}>{user.email}</span>
        </div>
        <div className={styles.infoField}>
          <span className={styles.infoLabel}>Giới tính</span>
          <span className={styles.infoValue}>
            {user.gender || "Chưa cập nhật"}
          </span>
        </div>
      </div>
      <button className={styles.editButton} onClick={onEdit}>
        <i className="fa-regular fa-pen-to-square"></i> Chỉnh sửa
      </button>
    </div>
  );
};

export default AccountInfo;
