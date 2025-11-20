// pages/ProfilePage/ProfileContent.jsx
import React, { useState } from "react";
import styles from "./styles/ProfileContent.module.css";

const ProfileContent = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <h1 className={styles.contentTitle}>Chỉnh sửa thông tin</h1>
      <div className={styles.formGroup}>
        <label>Họ và tên</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Số điện thoại</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Email</label>
        <input type="email" value={user.email} disabled />
      </div>
      <button type="submit" className={styles.btnSave}>
        Lưu Thay Đổi
      </button>
    </form>
  );
};
export default ProfileContent;
