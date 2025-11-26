import React from "react";
import styles from "./Dashboard.module.scss";
import { vnd } from "../../utils"; // Giả sử bạn có hàm format tiền

// Import Mock Data
import {
  SERVER_STATS_MOCK,
  RECENT_STORES_MOCK,
} from "./serverDashboardMockData";

const GRAB_COMMISSION_RATE = 0.2; // 20%

// Helper hiển thị trạng thái
const getStatusBadge = (status) => {
  switch (status) {
    case "active":
      return (
        <span className={`${styles.badge} ${styles.active}`}>Hoạt động</span>
      );
    case "pending":
      return (
        <span className={`${styles.badge} ${styles.pending}`}>Chờ duyệt</span>
      );
    case "inactive":
      return (
        <span className={`${styles.badge} ${styles.inactive}`}>
          Ngừng hoạt động
        </span>
      );
    default:
      return <span>{status}</span>;
  }
};

const Dashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.pageTitle}>🚀 Server Dashboard (MVP)</h1>

      {/* --- 1. KHỐI THỐNG KÊ (STATS CARDS) --- */}
      <div className={styles.statsGrid}>
        {SERVER_STATS_MOCK.map((stat) => (
          <div className={styles.statCard} key={stat.id}>
            <div
              className={styles.statIcon}
              style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
            >
              <i className={stat.icon}></i>
            </div>
            <div className={styles.statInfo}>
              <h3>{stat.isCurrency ? vnd(stat.value) : stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- 2. BẢNG HOẠT ĐỘNG CỬA HÀNG --- */}
      <div className={styles.tableSection}>
        <h2 className={styles.sectionTitle}>Doanh thu các nhà hàng gần đây</h2>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã CH</th>
                <th>Tên cửa hàng</th>
                <th>Tổng đơn</th>
                <th>Doanh thu gốc</th>
                <th>Grab thu (20%)</th>
                <th>Nhà hàng nhận</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_STORES_MOCK.map((store) => {
                const commission = (store.revenue || 0) * GRAB_COMMISSION_RATE;
                const netIncome = (store.revenue || 0) - commission;

                return (
                  <tr key={store.id}>
                    <td data-label="Mã CH">
                      <strong>{store.id}</strong>
                    </td>
                    <td
                      data-label="Tên cửa hàng"
                      style={{ fontWeight: 600, color: "#333" }}
                    >
                      {store.name}
                    </td>
                    <td data-label="Tổng đơn">{store.totalOrders}</td>
                    <td
                      data-label="Doanh thu gốc"
                      style={{ color: "#2980b9", fontWeight: 600 }}
                    >
                      {vnd(store.revenue)}
                    </td>
                    <td
                      data-label="Grab thu (20%)"
                      style={{ color: "#c0392b" }}
                    >
                      {vnd(commission)}
                    </td>
                    <td
                      data-label="Nhà hàng nhận"
                      style={{ color: "#27ae60", fontWeight: 700 }}
                    >
                      {vnd(netIncome)}
                    </td>
                    <td data-label="Trạng thái">
                      {getStatusBadge(store.status)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
