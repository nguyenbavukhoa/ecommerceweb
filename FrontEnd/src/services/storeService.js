import axiosClient from "./axiosClient";

const storeService = {
  // 1. LẤY TẤT CẢ DANH SÁCH NHÀ HÀNG
  getAll: async () => {
    try {
      // API: GET /restaurants
      // Response: { success: true, data: [ ... ] }
      const response = await axiosClient.get("/restaurants");
      return response.data || [];
    } catch (error) {
      console.error("Lỗi lấy danh sách cửa hàng:", error);
      return [];
    }
  },

  // 2. LẤY CHI TIẾT 1 CỬA HÀNG (Tạm thời lọc từ list vì chưa có API Detail riêng)
  getOne: async (id) => {
    try {
      const allStores = await storeService.getAll();
      return allStores.find((s) => s.id.toString() === id.toString());
    } catch (error) {
      return null;
    }
  },

  // 3. TẠO MỚI NHÀ HÀNG
  create: async (storeData) => {
    // API: POST /restaurants
    // Body mẫu: { name, code, lat, lng, phone, description, openTime, closeTime, active }
    return await axiosClient.post("/restaurants", storeData);
  },

  // 4. XÓA NHÀ HÀNG
  delete: async (id) => {
    // API: DELETE /restaurants/{id}
    return await axiosClient.delete(`/restaurants/${id}`);
  },

  // 5. CẬP NHẬT NHÀ HÀNG
  // API chưa document rõ, giữ nguyên logic PUT hoặc thông báo chưa hỗ trợ
  update: async (id, data) => {
    // Tạm thời dùng PUT /restaurants/{id} nếu backend hỗ trợ
    return await axiosClient.put(`/restaurants/${id}`, data);
  },
};

export default storeService;
