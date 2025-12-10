// src/context/CartProvider.jsx
import { useState, createContext, useContext } from "react";
import { useCartAPI } from "../hooks/useCartAPI";
import { useAuth } from "./AuthContext";
import { useFilters } from "./FilterProvider";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Lấy thông tin User để tạo key localStorage riêng (tránh trùng cart với guest)
  const { auth } = useAuth();

  // Lấy storeId để lọc giỏ hàng (chỉ hiện món của quán đang đứng)
  const { filters } = useFilters();
  const currentStoreId = filters.storeId || "RES-01";

  // Gọi Hook quản lý logic
  const {
    cartItems,
    loading,
    error,
    toggleItemSelected,
    updateItemQuantity,
    removeItemFromCart,
    addItemToCart,
    clearSelectedItems,
  } = useCartAPI(auth?.id, currentStoreId);

  // --- UI HANDLERS ---
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // Helper format tiền tệ
  const vnd = (price) =>
    Number(price).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

  // Tính tổng tiền (chỉ tính những món được tick chọn)
  const getCartTotal = () => {
    return (
      cartItems
        ?.filter((item) => item.selected)
        ?.reduce(
          (sum, item) =>
            sum + (item.price || item.priceBase || 0) * item.quantity,
          0
        ) || 0
    );
  };

  // Tính tổng số lượng item (cho badge trên icon giỏ hàng)
  const getAmountCart = () => {
    return cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  };

  const increasingNumber = (id, currentQuantity) => {
    updateItemQuantity(id, currentQuantity + 1);
  };

  const decreasingNumber = (id, currentQuantity) => {
    if (currentQuantity > 1) {
      updateItemQuantity(id, currentQuantity - 1);
    } else {
      removeItemFromCart(id); // Giảm về 0 thì xóa luôn
    }
  };

  const hasSelectedItems = cartItems?.some((item) => item.selected);

  return (
    <CartContext.Provider
      value={{
        isOpen,
        openCart,
        closeCart,
        cartItems,
        addItemToCart,
        loading,
        error,
        vnd,
        getCartTotal,
        getAmountCart,
        toggleItemSelected,
        deleteCartItem: removeItemFromCart,
        increasingNumber,
        decreasingNumber,
        hasSelectedItems,
        clearSelectedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
