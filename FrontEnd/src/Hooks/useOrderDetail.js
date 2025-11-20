import { useState, useEffect } from "react";
import { ALL_ORDERS } from "../data/mockData.js";

// --- API MOCK: Giả lập việc gọi API để lấy chi tiết đơn hàng ---
const fetchOrderById = async (orderId) => {
  console.log(`Đang "gọi API" để lấy đơn hàng với ID: ${orderId}`);

  // Giả lập độ trễ mạng
  await new Promise((resolve) => setTimeout(resolve, 500));

  const foundOrder = ALL_ORDERS.find((order) => order.id === orderId);

  if (foundOrder) {
    return foundOrder;
  } else {
    throw new Error("Không tìm thấy đơn hàng");
  }
};

// --- CUSTOM HOOK ---
export const useOrderDetail = (orderId) => {
  // State để lưu trữ dữ liệu, trạng thái loading và lỗi
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Nếu không có orderId, không làm gì cả
    if (!orderId) {
      setLoading(false);
      return;
    }

    const getOrderDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const orderData = await fetchOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
        setError(err.message);
        console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    getOrderDetail();
  }, [orderId]); // Hook sẽ chạy lại mỗi khi orderId thay đổi

  // Trả về các state để component có thể sử dụng
  return { order, loading, error };
};
