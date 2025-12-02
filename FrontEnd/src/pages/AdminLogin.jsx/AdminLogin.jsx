import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";

// 1. Import Hook & Service
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import storeService from "../../services/storeService";

function AdminLogin() {
  const navigate = useNavigate();
  const { user, loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [step, setStep] = useState(1);
  const [stores, setStores] = useState([]);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // useEffect kiểm tra đăng nhập (Giữ nguyên)
  useEffect(() => {
    const savedStoreId = localStorage.getItem("currentStoreId");
    if (user && savedStoreId) {
      if (
        user.role === "ADMIN" ||
        user.role === "STORE_OWNER" ||
        user.role === "STAFF"
      ) {
        navigate("/admin", { replace: true });
      }
    }
  }, [user, navigate]);

  const togglePassword = () => setPasswordVisible(!passwordVisible);

  // --- BƯỚC 1: XỬ LÝ ĐĂNG NHẬP ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Gọi API Login
      const result = await loginUser(email, password);

      if (result.success) {
        // 2. Lấy danh sách cửa hàng
        const allStores = await storeService.getAll();
        const activeStores = allStores.filter((s) => s.active);

        if (activeStores.length === 0) {
          setError("Tài khoản này không quản lý cửa hàng nào.");
          setIsLoading(false);
          return;
        }

        // Nếu chỉ có 1 cửa hàng -> Chọn luôn
        if (activeStores.length === 1) {
          handleSelectStore(activeStores[0]);
        } else {
          // Nhiều cửa hàng -> Qua bước 2 chọn
          setStores(activeStores);
          setStep(2);
          setIsLoading(false);
        }
      } else {
        setError(result.message || "Đăng nhập thất bại.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối hệ thống.");
      setIsLoading(false);
    }
  };

  // --- BƯỚC 2: CHỌN CỬA HÀNG (ĐÃ SỬA LOGIC ĐIỀU HƯỚNG) ---
  const handleSelectStore = (store) => {
    // 1. Lưu ID cửa hàng
    localStorage.setItem("currentStoreId", store.id);
    localStorage.setItem("currentStoreName", store.name);

    // 2. [QUAN TRỌNG] Dùng window.location.href để Reload lại ứng dụng
    // Điều này đảm bảo AuthContext đọc lại Token và User Role mới nhất từ LocalStorage
    // Thay vì dùng navigate("/admin") có thể bị lỗi state cũ
    window.location.href = "/admin";
  };

  // --- RENDER ---
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Quản Lý Cửa Hàng</h1>
          <p className={styles.subtitle}>
            {step === 1
              ? "Đăng nhập dành cho Quản trị viên & Chủ cửa hàng"
              : "Vui lòng chọn cửa hàng để quản lý"}
          </p>
        </div>

        {/* STEP 1: FORM LOGIN */}
        {step === 1 && (
          <form onSubmit={handleLoginSubmit} className={styles.form}>
            {error && (
              <div
                style={{
                  color: "var(--red)",
                  textAlign: "center",
                  marginBottom: "10px",
                  padding: "8px",
                  backgroundColor: "#ffe6e6",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
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
                <label htmlFor="password">Mật khẩu</label>
              </div>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  required
                  placeholder="Nhập mật khẩu"
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

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>
        )}

        {/* STEP 2: CHỌN CỬA HÀNG */}
        {step === 2 && (
          <div className={styles.storeSelection}>
            <div
              className={styles.storeList}
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {stores.map((store) => (
                <button
                  key={store.id}
                  className={styles.storeBtn}
                  onClick={() => handleSelectStore(store)}
                  style={{
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    background: "white",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.borderColor = "var(--primary)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.borderColor = "#ddd")
                  }
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "#f0f0f0",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#666",
                    }}
                  >
                    <i className="fa-solid fa-store"></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
                      {store.name}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#888" }}>
                      {store.address}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(1)}
              style={{
                marginTop: "20px",
                background: "none",
                border: "none",
                color: "#666",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Quay lại đăng nhập
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminLogin;
