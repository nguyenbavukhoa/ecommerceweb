// src/hooks/useOrderDetail.js
import { useState, useEffect } from "react";
import { db } from "../services/dbService"; // [MỚI] Import dbService

export const useOrderDetail = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const getOrderDetail = async () => {
      try {
        setLoading(true);
        // Không cần setTimeout giả lập nữa

        // Cách 1: Nếu JSON Server hỗ trợ /orders/:id (thường là có)
        // const found = await db.orders.getOne(orderId); // Cần thêm hàm getOne vào dbService nếu chưa có

        // Cách 2: (An toàn với dbService hiện tại) Lấy all về rồi find
        const allOrders = await db.orders.getAll();
        const found = allOrders.find((o) => o.id == orderId);

        if (found) {
          setOrder(found);
        } else {
          throw new Error("Không tìm thấy đơn hàng");
        }
      } catch (err) {
        console.error("Lỗi lấy chi tiết đơn hàng:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getOrderDetail();
  }, [orderId]);

  return { order, loading, error };
};
