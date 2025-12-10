// src/pages/AdminPage/sections/Orders/Orders.jsx
import React, { useState, useEffect } from "react";
import { useToast } from "../../../../context/ToastContext";
import OrderDetailModal from "../../components/Modals/OrderDetailModal";
import styles from "./Orders.module.scss";
import { vnd } from "../../utils";

// 1. IMPORT AUTH
import { useAuth } from "../../../../context/AuthContext";

import { useQueryClient } from "@tanstack/react-query";
import { useAdminOrders, useFilters } from "../../../../context/FilterProvider";
import { db } from "../../../../data/mockData";

const ORDER_STATUSES = [
  { value: "PLACED", label: "Đã đặt hàng" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "SHIPPING", label: "Đang giao" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];

const STATUS_FLOW = ["PLACED", "CONFIRMED", "SHIPPING", "COMPLETED"];

const Orders = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // 2. LẤY STORE ID
  const { user } = useAuth();
  const currentStoreId = user?.storeId;

  const { filters, setFilters } = useFilters();

  // 3. TRUYỀN STORE ID VÀO HOOK
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
      const success = db.orders.updateStatus(orderId, newStatus);
      if (success) {
        await queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
        showToast({
          title: "Cập nhật thành công",
          message: `Đơn hàng #${orderId} -> ${newStatus}`,
          type: "success",
        });
      } else {
        showToast({
          title: "Lỗi",
          message: "Không tìm thấy đơn hàng",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      showToast({ title: "Lỗi", message: "Có lỗi xảy ra", type: "error" });
    }
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

  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED":
        return styles.placed;
      case "CONFIRMED":
        return styles.confirmed;
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
                    Không có đơn hàng nào tại chi nhánh này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.pageNav}>
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
