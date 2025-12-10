// src/pages/NotificationPage/NotificationPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotificationPage.module.css"; // CSS Module tương tự OrderPage
import Modal from "../../components/common/Modal"; // Tận dụng Modal có sẵn
import { useAuth } from "../../context/AuthContext";
import notificationService from "../../services/notificationService"; // Service bạn đã tạo
import { useToast } from "../../context/ToastContext";

// Định nghĩa các tab lọc (Giống STATUSES bên OrderPage)
const FILTERS = [
  { id: "ALL", label: "Tất cả", iconClass: "fa-solid fa-inbox" },
  { id: "UNREAD", label: "Chưa đọc", iconClass: "fa-solid fa-envelope" },
  { id: "ORDER", label: "Đơn hàng", iconClass: "fa-solid fa-truck-fast" },
  { id: "SYSTEM", label: "Hệ thống", iconClass: "fa-solid fa-shield-check" },
];

// Helper format thời gian
const formatTime = (isoString) => {
  const date = new Date(isoString);
  return `${date.getHours()}:${String(date.getMinutes()).padStart(
    2,
    "0"
  )} - ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const NotificationPage = () => {
  const navigate = useNavigate();
  const { auth: currentUser } = useAuth();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");

  // State cho Modal chi tiết
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Lấy dữ liệu
  const fetchNotifications = async () => {
    if (currentUser) {
      setLoading(true);
      try {
        const data = await notificationService.getNotifications();
        setNotifications(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentUser]);

  // 2. Xử lý logic đọc thông báo
  const handleRead = async (notif) => {
    // Mở modal xem chi tiết
    setSelectedNotif(notif);
    setIsModalOpen(true);

    // Nếu chưa đọc thì gọi API đánh dấu đã đọc
    if (!notif.isRead) {
      try {
        await notificationService.markAsRead(notif.id);
        // Cập nhật state local ngay lập tức để UI phản hồi nhanh
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
      } catch (error) {
        console.error("Lỗi đánh dấu đã đọc", error);
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showToast({
        title: "Thành công",
        message: "Đã đọc tất cả thông báo",
        type: "success",
      });
    } catch (error) {
      showToast({ title: "Lỗi", message: "Thao tác thất bại", type: "error" });
    }
  };

  // 3. Lọc dữ liệu (Client Side)
  const filteredNotifs = useMemo(() => {
    let result = notifications;

    if (activeFilter === "UNREAD") {
      result = result.filter((n) => !n.isRead);
    } else if (activeFilter === "ORDER") {
      result = result.filter((n) => n.type === "ORDER");
    } else if (activeFilter === "SYSTEM") {
      result = result.filter((n) => n.type === "SYSTEM");
    }

    // Sắp xếp: Chưa đọc lên trước, sau đó đến thời gian mới nhất
    return result.sort((a, b) => {
      if (a.isRead === b.isRead) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return a.isRead ? 1 : -1;
    });
  }, [notifications, activeFilter]);

  if (!currentUser)
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        Vui lòng đăng nhập.
      </div>
    );

  return (
    <div className={styles.pageContainer}>
      {/* HEADER (Giống OrderPage) */}
      <header className={styles.header}>
        <div className={styles.returnBtn}>
          <button onClick={() => navigate(-1)}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        </div>
        <h2 className={styles.title}>Hộp thư thông báo</h2>
      </header>

      <main className={styles.mainSection}>
        {/* THANH CÔNG CỤ & FILTER */}
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className={`${styles.filterBtn} ${
                  activeFilter === f.id ? styles.active : ""
                }`}
                onClick={() => setActiveFilter(f.id)}
              >
                <i className={f.iconClass}></i> {f.label}
              </button>
            ))}
          </div>
          {/* Nút Đọc tất cả */}
          <button className={styles.markAllBtn} onClick={handleMarkAllRead}>
            <i className="fa-regular fa-check-double"></i> Đọc tất cả
          </button>
        </div>

        {/* DANH SÁCH THÔNG BÁO */}
        <div className={styles.listContainer}>
          {loading ? (
            <div className={styles.loading}>Đang tải thông báo...</div>
          ) : filteredNotifs.length > 0 ? (
            filteredNotifs.map((item) => (
              <div
                key={item.id}
                className={`${styles.notifItem} ${
                  !item.isRead ? styles.unread : ""
                }`}
                onClick={() => handleRead(item)}
              >
                {/* Cột 1: Icon */}
                <div className={styles.itemIcon}>
                  <img
                    src={
                      item.image ||
                      "https://cdn-icons-png.flaticon.com/512/1144/1144760.png"
                    }
                    alt="icon"
                  />
                </div>

                {/* Cột 2: Nội dung (Gmail style) */}
                <div className={styles.itemContent}>
                  <div className={styles.itemHeader}>
                    <span className={styles.itemTitle}>{item.title}</span>
                    <span className={styles.itemTime}>
                      {formatTime(item.createdAt)}
                    </span>
                  </div>
                  <p className={styles.itemSnippet}>{item.message}</p>
                </div>

                {/* Cột 3: Trạng thái (Chấm xanh) */}
                {!item.isRead && <div className={styles.unreadDot}></div>}
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <i
                className="fa-light fa-inbox"
                style={{ fontSize: 40, marginBottom: 10 }}
              ></i>
              <p>Không có thông báo nào.</p>
            </div>
          )}
        </div>
      </main>

      {/* MODAL CHI TIẾT (Giống xem chi tiết đơn hàng) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedNotif && (
          <div className={styles.detailModal}>
            <div className={styles.modalHeader}>
              <h3>{selectedNotif.title}</h3>
              <span className={styles.modalTime}>
                {formatTime(selectedNotif.createdAt)}
              </span>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalImage}>
                <img src={selectedNotif.image} alt="" />
              </div>
              <p className={styles.modalMessage}>{selectedNotif.message}</p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.closeBtn}
                onClick={() => setIsModalOpen(false)}
              >
                Đóng
              </button>
              {selectedNotif.type === "ORDER" && (
                <button
                  className={styles.actionBtn}
                  onClick={() => {
                    setIsModalOpen(false);
                    navigate("/order-history"); // Dẫn về trang đơn hàng
                  }}
                >
                  Xem đơn hàng
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NotificationPage;
