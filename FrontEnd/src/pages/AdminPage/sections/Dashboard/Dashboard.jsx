import React, { useState, useEffect } from "react";
import Card from "../../components/Card/Card";
import styles from "./Dashboard.module.scss";
import { vnd } from "../../utils"; // Import helper

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, products: 0, revenue: 0 });

  // Load data (giống hệt admin.js)
  useEffect(() => {
    const getAmountUser = () => {
      let accounts = localStorage.getItem("accounts")
        ? JSON.parse(localStorage.getItem("accounts"))
        : [];
      return accounts.filter((item) => item.userType === 0).length;
    };
    const getAmountProduct = () => {
      let products = localStorage.getItem("products")
        ? JSON.parse(localStorage.getItem("products"))
        : [];
      return products.length;
    };
    const getMoney = () => {
      let tongtien = 0;
      let orders = localStorage.getItem("order")
        ? JSON.parse(localStorage.getItem("order"))
        : [];
      orders.forEach((item) => {
        tongtien += item.tongtien;
      });
      return tongtien;
    };

    setStats({
      users: getAmountUser(),
      products: getAmountProduct(),
      revenue: getMoney(),
    });
  }, []); // Chạy 1 lần khi mount

  return (
    <div className={styles.section}>
      <h1 className={styles.pageTitle}>Trang tổng quát của cửa hàng Vy Food</h1>
      <div className={styles.cards}>
        <Card
          id="amount-user"
          value={stats.users}
          image="/assets/img/admin/s1.png"
          title="Khách hàng"
          description="Sản phẩm là bất cứ cái gì có thể đưa vào thị trường để tạo sự chú ý, mua sắm, sử dụng hay tiêu dùng nhằm thỏa mãn một nhu cầu hay ước muốn..."
        />
        <Card
          id="amount-product"
          value={stats.products}
          image="/assets/img/admin/s2.png"
          title="Sản phẩm"
          description="Khách hàng mục tiêu là một nhóm đối tượng khách hàng trong phân khúc thị trường mục tiêu mà doanh nghiệp bạn đang hướng tới."
        />
        <Card
          id="doanh-thu"
          value={vnd(stats.revenue)}
          image="/assets/img/admin/s3.png"
          title="Doanh thu"
          description="Doanh thu của doanh nghiệp là toàn bộ số tiền sẽ thu được do tiêu thụ sản phẩm, cung cấp dịch vụ với sản lượng."
        />
      </div>
    </div>
  );
};

export default Dashboard;
