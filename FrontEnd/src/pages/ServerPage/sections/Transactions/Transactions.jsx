// src/pages/ServerPage/sections/Transactions/Transactions.jsx
import React, { useState } from "react";
import {
  useAdminOrders,
  useServerStores,
} from "../../../../context/FilterProvider";
import { vnd } from "../../utils";
import styles from "./Transactions.module.scss";

// Component hiển thị trạng thái đơn hàng (Local)
const OrderStatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase();

  let className = styles.default;
  let icon = "";
  let label = status;

  switch (normalizedStatus) {
    case "placed":
      className = styles.info;
      icon = "fa-clock";
      label = "Mới đặt";
      break;
    case "confirmed":
      className = styles.primary;
      icon = "fa-check";
      label = "Đã xác nhận";
      break;
    case "shipping":
      className = styles.warning;
      icon = "fa-truck-fast";
      label = "Đang giao";
      break;
    case "completed":
      className = styles.success;
      icon = "fa-check-double";
      label = "Hoàn thành";
      break;
    case "cancelled":
      className = styles.danger;
      icon = "fa-xmark";
      label = "Đã hủy";
      break;
    default:
      break;
  }

  return (
    <span className={`${styles.badge} ${className}`}>
      {icon && <i className={`fa-solid ${icon}`}></i>} {label}
    </span>
  );
};

const Transactions = () => {
  // State filter
  const [filterStore, setFilterStore] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Gọi API lấy stores để fill dropdown
  const { data: stores = [] } = useServerStores();

  // Gọi API lấy orders (Truyền storeIdOverride = filterStore)
  const { data, isLoading } = useAdminOrders(
    {
      name: searchTerm,
      page: 1,
    },
    filterStore
  );

  const orders = data?.orders || [];

  return (
    <div className={styles.section}>
      {/* Header Control */}
      <div className={styles.adminControl}>
        <div className={styles.controlLeft}>
          <h2 className={styles.pageTitle}>📜 Lịch sử giao dịch</h2>
          <p className={styles.subTitle}>
            Theo dõi toàn bộ đơn hàng phát sinh trên hệ thống
          </p>
        </div>

        <div className={styles.controlRight}>
          {/* Search Box */}
          <div className={styles.searchBox}>
            <i className="fa-light fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Tìm mã đơn, khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Store */}
          <div className={styles.selectWrapper}>
            <select
              value={filterStore}
              onChange={(e) => setFilterStore(e.target.value)}
              className={styles.customSelect}
            >
              <option value="">Tất cả đối tác</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Thời gian</th>
              <th>Cửa hàng</th>
              <th>Khách hàng</th>
              <th className="text-right">Tổng tiền</th>
              <th>PTTT</th>
              <th className="text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center"
                  style={{ padding: "30px" }}
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span className={styles.orderId}>#{order.id}</span>
                  </td>
                  <td className={styles.timeCell}>
                    <i className="fa-light fa-calendar-days"></i>{" "}
                    {order.orderTime}
                  </td>
                  <td style={{ fontWeight: 500, color: "#333" }}>
                    {order.storeName}
                  </td>
                  <td>
                    <div className={styles.customerInfo}>
                      <span>{order.deliveryInfo?.name}</span>
                      <small>{order.deliveryInfo?.phone}</small>
                    </div>
                  </td>
                  <td className="text-right">
                    <span className={styles.money}>
                      {vnd(order.totalPrice)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.paymentTag} ${
                        order.paymentMethod === "VNPAY"
                          ? styles.vnpay
                          : styles.cash
                      }`}
                    >
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="text-center">
                    <OrderStatusBadge status={order.orderStatus} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  <div className={styles.emptyState}>
                    <i className="fa-light fa-file-circle-xmark"></i>
                    <p>Không tìm thấy giao dịch nào.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
