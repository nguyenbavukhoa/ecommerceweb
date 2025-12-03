import axiosClient from "./axiosClient";

// Helper map data (Giữ nguyên)
const mapProductData = (item) => {
  if (!item) return null;
  return {
    ...item,
    id: item.id,
    name: item.name,
    imgMain: item.imgMain || item.imgUrl || "https://via.placeholder.com/150",
    priceBase:
      item.priceBase !== undefined ? item.priceBase : item.basePrice || 0,
    description: item.description || "",
    optionGroups: Array.isArray(item.optionGroups) ? item.optionGroups : [],
    categoryId: item.categoryId,
    storeId: item.storeId,
  };
};

const productService = {
  // 1. LẤY DANH SÁCH (Giữ nguyên)
  getAll: async (params = {}) => {
    try {
      const { storeId, category, name, page, size } = params;
      const pageSize = size || 12;
      const currentPage = page || 1;

      let apiData = { content: [], totalPages: 0, totalElements: 0 };

      // Gọi API
      let endpoint = "/products";
      const apiParams = { page: currentPage, size: pageSize };

      if (storeId) {
        // Nếu backend hỗ trợ lấy theo store
        endpoint = `/products/restaurant/${storeId}`;
      } else {
        if (name) apiParams.name = name;
      }

      const response = await axiosClient.get(endpoint, { params: apiParams });

      // Xử lý response linh hoạt (trực tiếp data hoặc bọc trong data)
      const data = response.data || response;
      const content = data.content || [];

      let products = content.map(mapProductData).filter((i) => i !== null);

      // Filter bổ trợ phía Client
      if (category && category !== "all") {
        products = products.filter((p) => p.categoryId == category);
      }
      // Nếu API chung /products trả về hết, cần lọc storeId
      if (!storeId && name) {
        // Logic tìm kiếm chung
      } else if (storeId && endpoint === "/products") {
        // Nếu gọi endpoint chung mà muốn lọc store
        products = products.filter((p) => p.storeId == storeId);
      }

      return {
        content: products,
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0,
      };
    } catch (error) {
      console.warn("API GetAll Error:", error);
      return { content: [], totalPages: 0, totalElements: 0 };
    }
  },

  // 2. LẤY CHI TIẾT (Giữ nguyên)
  getDetail: async (id) => {
    try {
      const response = await axiosClient.get(`/products/detail/${id}`);
      const productData = response.data || response;
      return mapProductData(productData);
    } catch (error) {
      throw error;
    }
  },

  // 3. TẠO MỚI (FIX LỖI 500)
  create: async (formData) => {
    // [QUAN TRỌNG] Ghi đè header để Server biết đây là upload file
    return await axiosClient.post("/products/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 4. CẬP NHẬT (FIX LỖI 500 & METHOD)
  update: async (id, formData) => {
    // Dùng POST thay vì PUT để tránh lỗi server Java không parse được file
    return await axiosClient.post(`/products/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default productService;
