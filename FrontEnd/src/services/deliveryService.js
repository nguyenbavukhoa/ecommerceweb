import axiosClient from "./axiosClient";

const deliveryService = {
  // 1. TẠO CHUYẾN GIAO HÀNG
  createDelivery: async (orderId, droneId) => {
    try {
      // API: POST /delivery/create?orderId=...&droneId=...
      const response = await axiosClient.post("/delivery/create", null, {
        params: { orderId, droneId },
      });
      return response.data; // Trả về object Delivery (có id để tracking)
    } catch (error) {
      console.error("Lỗi tạo Delivery:", error);
      throw error;
    }
  },

  // 2. THEO DÕI VỊ TRÍ DRONE (TRACKING)
  getDeliveryTracking: async (deliveryId) => {
    try {
      // API: GET /drone/tracking/{deliveryId}
      const response = await axiosClient.get(`/drone/tracking/${deliveryId}`);
      return response.data; // Trả về { currentLat, currentLng, status, ... }
    } catch (error) {
      // Không log lỗi liên tục tránh spam console khi polling
      return null;
    }
  },
};

export default deliveryService;
