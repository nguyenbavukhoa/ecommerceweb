import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";

// 1. Import Hook
import { useAuth } from "../../context/AuthContext";

function AdminLogin() {
  const navigate = useNavigate();

  // 2. Lấy hàm loginAdmin và thông tin user từ Context
  const { loginAdmin, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  // 3. Nếu đã đăng nhập rồi thì đá ngay vào trang Admin
  useEffect(() => {
    if (user) {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  // 4. Xử lý Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Gọi hàm loginAdmin (đã viết trong AuthContext)
    const isSuccess = await loginAdmin(email, password);

    if (isSuccess) {
      // Thành công -> useEffect ở trên sẽ tự chuyển trang
      // hoặc chuyển thủ công tại đây cũng được
      navigate("/admin", { replace: true });
    } else {
      setError("Email hoặc mật khẩu không chính xác!");
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
          {/* Hiển thị lỗi */}
          {error && (
            <div
              style={{
                color: "var(--red)",
                fontSize: "0.9rem",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="admin@khkfood.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <button type="submit" className={styles.submitBtn}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
