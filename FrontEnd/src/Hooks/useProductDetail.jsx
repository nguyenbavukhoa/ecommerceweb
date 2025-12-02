import { useQuery } from "@tanstack/react-query";
import productService from "../services/productService";

export const useProductDetail = (productId) => {
  return useQuery({
    queryKey: ["productDetail", productId],
    queryFn: async () => {
      if (!productId) return null;
      return await productService.getDetail(productId);
    },
    enabled: !!productId, // Chỉ chạy khi có productId
    retry: 1, // Thử lại 1 lần nếu lỗi
  });
};

export default useProductDetail;
