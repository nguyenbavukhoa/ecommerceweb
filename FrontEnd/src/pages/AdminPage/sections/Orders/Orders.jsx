// src/pages/AdminPage/sections/Orders/Orders.jsx
import React, { useState, useEffect } from "react";
import { useToast } from "../../../../context/ToastContext";
import OrderDetailModal from "../../components/Modals/OrderDetailModal";
import styles from "./Orders.module.scss";
import { vnd } from "../../utils";
import { useAuth } from "../../../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminOrders, useFilters } from "../../../../context/FilterProvider";
import { db } from "../../../../services/dbService";
// [MỚI] Import useNavigate
import { useNavigate, useLocation } from "react-router-dom"; // Import thêm useLocation nếu cần

const STATUS_LABELS = {
  PLACED: "Đã đặt hàng",
  CONFIRMED: "Đã xác nhận",
  PICKING: "Đang lấy hàng",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

const Orders = () => {
  const navigate = useNavigate(); // [MỚI] Hook điều hướng
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const currentStoreId = user?.storeId;
  const { filters, setFilters } = useFilters();

  const { data, isLoading, error } = useAdminOrders({
    ...filters,
    storeId: currentStoreId,
  });

  const { orders = [], totalPages = 0 } = data || {};

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState(filters.name || "");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.name) {
        setFilters({ name: searchTerm });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, filters.name, setFilters]);

  // Hàm cập nhật trạng thái (Chỉ dùng cho Xác nhận hoặc Hoàn thành/Hủy)
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Xác nhận chuyển trạng thái đơn #${orderId}?`)) return;

    try {
      await db.orders.updateStatus(orderId, newStatus);
      await queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      showToast({
        title: "Thành công",
        message: `Đơn hàng #${orderId} -> ${STATUS_LABELS[newStatus]}`,
        type: "success",
      });
    } catch (err) {
      showToast({ title: "Lỗi", message: "Có lỗi xảy ra", type: "error" });
    }
  };

  // [MỚI] Hàm chuyển hướng sang DroneMap
  const handleGoToMap = (orderId) => {
    // Giữ nguyên đường dẫn gốc (ví dụ /admin), chỉ thêm params
    // ?tab=DroneMap: Để AdminPage biết chuyển tab
    // &orderId=...: Để DroneMap biết highlight đơn hàng nào
    navigate(`?tab=DroneMap&orderId=${orderId}`);
  };
  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    setFilters({ status: value !== "ALL" ? value : undefined, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setFilters({ page: newPage });
  };

  const handleCancelSearch = () => {
    setStatusFilter("ALL");
    setSearchTerm("");
    setTimeStart("");
    setTimeEnd("");
    setFilters({
      page: 1,
      status: undefined,
      name: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  const applyDateFilter = () => {
    setFilters({ startDate: timeStart, endDate: timeEnd, page: 1 });
  };

  const openDetailModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PLACED":
        return styles.placed;
      case "CONFIRMED":
        return styles.confirmed;
      case "SHIPPING":
        return styles.shipping;
      case "PICKING":
        return styles.shipping; // Gộp chung màu với shipping
      case "COMPLETED":
        return styles.completed;
      case "CANCELLED":
        return styles.cancelled;
      default:
        return "";
    }
  };

  // --- RENDER ACTION BUTTONS (SỬA LẠI LOGIC) ---
  const renderActionButtons = (order) => {
    const { id, orderStatus } = order;

    // 1. Đơn mới -> Cần Xác nhận (Bếp nhận đơn)
    if (orderStatus === "PLACED") {
      return (
        <div className={styles.actionGroup}>
          <button
            className={`${styles.btnAction} ${styles.btnConfirm}`}
            onClick={() => handleUpdateStatus(id, "CONFIRMED")}
            title="Xác nhận đơn"
          >
            <i className="fa-solid fa-check"></i> Xác nhận
          </button>
          <button
            className={`${styles.btnAction} ${styles.btnCancel}`}
            onClick={() => handleUpdateStatus(id, "CANCELLED")}
            title="Hủy đơn"
          >
            <i className="fa-solid fa-xmark"></i> Hủy
          </button>
        </div>
      );
    }

    // 2. Đã xác nhận -> Chuyển sang DroneMap để giao
    if (orderStatus === "CONFIRMED") {
      return (
        <div className={styles.actionGroup}>
          <button
            className={`${styles.btnAction} ${styles.btnShip}`}
            // [QUAN TRỌNG] Thay vì update status, ta navigate qua Map
            onClick={() => handleGoToMap(id)}
            title="Điều phối Drone"
          >
            <i className="fa-solid fa-map-location-dot"></i> Điều phối
          </button>
          {/* Nút hủy đề phòng */}
          <button
            className={`${styles.btnAction} ${styles.btnCancel}`}
            onClick={() => handleUpdateStatus(id, "CANCELLED")}
            title="Hủy đơn"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      );
    }

    // 3. Đang giao (PICKING / SHIPPING) -> Nút Hoàn thành (nếu cần can thiệp thủ công)
    if (["PICKING", "SHIPPING"].includes(orderStatus)) {
      return (
        <div className={styles.actionGroup}>
          <button className={styles.btnDroneStatus} disabled>
            <i className="fa-solid fa-robot"></i> Đang bay...
          </button>
          {/* Có thể thêm nút Force Complete nếu cần, nhưng thường Drone tự update */}
        </div>
      );
    }

    return <span className={styles.noAction}>-</span>;
  };

  return (
    <>
      <div className={styles.section}>
        {/* ... (Phần Filter giữ nguyên như cũ) ... */}
        <div className={styles.adminControl}>
          <div className={styles.adminControlLeft}>
            <select value={statusFilter} onChange={handleStatusFilterChange}>
              <option value="ALL">Tất cả trạng thái</option>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.adminControlCenter}>
            <form
              className={styles.formSearch}
              onSubmit={(e) => e.preventDefault()}
            >
              <span className={styles.searchBtn}>
                <i className="fa-light fa-magnifying-glass"></i>
              </span>
              <input
                type="text"
                className={styles.formSearchInput}
                placeholder="Tìm mã đơn..."
                value={searchTerm}
                onInput={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>
          <div className={styles.adminControlRight}>
            <div className={styles.fillterDate}>
              <div>
                <label>Từ</label>
                <input
                  type="date"
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                  onBlur={applyDateFilter}
                />
              </div>
              <div>
                <label>Đến</label>
                <input
                  type="date"
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                  onBlur={applyDateFilter}
                />
              </div>
            </div>
            <button
              className={styles.btnResetOrder}
              onClick={handleCancelSearch}
            >
              <i className="fa-light fa-arrow-rotate-right"></i>
            </button>
          </div>
        </div>

        {/* ... (Phần Table) ... */}
        <div className={styles.table}>
          <table width="100%">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Ghi chú</th>
                <th>Trạng thái</th>
                <th style={{ minWidth: "150px" }}>Thao tác</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", color: "red" }}>
                    Lỗi: {error.message}
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td data-label="Mã đơn">#{order.id}</td>
                    <td data-label="Ngày đặt">{order.orderTime}</td>
                    <td
                      data-label="Tổng tiền"
                      style={{ color: "var(--red)", fontWeight: "bold" }}
                    >
                      {vnd(order.totalPrice)}
                    </td>
                    <td className={styles.noteCell} data-label="Ghi chú">
                      {order.note || "---"}
                    </td>

                    {/* Status Badge */}
                    <td data-label="Trạng thái">
                      <span
                        className={`${styles.statusBadge} ${getStatusBadgeClass(
                          order.orderStatus
                        )}`}
                      >
                        {STATUS_LABELS[order.orderStatus] || order.orderStatus}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td data-label="Thao tác">{renderActionButtons(order)}</td>

                    <td data-label="Chi tiết" className={styles.control}>
                      <button
                        className={styles.btnDetail}
                        onClick={() => openDetailModal(order)}
                      >
                        <i className="fa-regular fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    Không có đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ... (Phần Pagination giữ nguyên) ... */}
        <div className={styles.pageNav}>
          {/* Copy lại logic pagination cũ */}
          <ul className={styles.pageNavList}>
            <li
              className={`${styles.pageNavItem} ${
                filters.page === 1 ? styles.disabled : ""
              }`}
            >
              <a
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(filters.page - 1);
                }}
              >
                &laquo;
              </a>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p >= filters.page - 2 && p <= filters.page + 2)
              .map((p) => (
                <li
                  key={p}
                  className={`${styles.pageNavItem} ${
                    filters.page === p ? styles.active : ""
                  }`}
                >
                  <a
                    href="#!"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(p);
                    }}
                  >
                    {p}
                  </a>
                </li>
              ))}
            <li
              className={`${styles.pageNavItem} ${
                filters.page === totalPages ? styles.disabled : ""
              }`}
            >
              <a
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(filters.page + 1);
                }}
              >
                &raquo;
              </a>
            </li>
          </ul>
        </div>
      </div>

      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </>
  );
};

export default Orders;
