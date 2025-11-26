import { useState, useEffect } from "react";
import { db } from "../data/mockData"; // Import db

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
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Dùng db.products.getOne
        const found = db.products.getOne(productId);

        if (found) {
          setProduct(found);
        } else {
          throw new Error("Không tìm thấy sản phẩm");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
}
