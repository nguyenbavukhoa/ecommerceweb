// src/pages/ProfilePage/AccountInfo.jsx
import React from "react";
import styles from "./styles/AccountInfo.module.css";

const AccountInfo = ({ user, onEdit }) => {
  // Xử lý trường hợp user chưa load xong hoặc bị null
  const userData = user || {};

  return (
    <div className={styles.accountInfo}>
      <div className={styles.infoGrid}>
        <div className={styles.infoField}>
          <span className={styles.infoLabel}>Họ và tên</span>
          <span className={styles.infoValue}>
            {userData.fullName || userData.accountName || "Chưa cập nhật"}
          </span>
        </div>
        <div className={styles.infoField}>
          <span className={styles.infoLabel}>Số điện thoại</span>
          <span className={styles.infoValue}>
            {userData.phoneNumber || userData.phone || "Chưa cập nhật"}
          </span>
        </div>
        <div className={styles.infoField}>
          <span className={styles.infoLabel}>Email</span>
          <span className={styles.infoValue}>
            {userData.email || "Chưa cập nhật"}
          </span>
        </div>
        <div className={styles.infoField}>
          <span className={styles.infoLabel}>Giới tính</span>
          <span className={styles.infoValue}>
            {userData.gender || "Chưa cập nhật"}
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
