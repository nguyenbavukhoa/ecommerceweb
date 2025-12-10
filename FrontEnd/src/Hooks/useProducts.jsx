// import { useQuery } from "@tanstack/react-query";
// import { useFilters } from "../context/FilterProvider";
// import productService from "../services/productService";

// // [SỬA] Cho phép nhận tham số customParams để override filter mặc định
// export const useProducts = (customParams = {}) => {
//   const { filters } = useFilters();

//   // Gộp filter toàn cục với tham số truyền vào (ưu tiên tham số truyền vào)
//   const queryParams = { ...filters, ...customParams };

//   return useQuery({
//     // Key bao gồm storeId để khi store thay đổi, query tự fetch lại
//     queryKey: [
//       "products",
//       queryParams.storeId, // [QUAN TRỌNG] Key theo storeId thực tế
//       queryParams.category,
//       queryParams.name,
//       queryParams.page,
//     ],

//     queryFn: async () => {
//       const data = await productService.getAll({
//         storeId: queryParams.storeId, // Truyền ID chính xác vào service
//         category: queryParams.category,
//         name: queryParams.name,
//         page: queryParams.page,
//         size: 12,
//       });
//       return data;
//     },
//     staleTime: 1 * 60 * 1000, // Cache 1 phút
//     keepPreviousData: true,
//   });
// };
import { useQuery } from "@tanstack/react-query";
import { useFilters } from "../context/FilterProvider";
import productService from "../services/productService";

export const useProducts = (customParams = {}) => {
  const { filters } = useFilters();

  // Gộp filter toàn cục với tham số truyền vào
  const queryParams = { ...filters, ...customParams };

  return useQuery({
    // [QUAN TRỌNG] Thêm các key minPrice, maxPrice, sortBy, sortOrder vào đây
    queryKey: [
      "products",
      queryParams.storeId,
      queryParams.category,
      queryParams.name,
      queryParams.page,
      queryParams.minPrice,
      queryParams.maxPrice,
      queryParams.sortBy,
      queryParams.sortOrder,
    ],

    queryFn: async () => {
      // Truyền toàn bộ object queryParams vào service
      // Service đã được update để destruct các field này
      const data = await productService.getAll(queryParams);
      return data;
    },
    staleTime: 1 * 60 * 1000, // Cache 1 phút
    keepPreviousData: true, // Giữ dữ liệu cũ khi đang fetch trang mới
  });
};
