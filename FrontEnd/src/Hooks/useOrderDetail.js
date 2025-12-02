import { useState, useEffect } from "react";
import { db } from "../data/mockData"; // Import db

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
        await new Promise((r) => setTimeout(r, 300));

        // Lấy tất cả đơn hàng từ DB và tìm
        const allOrders = db.orders.getAll();
        const found = allOrders.find((o) => o.id == orderId);

        if (found) {
          setOrder(found);
        } else {
          throw new Error("Không tìm thấy đơn hàng");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getOrderDetail();
  }, [orderId]);

  return { order, loading, error };
};
