// src/pages/AdminPage/AdminPage.jsx
import { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { useStoreInfo } from "../../context/FilterProvider";
// [MỚI] Import useSearchParams
import { useSearchParams } from "react-router-dom";

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
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  // [MỚI] Hook lấy params từ URL
  const [searchParams, setSearchParams] = useSearchParams();

  const currentStoreId = user?.storeId;
  const { data: storeInfo } = useStoreInfo(currentStoreId);

  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // [SỬA] Khởi tạo activeTab: Nếu URL có ?tab=... thì lấy, không thì mặc định Dashboard
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "Dashboard"
  );

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 615);

  // [MỚI] Effect: Lắng nghe URL thay đổi để cập nhật Tab
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // [MỚI] Hàm chuyển tab có cập nhật URL
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab }); // Cập nhật URL cho đồng bộ
  };

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

  const renderContent = () => {
    if (!currentStoreId && user?.userType === 1) {
      return (
        <div style={{ padding: 20 }}>
          Lỗi: Tài khoản Admin chưa gán Store ID.
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
      case "StoreWallet":
        return <StoreWallet />;
      case "DroneMap":
        return null; // DroneMap render riêng bên dưới
      default:
        return <Dashboard storeId={currentStoreId} />;
    }
  };

  if (!user || user.userType !== 1) {
    return (
      <div className="adminRoot">
        <div className={styles.accessDeniedSection}>
          <p>Bạn không có quyền truy cập.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="adminRoot">
      <Header
        onMenuToggle={handleMenuToggle}
        storeName={storeInfo?.name || currentStoreId}
      />

      <div className={styles.container}>
        <Sidebar
          isOpen={isSidebarOpen}
          activeTab={activeTab}
          // [SỬA] Truyền hàm handleTabChange mới
          onTabClick={handleTabChange}
          userName={user.fullName || "Admin"}
          storeId={user.storeId}
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
