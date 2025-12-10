// src/pages/AdminPage/AdminLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";

import { useAuth } from "../../context/AuthContext";
// 1. [MỚI] Import Toast Hook
import { useToast } from "../../context/ToastContext";

function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin, user } = useAuth();

  // 2. [MỚI] Lấy hàm showToast
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // (Đã xóa state 'error' vì dùng Toast rồi)

  useEffect(() => {
    if (user) {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isSuccess = await loginAdmin(email, password);

      if (isSuccess) {
        // [MỚI] Thông báo thành công (Optional)
        showToast({
          title: "Thành công",
          message: "Đăng nhập quản trị viên thành công!",
          type: "success",
          duration: 3000,
        });
        navigate("/admin", { replace: true });
      } else {
        // [MỚI] Thay thế setError bằng showToast Error
        showToast({
          title: "Đăng nhập thất bại",
          message: "Email hoặc mật khẩu không chính xác!",
          type: "error",
          duration: 3000,
        });
      }
    } catch (err) {
      // [MỚI] Thông báo lỗi hệ thống
      showToast({
        title: "Lỗi kết nối",
        message: "Không thể kết nối đến Server. Vui lòng thử lại sau.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Login</h1>
          <p className={styles.subtitle}>
            Nhập thông tin đăng nhập của bạn để truy cập bảng điều khiển
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Đã xóa div hiển thị lỗi cũ ở đây */}

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="admin@khkfood.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="password">Password</label>
            </div>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
                required
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
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
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
