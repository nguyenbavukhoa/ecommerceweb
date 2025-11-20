// src/hooks/useProductDetail.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8080/api/v1";

export default function useProductDetail(productId) {
  const { auth } = useAuth();
  const token = auth?.accessToken;

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
        const response = await fetch(
          `${API_URL}/products/detail/${productId}`,
          {
            headers: {
              // Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Lỗi mạng hoặc không tìm thấy sản phẩm");
        }

        const result = await response.json();
        if (result.success) {
          setProduct(result.data);
        } else {
          throw new Error(result.message || "Lấy chi tiết sản phẩm thất bại");
        }
      } catch (err) {
        setError(err.message);
        console.error("Lỗi khi fetch sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, token]);

  return { product, loading, error };
}
