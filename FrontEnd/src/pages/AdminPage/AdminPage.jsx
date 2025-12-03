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
import StoreWallet from "./sections/StoreWallet/StoreWallet";
import styles from "./AdminPage.module.css";
import "./admin-global.css";

const AdminPage = () => {
  const { auth, logout } = useAuth();
  const { showToast } = useToast();

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 615);

  // Lấy Store ID từ LocalStorage hoặc auth (ưu tiên LocalStorage để test dễ hơn)
  const [currentStoreId, setCurrentStoreId] = useState(() => {
    if (typeof window !== "undefined") {
      // Nếu muốn test nhanh, bạn có thể hardcode return "1" hoặc "2" ở đây nếu LocalStorage trống
      return localStorage.getItem("currentStoreId") || auth?.storeId;
    }
    return auth?.storeId;
  });

  const [currentStoreName, setCurrentStoreName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("currentStoreName") || "Cửa hàng";
    }
    return "Cửa hàng";
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 615);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("currentStoreId");
    localStorage.removeItem("currentStoreName");
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

  // [ĐÃ BỎ QUA] Phần kiểm tra quyền truy cập (Auth Check)
  // Code sẽ chạy thẳng xuống phần render bên dưới

  const renderContent = () => {
    // Vẫn cần Store ID để các component con fetch dữ liệu
    // Nếu chưa có, hiển thị nhắc nhở nhẹ nhàng (hoặc bạn có thể hardcode ID 1 để test luôn)
    if (!currentStoreId) {
      return (
        <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
          <h3>Chưa xác định Cửa hàng</h3>
          <p>Hệ thống không tìm thấy ID cửa hàng trong bộ nhớ.</p>
          <p>Vui lòng đăng nhập lại qua Admin Login để chọn quán.</p>
          <a href="/admin-login" style={{ color: "blue" }}>
            Về trang đăng nhập
          </a>
        </div>
      );
    }

    switch (activeTab) {
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
      case "DroneMap":
        return null;
      case "StoreWallet":
        return <StoreWallet storeId={currentStoreId} />;
      default:
        // return <Dashboard storeId={currentStoreId} />;
        return <Products storeId={currentStoreId} />;
    }
  };

  return (
    <div className="adminRoot">
      <Header onMenuToggle={handleMenuToggle} storeName={currentStoreName} />

      <div className={styles.container}>
        <Sidebar
          isOpen={isSidebarOpen}
          activeTab={activeTab}
          onTabClick={setActiveTab}
          // Fallback tên nếu chưa đăng nhập
          userName={auth?.fullName || auth?.accountName || "Admin (Test Mode)"}
          storeId={currentStoreId}
          onLogout={handleLogout}
        />

        <main className={styles.content}>
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
