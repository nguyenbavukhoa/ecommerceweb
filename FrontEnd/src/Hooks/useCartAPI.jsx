// src/hooks/useCartAPI.jsx
import { useState, useEffect, useMemo } from "react";
import { MOCK_CART_ITEMS } from "../data/mockData";

// Nhận thêm currentStoreId
export function useCartAPI(userId, currentStoreId) {
  const storageKey = userId ? `cart_${userId}` : "cart_guest";

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCartItems(JSON.parse(saved));
      } else {
        setCartItems(userId ? [] : MOCK_CART_ITEMS || []);
      }
    }
  }, [storageKey, userId]);

  // Save cart
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
    }
  }, [cartItems, storageKey]);

  // --- [QUAN TRỌNG] Lọc sản phẩm theo Store ID ---
  // Chỉ hiển thị những món thuộc cửa hàng đang chọn
  const visibleCartItems = useMemo(() => {
    if (!currentStoreId) return cartItems;
    // Giả sử item trong giỏ có trường storeId (cần thêm lúc Add)
    // Hoặc nếu mock cũ chưa có, ta tạm chấp nhận hiển thị hết (fallback)
    return cartItems.filter(
      (item) => !item.storeId || item.storeId === currentStoreId
    );
  }, [cartItems, currentStoreId]);

  const addItemToCart = async (newItem) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 200));

    setCartItems((prev) => {
      const cartItemData = {
        ...newItem,
        selected: true,
        id: Date.now(),
        // Lưu ý: newItem phải có storeId truyền từ ProductDetail
      };
      return [...prev, cartItemData];
    });

    setLoading(false);
    return { success: true };
  };

  const toggleItemSelected = async (itemId, isSelected) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, selected: isSelected } : item
      )
    );
    return { success: true };
  };

  const updateItemQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
    return { success: true };
  };

  const removeItemFromCart = async (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    return { success: true };
  };

  const clearSelectedItems = () => {
    // Chỉ xóa những item đang hiển thị (thuộc store này) và được chọn
    setCartItems((prev) =>
      prev.filter((item) => {
        const isBelongToStore =
          !item.storeId || item.storeId === currentStoreId;
        return !(isBelongToStore && item.selected);
      })
    );
  };

  return {
    // Trả về danh sách đã lọc theo store
    cartItems: visibleCartItems,
    // Hàm gốc để thao tác toàn bộ (nếu cần)
    allCartItems: cartItems,
    loading,
    error,
    toggleItemSelected,
    updateItemQuantity,
    removeItemFromCart,
    addItemToCart,
    clearSelectedItems,
  };
}
