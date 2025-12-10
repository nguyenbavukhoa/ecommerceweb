// src/hooks/useProductDetail.jsx
import { useState, useEffect } from "react";
import { db } from "../services/dbService"; // [MỚI] Import từ Service

export default function useProductDetail(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        // [MỚI] Gọi API chi tiết sản phẩm (Async/Await)
        const found = await db.products.getOne(productId);

        if (found) {
          setProduct(found);
        } else {
          throw new Error("Không tìm thấy sản phẩm");
        }
      } catch (err) {
        console.error("Lỗi lấy chi tiết sản phẩm:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
}
