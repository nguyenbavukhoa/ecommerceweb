// src/pages/AdminPage/sections/Revenues/StoreWallet.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../../context/AuthContext";
// [FIX] 1. Import useToast
import { useToast } from "../../../../context/ToastContext";
import {
  useStoreWallet,
  useCreateWithdraw,
} from "../../../../context/FilterProvider";
import StatusBadge from "../../../../components/StatusBadge/StatusBadge";
import styles from "./StoreWallet.module.scss";
import { vnd } from "../../utils";

const StoreWallet = () => {
  const { user } = useAuth();
  const prevHistoryRef = useRef([]);

  // [FIX] 2. Khởi tạo hook showToast
  const { showToast } = useToast();

  const { data: wallet, isLoading } = useStoreWallet(user?.storeId);
  const createMutation = useCreateWithdraw();

  // [LOGIC MỚI] Theo dõi sự thay đổi của wallet.history
  useEffect(() => {
    if (!wallet || !wallet.history) return;

    const currentHistory = wallet.history;
    const prevHistory = prevHistoryRef.current;

    // Chỉ chạy so sánh nếu đã có dữ liệu cũ (tránh báo lúc mới vào trang)
    if (prevHistory.length > 0) {
      currentHistory.forEach((newItem) => {
        // Tìm item tương ứng trong quá khứ
        const oldItem = prevHistory.find((old) => old.id === newItem.id);

        // NẾU: Trước đó tồn tại VÀ Trước đó là 'pending' VÀ Bây giờ KHÁC 'pending'
        if (
          oldItem &&
          oldItem.status === "pending" &&
          newItem.status !== "pending"
        ) {
          // => Nghĩa là Admin vừa duyệt hoặc từ chối
          const isApproved = newItem.status === "approved";

          showToast({
            title: isApproved ? "Ting ting! 💸" : "Thông báo",
            message: isApproved
              ? `Yêu cầu rút ${vnd(newItem.amount)} đã được duyệt!`
              : `Yêu cầu rút ${vnd(newItem.amount)} đã bị từ chối.`,
            type: isApproved ? "success" : "error", // Xanh hoặc Đỏ
            duration: 5000,
          });
        }
      });
    }

    // Cập nhật lại ref để dùng cho lần so sánh sau
    prevHistoryRef.current = currentHistory;
  }, [wallet, showToast]); // Chạy lại mỗi khi wallet thay đổi (do refetchInterval 3s)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [bankInfo, setBankInfo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = Number(amount);

    // [FIX] 3. Thay thế alert bằng showToast
    if (!val || val <= 0) {
      showToast({
        title: "Lỗi nhập liệu",
        message: "Số tiền không hợp lệ!",
        type: "warning",
      });
      return;
    }

    if (val > wallet.availableBalance) {
      showToast({
        title: "Số dư không đủ",
        message: `Bạn chỉ có thể rút tối đa ${vnd(wallet.availableBalance)}`,
        type: "error",
      });
      return;
    }

    if (!bankInfo.trim()) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập thông tin ngân hàng thụ hưởng.",
        type: "warning",
      });
      return;
    }

    // Gọi API (Thông báo thành công/thất bại đã được xử lý trong useCreateWithdraw ở FilterProvider)
    createMutation.mutate(
      {
        storeId: user.storeId,
        storeName: user.fullName || "Cửa hàng",
        amount: val,
        bankInfo,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setAmount("");
          setBankInfo("");

          showToast({
            title: "Gửi thành công",
            message: "Yêu cầu rút tiền của bạn đang chờ duyệt.",
            type: "success",
            duration: 4000,
          });
        },
        onError: (error) => {
          showToast({
            title: "Gửi thất bại",
            message: error.message || "Có lỗi xảy ra.",
            type: "error",
          });
        },
      }
    );
  };

  if (isLoading)
    return <div className={styles.section}>Đang tải ví tiền...</div>;
  if (!user?.storeId)
    return (
      <div className={styles.section}>
        Tài khoản này không liên kết với cửa hàng nào.
      </div>
    );

  return (
    <div className={styles.section}>
      {/* HEADER */}
      <div className={styles.adminControl}>
        <h2 className={styles.pageTitle}>💰 Ví Doanh Thu Cửa Hàng</h2>
        <button
          className={styles.btnPrimary}
          onClick={() => setIsModalOpen(true)}
        >
          <i className="fa-solid fa-money-bill-transfer"></i> Rút tiền ngay
        </button>
      </div>

      {/* OVERVIEW CARDS */}
      <div className={styles.overviewGrid}>
        <div className={styles.card}>
          <div className={styles.cardInfo}>
            <span>Tổng doanh thu (Thực tế)</span>
            <h3 style={{ color: "#333" }}>{vnd(wallet.totalRevenue)}</h3>
          </div>
          <div className={`${styles.cardIcon} ${styles.blue}`}>
            <i className="fa-light fa-sack-dollar"></i>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardInfo}>
            <span>Đã rút / Đang chờ</span>
            <h3 style={{ color: "#f57c00" }}>
              {vnd(wallet.totalWithdrawn + wallet.totalPending)}
            </h3>
          </div>
          <div className={`${styles.cardIcon} ${styles.orange}`}>
            <i className="fa-light fa-clock-rotate-left"></i>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardInfo}>
            <span>Số dư khả dụng</span>
            <h3 style={{ color: "#27ae60" }}>{vnd(wallet.availableBalance)}</h3>
          </div>
          <div className={`${styles.cardIcon} ${styles.green}`}>
            <i className="fa-light fa-wallet"></i>
          </div>
        </div>
      </div>

      {/* HISTORY TABLE */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>Lịch sử giao dịch</div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã GD</th>
              <th>Thời gian</th>
              <th>Thông tin nhận tiền</th>
              <th className="text-right">Số tiền</th>
              <th className="text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {wallet.history && wallet.history.length > 0 ? (
              wallet.history.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.requestDate}</td>
                  <td>
                    <div className={styles.bankInfo}>{item.bankInfo}</div>
                  </td>
                  <td className="text-right">
                    <strong>{vnd(item.amount)}</strong>
                  </td>
                  <td className="text-center">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center"
                  style={{ color: "#999" }}
                >
                  Chưa có giao dịch nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL RÚT TIỀN */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>💸 Yêu cầu rút tiền</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Số dư khả dụng:</label>
                <div className={styles.fakeInput}>
                  {vnd(wallet.availableBalance)}
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Số tiền muốn rút:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Nhập số tiền..."
                  autoFocus
                />
              </div>
              <div className={styles.formGroup}>
                <label>Thông tin ngân hàng (Tên NH, STK, Chủ thẻ):</label>
                <textarea
                  rows="3"
                  value={bankInfo}
                  onChange={(e) => setBankInfo(e.target.value)}
                  placeholder="VD: VCB - 0123456789 - NGUYEN VAN A"
                ></textarea>
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={styles.btnSubmit}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Đang gửi..." : "Gửi yêu cầu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreWallet;
