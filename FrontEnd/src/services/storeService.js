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

  // 2. LẤY CHI TIẾT 1 CỬA HÀNG (Hiện tại lọc từ list, chờ API Detail)
  getOne: async (id) => {
    try {
      // Nếu Backend có API: GET /restaurants/{id} thì gọi ở đây
      // Tạm thời dùng getAll() rồi find()
      const allStores = await storeService.getAll();
      return allStores.find((s) => s.id.toString() === id.toString());
    } catch (error) {
      return null;
    }
  },

  // 3. TẠO MỚI NHÀ HÀNG
  create: async (storeData) => {
    // API: POST /restaurants
    // Body: { name, code, address, phone, description, openTime, closeTime, active: true }
    return await axiosClient.post("/restaurants", storeData);
  },

  // 4. XÓA NHÀ HÀNG
  delete: async (id) => {
    // API: DELETE /restaurants/{id}
    return await axiosClient.delete(`/restaurants/${id}`);
  },

  // 5. CẬP NHẬT NHÀ HÀNG (Dành cho chức năng duyệt/khóa/sửa)
  update: async (id, data) => {
    // API chưa document rõ method update, thường là PUT /restaurants/{id}
    // Nếu chưa có, ta dùng tạm logic update status nếu backend hỗ trợ
    // Ví dụ: PUT /restaurants/{id}
    return await axiosClient.put(`/restaurants/${id}`, data);
  },
};

export default storeService;
