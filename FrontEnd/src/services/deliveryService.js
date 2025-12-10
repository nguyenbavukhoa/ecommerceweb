import axiosClient from "./axiosClient";

const deliveryService = {
  // 1. TẠO CHUYẾN GIAO HÀNG
  createDelivery: async (orderId, droneId) => {
    try {
      const response = await axiosClient.post("/delivery/create", null, {
        params: { orderId, droneId },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi tạo Delivery:", error);
      throw error;
    }
  },

  // 2. [MỚI] LẤY THÔNG TIN DELIVERY THEO ORDER ID (Thay thế logic cũ)
  // API: GET /delivery/order?orderId=...
  getDeliveryByOrderId: async (orderId) => {
    try {
      const response = await axiosClient.get("/delivery/order", {
        params: { orderId },
      });
      // API trả về: { success: true, data: { ... } }
      // Nếu thành công trả về data, nếu lỗi trả về null
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      // 404 hoặc 500 sẽ rơi vào đây -> Trả null để UI biết chưa có delivery
      return null;
    }
  },

  // Giữ lại hàm này nếu bên DroneMap tổng quan vẫn dùng,
  // nhưng logic chi tiết sẽ dùng hàm trên.
  getDeliveryTracking: async (deliveryId) => {
    try {
      const response = await axiosClient.get(`/drone/tracking/${deliveryId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },
};

export default deliveryService;
