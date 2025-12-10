// src/hooks/useProducts.jsx
import { useQuery } from "@tanstack/react-query";
import { db } from "../services/dbService"; // [MỚI] Import từ Service

export function useProducts(filters) {
  return useQuery({
    // Thêm filters.storeId vào queryKey để khi đổi store (nếu có) nó tự fetch lại
    queryKey: ["products", filters],
    queryFn: async () => {
      // Không cần setTimeout giả lập nữa vì gọi API có độ trễ thật

      // [MỚI] Gọi API lấy tất cả sản phẩm về
      let result = await db.products.getAll();

      // --- LOGIC LỌC TẠI CLIENT (Giữ nguyên logic cũ của bạn) ---

      // 1. Lọc theo Store ID
      if (filters.storeId) {
        result = result.filter((p) => p.storeId === filters.storeId);
      }

      // 2. Lọc theo tên
      if (filters.name) {
        const lowerName = filters.name.toLowerCase();
        result = result.filter((p) => p.name.toLowerCase().includes(lowerName));
      }

      // 3. Lọc theo danh mục
      if (filters.category && filters.category !== "all") {
        const isId = !isNaN(filters.category);
        if (isId) {
          result = result.filter(
            (p) => p.categoryId === parseInt(filters.category)
          );
        }
      }

      // 4. Lọc giá
      if (filters.minPrice)
        result = result.filter((p) => p.priceBase >= Number(filters.minPrice));
      if (filters.maxPrice)
        result = result.filter((p) => p.priceBase <= Number(filters.maxPrice));

      // 5. Phân trang
      const pageSize = 8;
      const totalElements = result.length;
      const totalPages = Math.ceil(totalElements / pageSize);
      const currentPage = filters.page || 1;
      const startIndex = (currentPage - 1) * pageSize;

      // Sắp xếp
      const sortedResult = result.sort((a, b) => b.id - a.id);
      const paginatedData = sortedResult.slice(
        startIndex,
        startIndex + pageSize
      );

      return {
        products: paginatedData,
        totalPages: totalPages,
        totalElements: totalElements,
      };
    },
    staleTime: 0,
  });
}

export function formatPrice(price) {
  if (price == null) return "0₫";
  return Number(price).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}
