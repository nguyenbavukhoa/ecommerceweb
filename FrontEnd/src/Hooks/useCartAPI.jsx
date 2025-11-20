// src/hooks/useCartAPI.jsx
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8080/api/v1/cart-items";

export function useCartAPI() {
  const { auth } = useAuth();
  const token = auth?.accessToken;
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCartItems = useCallback(async () => {
    if (!token) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không thể lấy dữ liệu giỏ hàng");
      const result = await res.json();
      if (result.success) {
        setCartItems(result.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // --- HÀM MỚI ĐỂ THÊM SẢN PHẨM ---
  const addItemToCart = async (cartItemData) => {
    console.log("Gửi đến:", `${API_URL}/addCart`);
    console.log("Token:", token);
    console.log("cartItemData:", cartItemData);
    try {
      const res = await fetch(`${API_URL}/addCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartItemData),
      });

      console.log("Response status:", res.status);
      const text = await res.text();
      console.log("Response body:", text);
      if (!res.ok) {
        throw new Error("Thêm sản phẩm vào giỏ hàng thất bại");
      }

      // Sau khi thêm thành công, gọi lại API để làm mới giỏ hàng
      await fetchCartItems();
      return { success: true }; // 👈 Trả về trạng thái thành công
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      // Bạn có thể set state lỗi ở đây để hiển thị cho người dùng
      return { success: false, message: err.message }; // 👈 Trả về lỗi
    }
  };

  const toggleItemSelected = async (itemId, isSelected) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, selected: isSelected } : item
      )
    );
    try {
      const res = await fetch(
        `${API_URL}/select/${itemId}?selected=${isSelected}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Cập nhật lựa chọn thất bại");
      // await fetchCartItems(); // Tải lại để đảm bảo dữ liệu là mới nhất
      return { success: true };
    } catch (err) {
      setError(err.message);
      fetchCartItems();
      return { success: false, message: err.message };
    }
  };

  const updateItemQuantity = async (itemId, quantity) => {
    const originalItems = cartItems;
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
    try {
      const res = await fetch(
        `${API_URL}/${itemId}/quantity?quantity=${quantity}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Cập nhật số lượng thất bại");
      // await fetchCartItems(); // Tải lại để đảm bảo giá và dữ liệu là mới nhất
      return { success: true };
    } catch (err) {
      setError(err.message);
      setCartItems(originalItems); // Khôi phục lại nếu lỗi
      return { success: false, message: err.message };
    }
  };

  const removeItemFromCart = async (itemId) => {
    const originalItems = cartItems;
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    try {
      const res = await fetch(`${API_URL}/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xóa sản phẩm thất bại");
      // await fetchCartItems(); // Tải lại để đảm bảo dữ liệu là mới nhất
      return { success: true };
    } catch (err) {
      setError(err.message);
      setCartItems(originalItems); // Khôi phục lại nếu lỗi
      return { success: false, message: err.message };
    }
  };

  return {
    cartItems,
    loading,
    error,
    toggleItemSelected,
    updateItemQuantity,
    removeItemFromCart,
    fetchCartItems,
    addItemToCart,
  };
}
