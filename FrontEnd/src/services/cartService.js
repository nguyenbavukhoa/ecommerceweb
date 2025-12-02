import axiosClient from "./axiosClient";

const CART_STORAGE_KEY = "KHK_CART_GUEST";

const getLocalCart = () => {
  const data = localStorage.getItem(CART_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const setLocalCart = (items) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

const cartService = {
  // 1. LẤY GIỎ HÀNG
  getCart: async (isLoggedIn) => {
    // Log xem service nhận được lệnh chưa
    console.log(`🔍 [CartService] getCart called. isLoggedIn = ${isLoggedIn}`);

    if (isLoggedIn) {
      try {
        console.log("📡 [CartService] Calling API: GET /cart-items/all ...");

        // Gọi API
        const response = await axiosClient.get("/cart-items/all");

        // Log dữ liệu thô từ Server
        console.log("📥 [CartService] Raw API Response:", response);

        // Kiểm tra cấu trúc data trả về
        // API thường trả về: { success: true, data: [...] } hoặc trực tiếp [...]
        const list = response.data || response || [];

        if (!Array.isArray(list)) {
          console.error(
            "❌ [CartService] Lỗi: Data từ API không phải là mảng!",
            list
          );
          return [];
        }

        console.log(`✅ [CartService] API trả về ${list.length} sản phẩm.`);

        // Map dữ liệu (Chuẩn hóa)
        const mappedList = list.map((item) => {
          // Log kiểm tra từng item xem có optionValuesDTO không
          if (!item.optionValuesDTO)
            console.warn(`⚠️ Item ID ${item.id} thiếu optionValuesDTO`);

          return {
            ...item,
            optionValues: item.optionValuesDTO || item.optionValues || [],
            storeId: item.storeId || 1,
          };
        });

        return mappedList;
      } catch (error) {
        console.error("❌ [CartService] API Error:", error);
        // Quan trọng: Log chi tiết lỗi từ server (nếu có)
        if (error.response) {
          console.error(
            "❌ [CartService] Server Response Status:",
            error.response.status
          );
          console.error(
            "❌ [CartService] Server Response Data:",
            error.response.data
          );
        }
        return [];
      }
    } else {
      console.log("👤 [CartService] Getting Local Cart (Guest)");
      return getLocalCart();
    }
  },

  // 2. THÊM VÀO GIỎ
  addToCart: async (isLoggedIn, item) => {
    if (isLoggedIn) {
      try {
        const payload = {
          productId: item.productId,
          optionValueId: item.optionValues
            ? item.optionValues.map((opt) => opt.id)
            : [],
          quantity: item.quantity,
          note: item.note || "",
        };
        console.log("📤 [CartService] AddToCart Payload:", payload);

        const response = await axiosClient.post("/cart-items/addCart", payload);
        console.log("✅ [CartService] Add Success:", response);
        return response.data;
      } catch (error) {
        console.error("❌ [CartService] Add Failed:", error);
        throw error;
      }
    } else {
      // Logic LocalStorage
      const items = getLocalCart();
      const existingIdx = items.findIndex(
        (i) => i.productId === item.productId
      ); // Check đơn giản
      let newItems;
      if (existingIdx > -1) {
        items[existingIdx].quantity += item.quantity;
        newItems = [...items];
      } else {
        const newItem = { ...item, id: Date.now(), selected: true };
        newItems = [...items, newItem];
      }
      setLocalCart(newItems);
      return newItems;
    }
  },

  // Các hàm khác giữ nguyên, chỉ cần thêm log nếu muốn debug kỹ hơn
  updateQuantity: async (isLoggedIn, itemId, quantity) => {
    if (isLoggedIn) {
      return await axiosClient.put(`/cart-items/${itemId}/quantity`, null, {
        params: { quantity },
      });
    } else {
      const items = getLocalCart().map((i) =>
        i.id === itemId ? { ...i, quantity } : i
      );
      setLocalCart(items);
      return items;
    }
  },

  toggleSelection: async (isLoggedIn, itemId, isSelected) => {
    if (isLoggedIn) {
      return await axiosClient.put(`/cart-items/select/${itemId}`, null, {
        params: { selected: isSelected },
      });
    } else {
      const items = getLocalCart().map((i) =>
        i.id === itemId ? { ...i, selected: isSelected } : i
      );
      setLocalCart(items);
      return items;
    }
  },

  removeItem: async (isLoggedIn, itemId) => {
    if (isLoggedIn) {
      return await axiosClient.delete(`/cart-items/${itemId}`);
    } else {
      const items = getLocalCart().filter((i) => i.id !== itemId);
      setLocalCart(items);
      return true;
    }
  },

  clearCart: async (isLoggedIn) => {
    if (isLoggedIn) {
      return await axiosClient.delete("/cart-items/account");
    } else {
      setLocalCart([]);
      return true;
    }
  },
};

export default cartService;
