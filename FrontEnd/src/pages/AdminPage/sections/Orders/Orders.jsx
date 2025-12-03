import React, { useState, useEffect } from "react";
import { useToast } from "../../../../context/ToastContext";
import OrderDetailModal from "../../components/Modals/OrderDetailModal";
import styles from "./Orders.module.scss";
import { vnd } from "../../utils";

import { useAuth } from "../../../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminOrders, useFilters } from "../../../../context/FilterProvider";
import orderService from "../../../../services/orderService";

// [CẬP NHẬT] Thêm IN_PROGRESS vào danh sách
const ORDER_STATUSES = [
  { value: "PLACED", label: "Mới đặt" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "IN_PROGRESS", label: "Đang xử lý" }, // Khớp với JSON API
  { value: "SHIPPING", label: "Đang giao" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];

// Luồng trạng thái logic
const STATUS_FLOW = [
  "PLACED",
  "CONFIRMED",
  "IN_PROGRESS",
  "SHIPPING",
  "COMPLETED",
];

const Orders = ({ storeId }) => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const currentStoreId = storeId || user?.storeId;

  const { filters, setFilters } = useFilters();

  const { data, isLoading, error } = useAdminOrders({
    ...filters,
    storeId: currentStoreId,
  });

  // Lấy dữ liệu từ hook
  const { orders = [], totalPages = 0 } = data || {};

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState(filters.name || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // --- CLIENT SIDE FILTERING ---
  // Lọc dữ liệu hiển thị dựa trên orders lấy về từ API
  const displayedOrders = orders.filter((order) => {
    // Lọc theo Status
    if (statusFilter !== "ALL" && order.orderStatus !== statusFilter)
      return false;
    // Lọc theo Mã đơn
    if (searchTerm && !order.id.toString().includes(searchTerm)) return false;
    return true;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.name) {
        setFilters({ name: searchTerm });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, filters.name, setFilters]);

  // Logic chặn chuyển trạng thái ngược
  const isStatusDisabled = (currentStatus, targetOptionValue) => {
    if (currentStatus === targetOptionValue) return true;
    if (currentStatus === "COMPLETED" || currentStatus === "CANCELLED")
      return true;
    if (targetOptionValue === "CANCELLED") return false;

    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    const targetIndex = STATUS_FLOW.indexOf(targetOptionValue);

    if (currentIndex === -1 || targetIndex === -1) return true;
    return targetIndex <= currentIndex;
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      await queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      showToast({
        title: "Thành công",
        message: `Đơn hàng #${orderId} -> ${newStatus}`,
        type: "success",
      });
    } catch (err) {
      console.error(err);
      showToast({ title: "Lỗi", message: "Cập nhật thất bại", type: "error" });
    }
  };

  const handleStatusFilterChange = (e) => setStatusFilter(e.target.value);
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setFilters({ page: newPage });
  };
  const handleCancelSearch = () => {
    setStatusFilter("ALL");
    setSearchTerm("");
    setFilters({ page: 1, name: undefined });
  };

  const openDetailModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // [CẬP NHẬT] CSS Class cho trạng thái mới
  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED":
        return styles.placed;
      case "CONFIRMED":
        return styles.confirmed;
      case "IN_PROGRESS":
        return styles.shipping; // Dùng chung style với shipping (màu xanh dương)
      case "SHIPPING":
        return styles.shipping;
      case "COMPLETED":
        return styles.completed;
      case "CANCELLED":
        return styles.cancelled;
      default:
        return "";
    }
  };

  return (
    <>
      <div className={styles.section}>
        <div className={styles.adminControl}>
          <div className={styles.adminControlLeft}>
            <select value={statusFilter} onChange={handleStatusFilterChange}>
              <option value="ALL">Tất cả trạng thái</option>
              {ORDER_STATUSES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
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
                placeholder="Tìm kiếm mã đơn..."
                value={searchTerm}
                onInput={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>
          <div className={styles.adminControlRight}>
            <button
              className={styles.btnResetOrder}
              onClick={handleCancelSearch}
            >
              <i className="fa-light fa-arrow-rotate-right"></i>
            </button>
          </div>
        </div>

        <div className={styles.table}>
          <table width="100%">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Ghi chú</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "red",
                    }}
                  >
                    Lỗi kết nối API
                  </td>
                </tr>
              ) : displayedOrders.length > 0 ? (
                displayedOrders.map((order) => (
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

                    <td data-label="Trạng thái">
                      <div
                        className={`${
                          styles.statusSelectWrapper
                        } ${getStatusClass(order.orderStatus)}`}
                      >
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          className={styles.statusSelect}
                          disabled={
                            order.orderStatus === "COMPLETED" ||
                            order.orderStatus === "CANCELLED"
                          }
                        >
                          {ORDER_STATUSES.map((st) => (
                            <option
                              key={st.value}
                              value={st.value}
                              disabled={isStatusDisabled(
                                order.orderStatus,
                                st.value
                              )}
                            >
                              {st.label}
                            </option>
                          ))}
                        </select>
                        {!(
                          order.orderStatus === "COMPLETED" ||
                          order.orderStatus === "CANCELLED"
                        ) && <i className="fa-solid fa-caret-down"></i>}
                      </div>
                    </td>

                    <td className={styles.control} data-label="Thao tác">
                      <button
                        className={styles.btnDetail}
                        onClick={() => openDetailModal(order)}
                      >
                        <i className="fa-regular fa-eye"></i> Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    Không có đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className={styles.pageNav}>
            <ul className={styles.pageNavList}>
              <li
                className={`${styles.pageNavItem} ${
                  filters.page === 1 ? styles.disabled : ""
                }`}
              >
                <a href="#!" onClick={() => handlePageChange(filters.page - 1)}>
                  &laquo;
                </a>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`${styles.pageNavItem} ${
                    filters.page === i + 1 ? styles.active : ""
                  }`}
                >
                  <a href="#!" onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </a>
                </li>
              ))}
              <li
                className={`${styles.pageNavItem} ${
                  filters.page === totalPages ? styles.disabled : ""
                }`}
              >
                <a href="#!" onClick={() => handlePageChange(filters.page + 1)}>
                  &raquo;
                </a>
              </li>
            </ul>
          </div>
        )}
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
