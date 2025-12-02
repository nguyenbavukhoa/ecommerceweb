import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import cartService from "../services/cartService";
import { useToast } from "./ToastContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { auth } = useAuth();

  // Kiểm tra biến đăng nhập
  const isLoggedIn = !!auth || !!localStorage.getItem("accessToken");

  const { showToast } = useToast();

  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Refresh Cart
  const refreshCart = async () => {
    setLoading(true);
    try {
      console.log("🔄 [CartProvider] refreshCart START...");
      console.log("🔑 [CartProvider] Auth Status:", isLoggedIn);

      const items = await cartService.getCart(isLoggedIn);

      console.log("📦 [CartProvider] Received items form Service:", items);

      setCartItems(items || []);
    } catch (error) {
      console.error("❌ [CartProvider] refreshCart Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load khi trạng thái đăng nhập thay đổi
  useEffect(() => {
    console.log(
      "🔄 [CartProvider] isLoggedIn changed -> triggering refreshCart"
    );
    refreshCart();
  }, [isLoggedIn]);

  // Các hàm chức năng (Giữ nguyên)
  const addItemToCart = async (item) => {
    try {
      await cartService.addToCart(isLoggedIn, item);
      await refreshCart();
      setIsOpen(true);
      showToast({
        title: "Thành công",
        message: "Đã thêm món!",
        type: "success",
      });
      return { success: true };
    } catch (error) {
      console.error(error);
      showToast({
        title: "Lỗi",
        message: "Không thể thêm món.",
        type: "error",
      });
      return { success: false };
    }
  };

  const deleteCartItem = async (itemId) => {
    try {
      setCartItems((prev) => prev.filter((i) => i.id !== itemId));
      await cartService.removeItem(isLoggedIn, itemId);
      await refreshCart();
    } catch (error) {
      refreshCart();
    }
  };

  const updateItemQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      setCartItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
      );
      await cartService.updateQuantity(isLoggedIn, itemId, quantity);
    } catch (error) {
      refreshCart();
    }
  };

  const toggleItemSelected = async (itemId, isSelected) => {
    try {
      setCartItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, selected: isSelected } : i))
      );
      await cartService.toggleSelection(isLoggedIn, itemId, isSelected);
    } catch (error) {
      refreshCart();
    }
  };

  const increasingNumber = (id, qty) => updateItemQuantity(id, qty + 1);
  const decreasingNumber = (id, qty) => {
    if (qty > 1) updateItemQuantity(id, qty - 1);
    else deleteCartItem(id);
  };

  const getCartTotal = () =>
    cartItems
      .filter((i) => i.selected)
      .reduce((t, i) => t + i.price * i.quantity, 0);
  const getAmountCart = () => cartItems.reduce((t, i) => t + i.quantity, 0);
  const vnd = (p) =>
    Number(p).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const hasSelectedItems = cartItems.some((i) => i.selected);
  const clearSelectedItems = async () => {};

  return (
    <CartContext.Provider
      value={{
        isOpen,
        openCart,
        closeCart,
        cartItems,
        loading,
        addItemToCart,
        deleteCartItem,
        increasingNumber,
        decreasingNumber,
        updateItemQuantity,
        toggleItemSelected,
        clearSelectedItems,
        getCartTotal,
        getAmountCart,
        hasSelectedItems,
        vnd,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
