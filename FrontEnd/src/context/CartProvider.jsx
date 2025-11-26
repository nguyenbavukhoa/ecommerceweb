// src/context/CartProvider.jsx
import { useState, createContext, useContext } from "react";
import { useCartAPI } from "../hooks/useCartAPI";
import { useAuth } from "./AuthContext";
// 1. Import useFilters
import { useFilters } from "./FilterProvider";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { auth } = useAuth();

  // 2. Lấy storeId hiện tại
  const { filters } = useFilters();
  const currentStoreId = filters.storeId;

  // 3. Truyền currentStoreId vào hook
  const {
    cartItems, // Đây là list đã được lọc theo store
    loading,
    error,
    toggleItemSelected,
    updateItemQuantity,
    removeItemFromCart,
    addItemToCart,
    clearSelectedItems,
  } = useCartAPI(auth?.id, currentStoreId);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const vnd = (price) =>
    Number(price).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

  const getCartTotal = () => {
    return (
      cartItems
        ?.filter((item) => item.selected)
        ?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0
    );
  };

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
      removeItemFromCart(id);
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
