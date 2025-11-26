import React, { useState, useEffect } from "react";
import { useToast } from "../../../../context/ToastContext";
import { useWithdrawRequests } from "../../../../context/FilterProvider";
import styles from "./Revenues.module.scss";
import { vnd } from "../../utils";

const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return (
        <span className={`${styles.badge} ${styles.pending}`}>Chờ xử lý</span>
      );
    case "approved":
      return (
        <span className={`${styles.badge} ${styles.approved}`}>Đã chuyển</span>
      );
    case "rejected":
      return (
        <span className={`${styles.badge} ${styles.rejected}`}>Từ chối</span>
      );
    default:
      return <span>{status}</span>;
  }
};

const Revenues = () => {
  const { showToast } = useToast();
  const { data: initialRequests = [], isLoading } = useWithdrawRequests();

  // State local để giả lập việc cập nhật dữ liệu
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (initialRequests.length > 0) {
      setRequests(initialRequests);
    }
  }, [initialRequests]);

  // Lọc dữ liệu
  const filteredRequests = requests.filter((req) =>
    filter === "all" ? true : req.status === filter
  );

  // Xử lý Duyệt
  const handleApprove = (id) => {
    if (window.confirm("Xác nhận đã chuyển tiền cho yêu cầu này?")) {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: "approved" } : req
        )
      );
      showToast({
        title: "Thành công",
        message: "Đã duyệt yêu cầu rút tiền",
        type: "success",
      });
    }
  };

  // Xử lý Từ chối
  const handleReject = (id) => {
    if (window.confirm("Từ chối yêu cầu này?")) {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: "rejected" } : req
        )
      );
      showToast({
        title: "Đã từ chối",
        message: "Yêu cầu bị từ chối",
        type: "info",
      });
    }
  };

  return (
    <div className={styles.section}>
      {/* Control Bar */}
      <div className={styles.adminControl}>
        <div className={styles.adminControlLeft}>
          <h2 className={styles.pageTitle}>💰 Quản lý Yêu cầu Rút tiền</h2>
        </div>

        <div className={styles.adminControlRight}>
          <div className={styles.filterGroup}>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="approved">Đã chuyển</option>
              <option value="rejected">Đã từ chối</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã YC</th>
              <th>Cửa hàng</th>
              <th>Số tiền rút</th>
              <th>Thông tin ngân hàng</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <tr key={req.id}>
                  <td>
                    <strong>{req.id}</strong>
                  </td>
                  <td style={{ fontWeight: 500 }}>{req.storeName}</td>
                  <td className={styles.amount}>{vnd(req.amount)}</td>
                  <td>
                    <div className={styles.bankInfo}>{req.bankInfo}</div>
                  </td>
                  <td>{req.requestDate}</td>
                  <td>{getStatusBadge(req.status)}</td>
                  <td>
                    {req.status === "pending" ? (
                      <div className={styles.actions}>
                        <button
                          className={styles.btnApprove}
                          onClick={() => handleApprove(req.id)}
                        >
                          <i className="fa-light fa-check"></i> Duyệt
                        </button>
                        <button
                          className={styles.btnReject}
                          onClick={() => handleReject(req.id)}
                        >
                          <i className="fa-light fa-xmark"></i> Hủy
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: "#aaa", fontSize: "13px" }}>
                        Đã xử lý
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Không có yêu cầu nào.
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
