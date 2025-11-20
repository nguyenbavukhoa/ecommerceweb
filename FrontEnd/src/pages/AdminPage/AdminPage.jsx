import { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext"; // Mock hook

// Components
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";

// Sections (Các tab nội dung)
import Dashboard from "./sections/Dashboard/Dashboard";
import Products from "./sections/Products/Products";
import Customers from "./sections/Customers/Customers";
import Orders from "./sections/Orders/Orders";
import Statistics from "./sections/Statistics/Statistics";

import styles from "./AdminPage.module.css";

// IMPORT FILE GLOBAL CỦA ADMIN (!!!)
import "./admin-global.css";
const AdminPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Mặc định mở rộng
  const [activeTab, setActiveTab] = useState("Dashboard");
  const { showToast } = useToast();

  // Hook check login
  useEffect(() => {
    // TẠM LOCK: Giả lập user admin để test giao diện
    setCurrentUser({ fullname: "Admin Test", userType: 1 });

    /* --- BẮT ĐẦU LOCK LOGIC GỐC ---
    try {
      const user = JSON.parse(localStorage.getItem("currentuser"));
      if (user && user.userType !== 0) { // userType 0 là khách, khác 0 là admin
        setCurrentUser(user);
      }
    } catch (e) {
      console.error("Failed to parse current user:", e);
      setCurrentUser(null);
    }
    */ // --- KẾT THÚC LOCK LOGIC GỐC ---
  }, []);

  // Xử lý đăng xuất
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("currentuser");
    setCurrentUser(null);
    showToast({
      title: "Đăng xuất",
      message: "Bạn đã đăng xuất.",
      type: "info",
    });
    // Trong ứng dụng thực tế, bạn nên điều hướng về trang chủ
    window.location.href = "/";
  };

  // Logic toggle sidebar từ JS gốc
  const handleMenuToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Render nội dung (tab) tương ứng
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <Dashboard />;
      case "Products":
        return <Products />;
      case "Customers":
        return <Customers />;
      case "Orders":
        return <Orders />;
      case "Statistics":
        return <Statistics />;
      default:
        return <Dashboard />;
    }
  };

  // Nếu chưa đăng nhập hoặc không phải admin
  if (!currentUser) {
    return (
      <div className="adminRoot">
        <div className={styles.accessDeniedSection}>
          <img
            className={styles.accessDeniedImg}
            src="/assets/img/access-denied.webp"
            alt="Access Denied"
          />
        </div>
      </div>
    );
  }

  // Đã đăng nhập -> Hiển thị layout Admin
  return (
    <div className="adminRoot">
      <Header onMenuToggle={handleMenuToggle} />
      <div className={styles.container}>
        <Sidebar
          isOpen={isSidebarOpen}
          activeTab={activeTab}
          onTabClick={setActiveTab}
          userName={currentUser.fullname}
          onLogout={handleLogout}
        />
        {/* Click vào content sẽ thu nhỏ sidebar (hành vi từ admin.js) */}
        <main className={styles.content} onClick={() => setSidebarOpen(true)}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
