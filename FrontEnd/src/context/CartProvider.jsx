// src/context/CartProvider.jsx
import { useState, createContext, useContext } from "react";
import { useCartAPI } from "../hooks/useCartAPI";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    cartItems,
    loading,
    error,
    toggleItemSelected,
    updateItemQuantity,
    removeItemFromCart,
    addItemToCart,
  } = useCartAPI();

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

  // TÍNH TOÁN VÀ CUNG CẤP `hasSelectedItems` TẠI ĐÂY
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
        hasSelectedItems, // 👈 Thêm vào context
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
