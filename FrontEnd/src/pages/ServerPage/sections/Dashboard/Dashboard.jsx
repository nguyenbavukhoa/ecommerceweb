import React, { useMemo } from "react";
import styles from "./Dashboard.module.scss";
import { vnd } from "../../utils";

import {
  useSystemFinance,
  useServerStores,
  useServerUsers,
} from "../../../../context/FilterProvider"; // Import hook

const COMMISSION_RATE = 0.2; // 20% phí sàn

const Dashboard = ({ onNavigate }) => {
  // 1. Lấy dữ liệu từ Mock DB qua Hook
  const { data: finance } = useSystemFinance();
  const { data: stores = [] } = useServerStores();
  const { data: users = [] } = useServerUsers();

  // [LOGIC MỚI] Tính toán số lượng User là KHÁCH HÀNG (userType === 0)
  const totalCustomers = useMemo(() => {
    return users.filter((u) => u.userType === 0).length;
  }, [users]);

  // 2. Cấu hình Cards thống kê
  const statsCards = [
    {
      id: 1,
      title: "Tổng doanh thu sàn (GMV)",
      value: finance ? vnd(finance.totalRevenueSystem) : "0 ₫",
      icon: "fa-solid fa-earth-americas",
      color: "#2980b9",
      link: "Transactions", // Link tới trang Giao dịch
    },
    {
      id: 2,
      title: "Lợi nhuận ròng (Ước tính 20%)",
      value: finance
        ? vnd(finance.totalRevenueSystem * COMMISSION_RATE)
        : "0 ₫",
      icon: "fa-solid fa-hand-holding-dollar",
      color: "#27ae60",
      link: "Revenues", // Link tới trang Doanh thu/Rút tiền
    },
    {
      id: 3,
      title: "Tổng Đối tác",
      value: stores.length,
      icon: "fa-solid fa-store",
      color: "#e67e22",
      link: "Stores", // Link tới trang Cửa hàng
    },
    {
      id: 4,
      title: "Tổng Khách hàng", // Đổi tên cho rõ nghĩa
      value: totalCustomers, // Dùng biến đã tính toán chuẩn
      icon: "fa-solid fa-users",
      color: "#8e44ad",
      link: "Users", // Link tới trang Người dùng
    },
  ];

  // 3. Sắp xếp Top 5 quán doanh thu cao nhất
  const topStores = useMemo(() => {
    return [...stores]
      .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
      .slice(0, 5);
  }, [stores]);

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.pageTitle}>🚀 Server Dashboard</h1>

      {/* --- 1. KHỐI THỐNG KÊ --- */}
      <div className={styles.statsGrid}>
        {statsCards.map((stat) => (
          <div
            className={styles.statCard}
            key={stat.id}
            onClick={() => {
              if (stat.link && onNavigate) {
                onNavigate(stat.link);
              }
            }}
            // Thêm title để hover thấy hướng dẫn
            title={`Đi tới quản lý ${stat.title}`}
          >
            <div
              className={styles.statIcon}
              style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
            >
              <i className={stat.icon}></i>
            </div>
            <div className={styles.statInfo}>
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
            {/* Icon mũi tên nhỏ để gợi ý bấm được (Optional) */}
            <div className={styles.arrowIcon}>
              <i className="fa-regular fa-chevron-right"></i>
            </div>
          </div>
        ))}
      </div>

      {/* --- 2. BẢNG TOP DOANH THU --- */}
      <div className={styles.tableSection}>
        <h2 className={styles.sectionTitle}>🏆 Top Đối tác doanh thu cao</h2>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã CH</th>
                <th>Tên cửa hàng</th>
                <th>Tổng đơn</th>
                <th>Doanh thu (GMV)</th>
                <th>Phí sàn (20%)</th>
                <th>Thực nhận</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {topStores.map((store) => {
                const revenue = store.revenue || 0;
                const commission = revenue * COMMISSION_RATE;
                const netIncome = revenue - commission;

                return (
                  <tr key={store.id}>
                    <td>
                      <strong>{store.id}</strong>
                    </td>
                    <td style={{ fontWeight: 600 }}>{store.name}</td>
                    <td className="text-center">{store.totalOrders}</td>
                    <td style={{ color: "#2980b9", fontWeight: "bold" }}>
                      {vnd(revenue)}
                    </td>
                    <td style={{ color: "#c0392b" }}>{vnd(commission)}</td>
                    <td style={{ color: "#27ae60", fontWeight: "bold" }}>
                      {vnd(netIncome)}
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${styles[store.status]}`}
                      >
                        {store.status === "active" ? "Hoạt động" : "Tạm ngưng"}
                      </span>
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
