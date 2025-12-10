// src/hooks/useCartAPI.jsx
import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "../services/dbService";

export function useCartAPI(userId, currentStoreId) {
  const queryClient = useQueryClient();

  // --- STATE CHO GUEST ---
  const [localCart, setLocalCart] = useState([]);
  const isGuest = !userId;
  const storageKey = "cart_guest";

  useEffect(() => {
    if (isGuest && typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setLocalCart(JSON.parse(saved));
        } catch (e) {
          setLocalCart([]);
        }
      }
    }
  }, [isGuest]);

  const setCartItemsLocal = (items) => {
    setLocalCart(items);
    localStorage.setItem(storageKey, JSON.stringify(items));
  };

  // --- LOGIC CHO USER (SERVER) ---
  const { data: serverCartData, isLoading: isLoadingServer } = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      if (!userId) return null;
      return await db.cart.getUserCart(userId);
    },
    enabled: !!userId,
    refetchInterval: 2000,
  });

  // Merge Cart Items
  const cartItems = useMemo(() => {
    if (isGuest) return localCart;
    return serverCartData?.items || [];
  }, [isGuest, localCart, serverCartData]);

  const visibleCartItems = useMemo(() => {
    if (!currentStoreId) return cartItems;
    return cartItems.filter(
      (item) => !item.storeId || item.storeId === currentStoreId
    );
  }, [cartItems, currentStoreId]);

  // --- HELPER: Hàm tính toán giỏ hàng mới (Dùng chung) ---
  const calculateNewCart = (currentItems, newItem, storeId) => {
    let newCart = [...currentItems];
    const existingIndex = newCart.findIndex(
      (item) => item.id === newItem.id && item.storeId === storeId
    );

    if (existingIndex > -1) {
      // Cộng dồn
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        quantity: newCart[existingIndex].quantity + (newItem.quantity || 1),
      };
    } else {
      // Thêm mới
      newCart.push({
        ...newItem,
        selected: true,
        storeId: storeId || "RES-01",
        addedAt: Date.now(),
      });
    }
    return newCart;
  };

  // --- MUTATION: ADD TO CART (Sửa lại để an toàn hơn) ---
  const addToCartMutation = useMutation({
    mutationFn: async (newItem) => {
      // 1. Nếu là GUEST: Xử lý LocalStorage
      if (isGuest) {
        const newCart = calculateNewCart(localCart, newItem, currentStoreId);
        setCartItemsLocal(newCart);
        return;
      }

      // 2. Nếu là USER: Fetch dữ liệu mới nhất từ Server để tránh race condition
      const latestCart = await db.cart.getUserCart(userId);
      const currentItems = latestCart ? latestCart.items : [];

      // Tính toán dựa trên dữ liệu server vừa lấy về
      const newItems = calculateNewCart(currentItems, newItem, currentStoreId);

      if (latestCart) {
        await db.cart.updateCartItems(latestCart.id, newItems);
      } else {
        await db.cart.createCart(userId, newItems);
      }
    },
    onSuccess: () => {
      if (!isGuest) queryClient.invalidateQueries(["cart", userId]);
    },
  });

  // --- MUTATION: UPDATE/DELETE (Giữ nguyên logic cũ nhưng gọn hơn) ---
  const updateCartMutation = useMutation({
    mutationFn: async (newItems) => {
      if (isGuest) {
        setCartItemsLocal(newItems);
        return;
      }
      // Với update/delete thì chấp nhận dùng state hiện tại vì user đang thao tác trực tiếp
      const latestCart = await db.cart.getUserCart(userId);
      if (latestCart) {
        await db.cart.updateCartItems(latestCart.id, newItems);
      }
    },
    onSuccess: () => {
      if (!isGuest) queryClient.invalidateQueries(["cart", userId]);
    },
  });

  // --- EXPORTED ACTIONS ---

  const addItemToCart = async (newItem) => {
    // Truyền trực tiếp newItem vào mutation, không tính toán array ở đây nữa
    await addToCartMutation.mutateAsync(newItem);
    return { success: true };
  };

  const toggleItemSelected = async (itemId, isSelected) => {
    const newCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, selected: isSelected } : item
    );
    await updateCartMutation.mutateAsync(newCart);
  };

  const updateItemQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    const newCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    await updateCartMutation.mutateAsync(newCart);
  };

  const removeItemFromCart = async (itemId) => {
    const newCart = cartItems.filter((item) => item.id !== itemId);
    await updateCartMutation.mutateAsync(newCart);
  };

  const clearSelectedItems = async () => {
    const newCart = cartItems.filter((item) => {
      const isBelongToStore = !item.storeId || item.storeId === currentStoreId;
      const isSelected = item.selected;
      return !(isBelongToStore && isSelected);
    });
    await updateCartMutation.mutateAsync(newCart);
  };

  return {
    cartItems: visibleCartItems,
    allCartItems: cartItems,
    loading: isGuest ? false : isLoadingServer || addToCartMutation.isPending,
    addItemToCart,
    toggleItemSelected,
    updateItemQuantity,
    removeItemFromCart,
    clearSelectedItems,
  };
}
