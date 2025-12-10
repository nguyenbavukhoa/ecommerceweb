// src/services/notificationService.js

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Đơn hàng #DH-1029 đã được giao",
    message: "Tài xế đã giao hàng thành công. Chúc bạn ngon miệng!",
    type: "ORDER",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 phút trước
    image: "https://cdn-icons-png.flaticon.com/512/10695/10695669.png",
  },
  {
    id: 2,
    title: "Đơn hàng #DH-1030 đang được chuẩn bị",
    message: "Nhà hàng KHK Food Q1 đã xác nhận đơn hàng của bạn.",
    type: "ORDER",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 phút trước
    image: "https://cdn-icons-png.flaticon.com/512/7541/7541900.png",
  },
  {
    id: 3,
    title: "Cảnh báo đăng nhập",
    message:
      "Phát hiện đăng nhập mới trên thiết bị lạ. Vui lòng kiểm tra ngay.",
    type: "SYSTEM",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 ngày trước
    image: "https://cdn-icons-png.flaticon.com/512/3524/3524659.png",
  },
  {
    id: 4,
    title: "Đổi mật khẩu thành công",
    message: "Mật khẩu tài khoản của bạn đã được cập nhật.",
    type: "SYSTEM",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 ngày trước
    image: "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
  },
];

const notificationService = {
  // 1. Lấy danh sách (Mới nhất lên đầu)
  getNotifications: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sorted = [...MOCK_NOTIFICATIONS].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        resolve(sorted);
      }, 500);
    });
  },

  // 2. Đếm số chưa đọc
  getUnreadCount: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const count = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;
        resolve(count);
      }, 300);
    });
  },

  // 3. Đánh dấu đã đọc
  markAsRead: async (id) => {
    console.log(`📡 [API Mock] PUT /notifications/${id}/read`);
    return true;
  },

  // 4. Đọc tất cả
  markAllAsRead: async () => {
    console.log("📡 [API Mock] PUT /notifications/read-all");
    return true;
  },
};

export default notificationService;
