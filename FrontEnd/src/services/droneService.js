import axiosClient from "./axiosClient";

const droneService = {
  // 1. TẠO DRONE MỚI
  createDrone: async (droneData) => {
    try {
      // API: POST /drone/create
      // Body: { serial, model, maxRangeKm, batteryPct, avgSpeedKmh, status, restaurantId }
      return await axiosClient.post("/drone/create", droneData);
    } catch (error) {
      console.error("Lỗi tạo Drone:", error);
      throw error;
    }
  },

  // 2. LẤY DRONE KHẢ DỤNG (IDLE)
  getAvailableDrones: async () => {
    try {
      // API: GET /drone/available
      const response = await axiosClient.get("/drone/available");
      return response.data || [];
    } catch (error) {
      console.error("Lỗi lấy Drone khả dụng:", error);
      return [];
    }
  },

  // 3. TÌM DRONE ỨNG VIÊN (Cho đơn hàng cụ thể)
  getCandidateDrones: async (requiredRangeKm, restaurantId) => {
    try {
      // API: GET /drone/candidates?requiredRangeKm=...&restaurantId=...
      const response = await axiosClient.get("/drone/candidates", {
        params: { requiredRangeKm, restaurantId },
      });
      return response.data || [];
    } catch (error) {
      console.error("Lỗi tìm Drone ứng viên:", error);
      return [];
    }
  },

  // 4. CẬP NHẬT TRẠNG THÁI DRONE
  updateDroneStatus: async (droneId, status) => {
    try {
      // API: PUT /drone/{id}/status?status={status}
      return await axiosClient.put(`/drone/${droneId}/status`, null, {
        params: { status },
      });
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái Drone:", error);
      throw error;
    }
  },

  // 5. LẤY TẤT CẢ DRONE (Admin Dashboard)
  getAllDrones: async () => {
    try {
      // API: GET /drone/all
      const response = await axiosClient.get("/drone/all");
      return response.data || [];
    } catch (error) {
      console.error("Lỗi lấy danh sách Drone:", error);
      return [];
    }
  },
};

export default droneService;
