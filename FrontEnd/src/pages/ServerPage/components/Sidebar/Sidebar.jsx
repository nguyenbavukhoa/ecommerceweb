import React from "react";
import styles from "./Sidebar.module.scss";

const sidebarItems = [
  // { key: "Dashboard", icon: "fa-light fa-house", label: "Trang tổng quan" },
  // { key: "Products", icon: "fa-light fa-pot-food", label: "Sản phẩm" },
  { key: "Stores", icon: "fa-light fa-store", label: "Đối tác cửa hàng" },
  { key: "Users", icon: "fa-light fa-users", label: "Người dùng" },
  // {
  //   key: "Transactions",
  //   icon: "fa-light fa-basket-shopping",
  //   label: "Giao dịch",
  // },
  // { key: "Revenues", icon: "fa-light fa-wallet", label: "Doanh thu" },
  { key: "Drones", icon: "fa-light fa-drone", label: "Quản lý Drone" },
];

const Sidebar = ({ isOpen, activeTab, onTabClick, userName, onLogout }) => {
  // Logic class:
  // 1. styles.sidebar: Luôn có
  // 2. styles.open: Trạng thái mở rộng (mặc định trên desktop)
  // 3. (không có styles.open): Trạng thái thu nhỏ (khi click)
  // 4. styles.mobileClosed: Trạng thái ẩn trên mobile (khi isOpen = false)
  const sidebarClass = `
    ${styles.sidebar} 
    ${isOpen ? styles.open : ""} 
    ${!isOpen ? styles.mobileClosed : ""} 
  `;

  return (
    <aside className={sidebarClass} onClick={(e) => e.stopPropagation()}>
      <div className={styles.topSidebar}>
        <a href="#" className={styles.channelLogo}>
          <img src="assets/img/favicon.png" alt="Channel Logo" />
        </a>

        <div className={styles.hiddenSidebar}>
          <img
            src="assets/img/admin/khk_food_title.png"
            style={{ height: "30px" }}
            alt="KHK Food"
          />
        </div>
      </div>

      <div className={styles.middleSidebar}>
        <ul className={styles.sidebarList}>
          {sidebarItems.map((item) => (
            <li
              key={item.key}
              className={`${styles.sidebarListItem} ${
                activeTab === item.key ? styles.active : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                onTabClick(item.key);
              }}
            >
              <a href="#" className={styles.sidebarLink}>
                <div className={styles.sidebarIcon}>
                  <i className={item.icon}></i>
                </div>
                <div className={styles.hiddenSidebar}>{item.label}</div>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.bottomSidebar}>
        <ul className={styles.sidebarList}>
          <li className={styles.sidebarListItem}>
            <a href="/" className={styles.sidebarLink}>
              <div className={styles.sidebarIcon}>
                <i className="fa-thin fa-circle-chevron-left"></i>
              </div>
              <div className={styles.hiddenSidebar}>Trang chủ</div>
            </a>
          </li>
          <li className={styles.sidebarListItem}>
            <a href="#" className={styles.sidebarLink}>
              <div className={styles.sidebarIcon}>
                <i className="fa-light fa-circle-user"></i>
              </div>
              <div className={styles.hiddenSidebar}>{userName}</div>
            </a>
          </li>
          <li className={styles.sidebarListItem}>
            <a href="#" className={styles.sidebarLink} onClick={onLogout}>
              <div className={styles.sidebarIcon}>
                <i className="fa-light fa-arrow-right-from-bracket"></i>
              </div>
              <div className={styles.hiddenSidebar}>Đăng xuất</div>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
