import { db } from "../data/mockData";

const categoryService = {
  getAll: async () => {
    // Hiện tại chưa thấy API Category trong Doc, nên dùng Mock
    // Giả lập delay mạng
    await new Promise((r) => setTimeout(r, 300));

    if (db && db.categories && typeof db.categories.getAll === "function") {
      return db.categories.getAll();
    }
    // Fallback cứng nếu mockData lỗi
    return [
      { id: 1, name: "Món Burger" },
      { id: 2, name: "Món Lẩu" },
      { id: 3, name: "Đồ uống" },
    ];
  },
};

export default categoryService;
