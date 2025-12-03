import { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";

// Import Context
import { useAuth } from "../../context/AuthContext";

// Components
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";

// Sections
import Dashboard from "./sections/Dashboard/Dashboard";
import Stores from "./sections/Stores/Stores";
import Users from "./sections/Users/Users";
import Drones from "./sections/Drones/Drones";
import Revenues from "./sections/Revenues/Revenues";
import Transactions from "./sections/Transactions/Transactions";
// import Statistics from "./sections/Statistics/Statistics";

import styles from "./ServerPage.module.css";
import "./server-global.css";

const ServerPage = () => {
  // 1. Lấy user và logout từ Context (thay vì state local)
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 615);

  // Check resize cho mobile (giữ nguyên)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 615);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Xử lý đăng xuất (Gọi hàm logout của Context)
  const handleLogout = (e) => {
    e.preventDefault();
    logout(); // Hàm này sẽ xóa localStorage và reload/redirect
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
    switch (activeTab) {
      // case "Dashboard":
      //   return <Dashboard onNavigate={setActiveTab} />;
      case "Users":
        return <Users />;
      case "Stores":
        return <Stores />;
      case "Drones":
        return <Drones />;
      case "Revenues":
        return <Revenues />;
      // case "Statistics":
      //   return <Statistics />;\
      case "Transactions":
        return <Transactions />;
      default:
        // return <Dashboard onNavigate={setActiveTab} />;
        return <Users />;
    }
  };

  // 3. Kiểm tra quyền truy cập (Bảo vệ client-side)
  // Nếu không có user hoặc không phải admin (userType !== 1)
  // if (!user || user.userType !== 1) {
  //   return (
  //     <div className="adminRoot">
  //       <div className={styles.accessDeniedSection}>
  //         <img
  //           className={styles.accessDeniedImg}
  //           src="/assets/img/access-denied.webp"
  //           alt="Access Denied"
  //         />
  //         <p style={{ marginTop: "20px", fontSize: "18px", color: "#555" }}>
  //           Bạn không có quyền truy cập trang này.{" "}
  //           <a href="/admin-login">Đăng nhập Admin</a>
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="adminRoot">
      <Header onMenuToggle={handleMenuToggle} />
      <div className={styles.container}>
        <Sidebar
          isOpen={isSidebarOpen}
          activeTab={activeTab}
          onTabClick={setActiveTab}
          userName={user?.fullname || "Server Admin"} // Dùng tên từ Context
          onLogout={handleLogout}
        />

        <main
          className={styles.content}
          style={{
            // marginLeft: isMobile ? "0px" : isSidebarOpen ? "250px" : "75px",
            transition: "margin-left 200ms ease-in-out",
            minHeight: "100vh",
            // paddingTop: "60px",
          }}
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default ServerPage;
