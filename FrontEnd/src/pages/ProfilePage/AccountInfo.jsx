// pages/ProfilePage/AccountInfo.jsx
import React from "react";
import styles from "./styles/AccountInfo.module.css";

const AccountInfo = ({ user, onEdit }) => {
  return (
    <div className={styles.accountInfo}>
      <div className={styles.infoGrid}>
        <div className={styles.infoField}>
          <span className={styles.infoLabel}>Họ và tên</span>
          <span className={styles.infoValue}>{user.name}</span>
        </div>
        <div className={styles.infoField}>
          <span className={styles.infoLabel}>Số điện thoại</span>
          <span className={styles.infoValue}>{user.phone}</span>
        </div>
        <div className={styles.infoField}>
          <span className={styles.infoLabel}>Email</span>
          <span className={styles.infoValue}>{user.email}</span>
        </div>
      </div>
      <button className={styles.editButton} onClick={onEdit}>
        Chỉnh sửa
      </button>
    </div>
  );
};
export default AccountInfo;
