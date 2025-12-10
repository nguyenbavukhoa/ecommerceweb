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
      const {
        storeId,
        category,
        name,
        page,
        size,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
      } = params;

      const pageSize = size || 12;
      const currentPage = page || 1;

      // Chuẩn bị tham số cho API
      const apiParams = {
        page: currentPage,
        size: pageSize,
      };

      // 1. Xử lý Store ID
      let targetStoreId = storeId;
      // Kiểm tra nếu không có storeId hoặc là chuỗi "null" thì lấy từ LocalStorage
      if (!targetStoreId || targetStoreId === "null") {
        targetStoreId = localStorage.getItem("currentStoreId");
      }

      // [FIX] Ép kiểu sang Number để đảm bảo gửi đi là 2 chứ không phải "2"
      if (targetStoreId && targetStoreId !== "null") {
        apiParams.restaurantId = Number(targetStoreId);
      }

      // 2. Map Category
      if (category && category !== "all") {
        apiParams.categoryId = category;
      }

      // 3. Map Search & Filters
      if (name) apiParams.name = name;
      if (minPrice) apiParams.minPrice = minPrice;
      if (maxPrice) apiParams.maxPrice = maxPrice;

      // 4. Map Sorting
      if (sortBy) apiParams.sortBy = sortBy;
      if (sortOrder) apiParams.sortOrder = sortOrder;

      // Endpoint chung
      const endpoint = "/products";

      console.log("📡 [ProductService] Fetching:", endpoint, apiParams);

      const response = await axiosClient.get(endpoint, { params: apiParams });

      // Xử lý response
      const data = response.data || response;
      const content = data.content || (Array.isArray(data) ? data : []);

      let products = content.map(mapProductData).filter((i) => i !== null);

      return {
        content: products,
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0,
      };
    } catch (error) {
      console.warn("❌ API GetAll Error:", error);
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
