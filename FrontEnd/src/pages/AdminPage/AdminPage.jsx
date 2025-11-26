import { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

// Components
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";

// Sections
import Dashboard from "./sections/Dashboard/Dashboard";
import Products from "./sections/Products/Products";
import Customers from "./sections/Customers/Customers";
import Orders from "./sections/Orders/Orders";
import DroneMap from "./sections/DroneMap/DroneMap";
import StoreSetting from "./sections/StoreSetting/StoreSetting";
import Statistics from "./sections/Statistics/Statistics";

import styles from "./AdminPage.module.css";
import "./admin-global.css";

const AdminPage = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 615);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 615);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    showToast({
      title: "Đăng xuất",
      message: "Bạn đã đăng xuất thành công.",
      type: "info",
    });
  };

  const handleMenuToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  // 1. Lấy Store ID
  const currentStoreId = user?.storeId;

  // 2. Hàm render các tab THƯỜNG (Sẽ bị unmount khi chuyển tab để tiết kiệm bộ nhớ)
  const renderContent = () => {
    if (!currentStoreId && user?.userType === 1) {
      return (
        <div style={{ padding: 20 }}>
          Lỗi: Tài khoản Admin này chưa được gán Store ID.
        </div>
      );
    }

    switch (activeTab) {
      case "Dashboard":
        return <Dashboard storeId={currentStoreId} />;
      case "Products":
        return <Products storeId={currentStoreId} />;
      case "Customers":
        return <Customers storeId={currentStoreId} />;
      case "Orders":
        return <Orders storeId={currentStoreId} />;
      case "StoreSetting":
        return <StoreSetting storeId={currentStoreId} />;
      case "Statistics":
        return <Statistics storeId={currentStoreId} />;
      // Lưu ý: Không render DroneMap ở đây nữa
      case "DroneMap":
        return null;
      default:
        return <Dashboard storeId={currentStoreId} />;
    }
  };

  // Kiểm tra quyền
  if (!user || user.userType !== 1) {
    return (
      <div className="adminRoot">
        <div className={styles.accessDeniedSection}>
          <img
            className={styles.accessDeniedImg}
            src="/assets/img/access-denied.webp"
            alt="Access Denied"
          />
          <p style={{ marginTop: "20px", fontSize: "18px", color: "#555" }}>
            Bạn không có quyền truy cập trang này.{" "}
            <a href="/admin-login">Đăng nhập Admin</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="adminRoot">
      <Header onMenuToggle={handleMenuToggle} storeName={user?.storeId} />
      <div className={styles.container}>
        <Sidebar
          isOpen={isSidebarOpen}
          activeTab={activeTab}
          onTabClick={setActiveTab}
          userName={user.fullName || "Admin"}
          storeId={user.storeId}
          onLogout={handleLogout}
        />

        <main className={styles.content}>
          {/* LOGIC QUAN TRỌNG:
             1. Nếu không phải tab DroneMap, hiển thị nội dung bình thường (renderContent).
             2. DroneMap luôn luôn được render nhưng dùng CSS để ẩn hiện.
             Điều này giúp Drone vẫn "bay" ngầm khi bạn đang xem tab Đơn hàng.
          */}

          {activeTab !== "DroneMap" && renderContent()}

          <div
            style={{
              display: activeTab === "DroneMap" ? "block" : "none",
              height: "100%",
            }}
          >
            <DroneMap storeId={currentStoreId} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
