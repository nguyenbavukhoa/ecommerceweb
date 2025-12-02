// src/pages/ProfilePage/ProfileContent.jsx
import React, { useState } from "react";
import styles from "./styles/ProfileContent.module.css";

const ProfileContent = ({ user, onSave }) => {
  // State form data
  const [formData, setFormData] = useState({
    fullName: user.fullName || user.accountName || "", // Map đúng tên trường mockData
    phoneNumber: user.phoneNumber || user.phone || "",
    gender: user.gender || "Nam",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State UI
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Validate thông tin chung
    if (!formData.fullName.trim()) {
      setError("Vui lòng nhập họ tên.");
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setError("Vui lòng nhập số điện thoại.");
      return;
    }

    // 2. Validate mật khẩu (nếu có bật đổi pass)
    let finalData = {
      name: formData.fullName, // Map lại cho hàm updateProfile
      phone: formData.phoneNumber,
      gender: formData.gender,
    };

    if (isChangePassword) {
      if (!formData.currentPassword) {
        setError("Vui lòng nhập mật khẩu hiện tại.");
        return;
      }
      // Logic check pass cũ (Giả lập: coi như đúng nếu nhập gì đó)
      // Trong thực tế cần gọi API check pass cũ

      if (formData.newPassword.length < 6) {
        setError("Mật khẩu mới phải từ 6 ký tự trở lên.");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError("Mật khẩu nhập lại không khớp.");
        return;
      }

      // Thêm password mới vào data gửi đi
      finalData.password = formData.newPassword;
    }

    onSave(finalData);
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <h2 className={styles.headerTitle}>Cập nhật hồ sơ</h2>

      {/* --- THÔNG TIN CHUNG --- */}
      <div className={styles.section}>
        <div className={styles.formGroup}>
          <label>Họ và tên</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={styles.inputField}
            placeholder="Nhập họ tên của bạn"
          />
        </div>

        <div className={styles.rowGroup}>
          <div className={styles.formGroup}>
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={styles.inputField}
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Giới tính</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={styles.selectField}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Email (Không thể thay đổi)</label>
          <input
            type="email"
            value={user.email}
            disabled
            className={`${styles.inputField} ${styles.disabled}`}
          />
        </div>
      </div>

      {/* --- BẢO MẬT (ĐỔI MẬT KHẨU) --- */}
      <div className={styles.securitySection}>
        <div className={styles.toggleHeader}>
          <span className={styles.toggleLabel}>
            <i className="fa-solid fa-shield-halved"></i> Đổi mật khẩu
          </span>

          {/* Nút Toggle Switch */}
          <label className={styles.switchWrapper}>
            <input
              type="checkbox"
              checked={isChangePassword}
              onChange={(e) => setIsChangePassword(e.target.checked)}
            />
            <span className={styles.switchSlider}></span>
          </label>
        </div>

        {/* Form ẩn hiện */}
        <div
          className={`${styles.passwordFields} ${
            isChangePassword ? styles.open : ""
          }`}
        >
          <div className={styles.formGroup}>
            <label>Mật khẩu hiện tại</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={styles.inputField}
                placeholder="Nhập mật khẩu cũ"
              />
              <i
                className={`fa-regular ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                } ${styles.eyeIcon}`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Mật khẩu mới</label>
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={styles.inputField}
              placeholder="Tối thiểu 6 ký tự"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Nhập lại mật khẩu mới</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.inputField}
              placeholder="Xác nhận mật khẩu"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <i className="fa-solid fa-circle-exclamation"></i> {error}
        </div>
      )}

      <div className={styles.actionButtons}>
        <button type="submit" className={styles.btnSave}>
          Lưu Thay Đổi
        </button>
      </div>
    </form>
  );
};

export default ProfileContent;
