// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "../services/dbService";
import { useAuth } from "./AuthContext"; // [QUAN TRỌNG] Lấy user hiện tại

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth(); // Lấy user đang đăng nhập
  const queryClient = useQueryClient();
  const [lastOrderStates, setLastOrderStates] = useState({});

  // 1. Lấy danh sách thông báo TỪ SERVER (Chỉ của User này)
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      if (!isLoggedIn || !user) return [];
      return await db.notifications.getByUser(user.id);
    },
    enabled: !!isLoggedIn && !!user, // Chỉ chạy khi đã login
    refetchInterval: 5000, // Tự động cập nhật mỗi 5s
  });

  // 2. Mutation: Thêm thông báo mới vào DB
  const createNotifMutation = useMutation({
    mutationFn: async (newNotif) => await db.notifications.create(newNotif),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications", user?.id]);
    },
  });

  // 3. Mutation: Đánh dấu đã đọc
  const markReadMutation = useMutation({
    mutationFn: async (id) => await db.notifications.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications", user?.id]);
    },
  });

  // 4. Mutation: Đánh dấu tất cả đã đọc
  const markAllReadMutation = useMutation({
    mutationFn: async () => await db.notifications.markAllRead(user.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications", user?.id]);
    },
  });

  // --- HÀM PUBLIC ĐỂ GỌI TỪ NƠI KHÁC ---

  // Hàm này dùng để bắn thông báo (Ví dụ: Lúc thanh toán thành công)
  const addNotification = (title, message, type = "info") => {
    if (!user) return;
    createNotifMutation.mutate({
      userId: user.id, // [QUAN TRỌNG] Gắn user ID vào thông báo
      title,
      message,
      type,
    });
  };

  const markAsRead = (id) => markReadMutation.mutate(id);
  const markAllAsRead = () => markAllReadMutation.mutate();

  // --- LOGIC TỰ ĐỘNG CHECK ĐƠN HÀNG (SIMULATION) ---

  // Lấy toàn bộ đơn hàng để theo dõi (Polling)
  const { data: orders } = useQuery({
    queryKey: ["ordersTracking", user?.id],
    queryFn: async () => await db.orders.getAll(),
    refetchInterval: 5000, // Check mỗi 5 giây
    enabled: !!isLoggedIn,
  });

  useEffect(() => {
    if (!orders || !user) return;

    // Chỉ lọc ra các đơn hàng CỦA USER NÀY
    const myOrders = orders.filter((o) => o.userId === user.id);

    // Tạo map trạng thái mới
    const currentStates = {};

    myOrders.forEach((order) => {
      currentStates[order.id] = order.orderStatus;

      // Kiểm tra sự thay đổi trạng thái
      const oldStatus = lastOrderStates[order.id];

      // Nếu có trạng thái cũ và nó khác trạng thái mới -> Bắn thông báo
      if (oldStatus && oldStatus !== order.orderStatus) {
        let title = `Cập nhật đơn hàng #${order.id}`;
        let msg = "";
        let type = "info";

        switch (order.orderStatus) {
          case "CONFIRMED":
            msg = "Đơn hàng đã được xác nhận. Nhà hàng đang chuẩn bị món.";
            break;
          case "PICKING":
            msg = "Drone đang đến lấy hàng tại quán.";
            break;
          case "SHIPPING":
            msg = "Drone đang bay giao hàng đến bạn 🚁.";
            type = "info";
            break;
          case "COMPLETED":
            msg = "Đã giao hàng thành công! Chúc bạn ngon miệng.";
            type = "success";
            break;
          case "CANCELLED":
            msg = "Đơn hàng đã bị hủy.";
            type = "warning";
            break;
          default:
            break;
        }

        if (msg) {
          // Gọi hàm tạo thông báo lưu vào DB
          createNotifMutation.mutate({
            userId: user.id,
            title: title,
            message: msg,
            type: type,
          });
        }
      }
    });

    // Cập nhật lại state để so sánh cho lần sau
    // (Chỉ cập nhật nếu có sự thay đổi để tránh render loop, ở đây mình set luôn cho đơn giản)
    if (Object.keys(lastOrderStates).length === 0 && myOrders.length > 0) {
      // Lần đầu load trang: chỉ lưu state, không báo (để tránh spam thông báo cũ)
      const initStates = {};
      myOrders.forEach((o) => (initStates[o.id] = o.orderStatus));
      setLastOrderStates(initStates);
    } else {
      setLastOrderStates(currentStates);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]); // Chạy lại khi danh sách orders thay đổi (do polling)

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
