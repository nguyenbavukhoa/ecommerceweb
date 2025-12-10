import axiosClient from "./axiosClient";

const categoryService = {
  // Lấy tất cả danh mục
  getAll: async () => {
    try {
      // [CẬP NHẬT] Endpoint mới: /categories/all
      const response = await axiosClient.get("/categories/all");

      // Xử lý data trả về (tùy backend trả về mảng trực tiếp hay bọc trong data)
      const data = response.data || response;

      // Trả về mảng danh mục
      if (Array.isArray(data)) return data;
      if (data.content) return data.content;

      return [];
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
      return [];
    }
  },
};

export default categoryService;
