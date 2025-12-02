// src/pages/AdminPage/sections/Revenues/Revenues.jsx
import React, { useState, useMemo } from "react";
import { useToast } from "../../../../context/ToastContext";
import {
  useWithdrawRequests,
  useUpdateWithdraw,
  useSystemFinance,
} from "../../../../context/FilterProvider";
import styles from "./Revenues.module.scss";
import { vnd } from "../../utils";
import StatusBadge from "../../../../components/StatusBadge/StatusBadge"; // Import Component đã tách

const Revenues = () => {
  const { data: requests = [], isLoading } = useWithdrawRequests();
  // [MỚI] Lấy dữ liệu tài chính toàn hệ thống
  const { data: finance } = useSystemFinance();

  const updateMutation = useUpdateWithdraw();
  const { showToast } = useToast();
  const [filter, setFilter] = useState("all");

  // 1. Tính toán số liệu thống kê (Dashboard)
  const stats = useMemo(() => {
    return requests.reduce(
      (acc, item) => {
        const amount = Number(item.amount);
        if (item.status === "pending") {
          acc.pendingCount += 1;
          acc.pendingAmount += amount;
        } else if (item.status === "approved") {
          acc.approvedAmount += amount;
        }
        acc.totalRequest += 1;
        return acc;
      },
      { pendingCount: 0, pendingAmount: 0, approvedAmount: 0, totalRequest: 0 }
    );
  }, [requests]);

  // 2. Logic lọc
  const filteredRequests = useMemo(() => {
    return requests.filter((req) =>
      filter === "all" ? true : req.status === filter
    );
  }, [requests, filter]);

  // 3. Xử lý hành động
  const handleAction = (id, action) => {
    const isApprove = action === "approved";
    const confirmMsg = isApprove
      ? "Xác nhận duyệt và chuyển khoản?"
      : "Xác nhận từ chối yêu cầu này?";

    if (window.confirm(confirmMsg)) {
      updateMutation.mutate(
        { id, status: action },
        {
          onSuccess: () => {
            showToast({
              title: isApprove ? "Đã duyệt đơn" : "Đã từ chối",
              message: isApprove
                ? "Giao dịch đã được ghi nhận thành công."
                : "Yêu cầu rút tiền đã bị hủy bỏ.",
              type: isApprove ? "success" : "info",
              duration: 3000,
            });
          },
          onError: (err) => {
            showToast({
              title: "Lỗi",
              message: err.message || "Có lỗi xảy ra.",
              type: "error",
            });
          },
        }
      );
    }
  };

  return (
    <div className={styles.section}>
      {/* --- DASHBOARD STATS --- */}
      <div className={styles.statsGrid}>
        {/* Card 1: Tổng doanh thu hệ thống (QUAN TRỌNG NHẤT) */}
        <div className={styles.statCard}>
          <div className={`${styles.iconBox} ${styles.blue}`}>
            <i className="fa-solid fa-earth-americas"></i>
          </div>
          <div className={styles.statInfo}>
            <span>Tổng Doanh Thu Hệ Thống</span>
            <h3 style={{ color: "#2980b9" }}>
              {finance ? vnd(finance.totalRevenueSystem) : "..."}
            </h3>
            <p className={styles.subText}>Tổng giá trị đơn hàng hoàn thành</p>
          </div>
        </div>

        {/* Card 2: Đã chi trả (Cash Out) */}
        <div className={styles.statCard}>
          <div className={`${styles.iconBox} ${styles.green}`}>
            <i className="fa-solid fa-money-bill-transfer"></i>
          </div>
          <div className={styles.statInfo}>
            <span>Đã Chi Trả Cho Quán</span>
            <h3 style={{ color: "#27ae60" }}>
              {finance ? vnd(finance.totalPaid) : "..."}
            </h3>
            <p className={styles.subText}>Tổng tiền đã duyệt rút</p>
          </div>
        </div>

        {/* Card 3: Đang giữ hộ (Holding) hoặc Yêu cầu chờ duyệt */}
        <div className={styles.statCard}>
          <div className={`${styles.iconBox} ${styles.purple}`}>
            <i className="fa-solid fa-vault"></i>
          </div>
          <div className={styles.statInfo}>
            <span>Hệ Thống Đang Giữ</span>
            <h3 style={{ color: "#8e44ad" }}>
              {finance ? vnd(finance.currentHolding) : "..."}
            </h3>
            <p className={styles.subText}>
              Trong đó chờ duyệt:{" "}
              <b style={{ color: "#e67e22" }}>
                {finance ? vnd(finance.totalPending) : "0đ"}
              </b>
            </p>
          </div>
        </div>
      </div>

      {/* --- FILTER & HEADER --- */}
      <div className={styles.adminControl}>
        <h2 className={styles.pageTitle}>Danh sách yêu cầu</h2>
        <div className={styles.filterGroup}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">⏳ Đang chờ xử lý</option>
            <option value="approved">✅ Đã hoàn thành</option>
            <option value="rejected">❌ Đã từ chối</option>
          </select>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Cửa hàng</th>
              <th className="text-right">Số tiền rút</th>
              <th>Ngân hàng thụ hưởng</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <tr key={req.id}>
                  <td>
                    <strong>{req.id}</strong>
                  </td>
                  <td>{req.storeName}</td>
                  <td className={styles.amount}>{vnd(req.amount)}</td>
                  <td>
                    <div className={styles.bankInfo}>{req.bankInfo}</div>
                  </td>
                  <td>{req.requestDate}</td>
                  <td>
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="text-center">
                    {req.status === "pending" ? (
                      <div className={styles.actions}>
                        <button
                          className={styles.btnApprove}
                          onClick={() => handleAction(req.id, "approved")}
                          disabled={updateMutation.isPending}
                          title="Duyệt"
                        >
                          <i className="fa-solid fa-check"></i>
                        </button>
                        <button
                          className={styles.btnReject}
                          onClick={() => handleAction(req.id, "rejected")}
                          disabled={updateMutation.isPending}
                          title="Từ chối"
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    ) : (
                      <span className={styles.disabledIcon}>—</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  <div className={styles.emptyState}>
                    <i className="fa-regular fa-folder-open"></i>
                    <p>Không tìm thấy yêu cầu nào.</p>
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

export default Revenues;
