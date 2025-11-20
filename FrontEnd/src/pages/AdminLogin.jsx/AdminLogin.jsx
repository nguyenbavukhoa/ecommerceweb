"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";

function AdminLogin() {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Admin login submitted!");
  };

  // Di chuyển đến trang chủ sau khi đăng nhập thành công
  const goToAdminPage = () => {
    navigate("/admin");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Login</h1>
          <p className={styles.subtitle}>
            {/* Enter your credentials to access dashboard */}
            Nhập thông tin đăng nhập của bạn để truy cập bảng điều khiển
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="admin@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="password">Password</label>
              {/* <a href="#" className={styles.forgot}>
                Forgot?
              </a> */}
            </div>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
                required
                placeholder="••••••••"
              />
              <span className={styles.eyeIcon} onClick={togglePassword}>
                <i
                  className={`fas ${
                    passwordVisible ? "fa-eye" : "fa-eye-slash"
                  }`}
                ></i>
              </span>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            onClick={goToAdminPage}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
