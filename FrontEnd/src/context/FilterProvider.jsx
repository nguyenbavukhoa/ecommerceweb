// src/context/FilterProvider.jsx
import React, { createContext, useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
// [QUAN TRỌNG] Đổi import từ mockData sang dbService
import { db } from "../services/dbService";

const FilterContext = createContext();

// Khởi tạo filter mặc định (quan trọng: có storeId)
const initialState = {
  storeId: "RES-01", // Mặc định Store 1 cho User
  name: "",
  status: "ALL",
  category: "all",
  minPrice: "",
  maxPrice: "",
  startDate: "",
  endDate: "",
  sortBy: "",
  sortOrder: "",
  page: 1,
};

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState(initialState);

  const updateFilters = (newFilterValues) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilterValues };
      // Reset về trang 1 nếu thay đổi tiêu chí lọc (trừ page)
      const hasFilterChanged = Object.keys(newFilterValues).some(
        (key) => key !== "page" && newFilterValues[key] !== prev[key]
      );
      if (hasFilterChanged) {
        updated.page = 1;
      }
      return updated;
    });
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters: updateFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context)
    throw new Error("useFilters must be used within a FilterProvider");
  return context;
};

/* ===========================================================
   CÁC HOOK DỮ LIỆU (ĐÃ CHUYỂN SANG GỌI API QUA SERVICE)
   =========================================================== */

// 1. Lấy danh mục
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      // [API] Gọi db.categories.getAll()
      return await db.categories.getAll();
    },
    staleTime: Infinity,
  });
}

// 2. Lấy danh sách Khách hàng (Admin)
export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      return await db.users.getAll();
    },
    staleTime: 0,
  });
}

// 3. Hook Chi tiết Người dùng (useUserDetail)
export function useUserDetail(userId) {
  return useQuery({
    queryKey: ["userDetail", userId],
    enabled: !!userId,
    queryFn: async () => {
      const user = await db.users.getOne(userId);
      if (!user) throw new Error("Không tìm thấy người dùng.");

      // Lấy thêm orders để đếm số lượng (Logic cũ)
      // Lưu ý: db.orders.getAll() giờ là async, cần await
      const allOrders = await db.orders.getAll();
      const userOrders = allOrders.filter((o) => o.userId == userId);

      return { ...user, ordersCount: userOrders.length };
    },
    staleTime: 0,
  });
}

// 4. Hook Mutation Cập nhật/Tạo mới Người dùng
export function useSaveUser() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (userData) => {
      const isEdit = !!userData.id;
      // [API] Gọi service create hoặc update
      return isEdit
        ? await db.users.update(userData)
        : await db.users.create(userData);
    },
    onSuccess: (updatedUser, variables) => {
      queryClient.invalidateQueries(["customers"]);
      queryClient.setQueryData(["userDetail", updatedUser.id], updatedUser);

      const isStatusToggle = variables?.isStatusToggle;
      const message = isStatusToggle
        ? `Đã cập nhật trạng thái người dùng ${updatedUser.fullName}.`
        : variables.id
        ? "Đã lưu thông tin người dùng thành công!"
        : "Đã tạo tài khoản mới thành công!";

      showToast({
        title: "Thành công",
        message: message,
        type: "success",
      });
    },
    onError: (error) => {
      showToast({
        title: "Thất bại",
        message: `Lỗi: ${error.message}`,
        type: "error",
      });
      throw error;
    },
  });
}

// === 5. Lấy danh sách đơn hàng (Admin) + Lọc/Phân trang ===
export function useAdminOrders(filters, storeIdOverride) {
  return useQuery({
    queryKey: ["adminOrders", filters, storeIdOverride],
    queryFn: async () => {
      // [API] Lấy toàn bộ đơn hàng về trước
      let result = await db.orders.getAll();

      // --- LOGIC LỌC TẠI CLIENT (Giữ nguyên logic cũ) ---

      // Ưu tiên storeId được truyền vào (dành cho Admin Dashboard), nếu không thì lấy từ filter
      const activeStoreId = storeIdOverride || filters.storeId;

      if (activeStoreId) {
        result = result.filter((o) => o.restaurantId === activeStoreId);
      }

      // Tìm kiếm thông minh (Search)
      if (filters.name) {
        const s = filters.name.toLowerCase();

        // Để tìm tên User, ta cần danh sách User.
        // Tối ưu: Nếu API hỗ trợ expand thì tốt, không thì fetch users về hoặc dùng cache.
        // Ở đây để đơn giản cho MVP, ta fetch list users về để map tên (hoặc chấp nhận chỉ search trong snapshot đơn hàng).
        // Cách tốt nhất cho MVP hiện tại: Chỉ search trong snapshot đơn hàng (deliveryInfo) để tránh gọi thêm API users.

        result = result.filter((o) => {
          const deliveryName = o.deliveryInfo?.name || ""; // Tìm trong snapshot
          // const userName = ... (Tạm bỏ qua fallback tìm trong DB User để tối ưu performance khi list orders lớn)

          return (
            o.id.toString().includes(s) ||
            (o.note && o.note.toLowerCase().includes(s)) ||
            deliveryName.toLowerCase().includes(s)
          );
        });
      }

      if (filters.status && filters.status !== "ALL") {
        result = result.filter((o) => o.orderStatus === filters.status);
      }

      if (filters.startDate && filters.endDate) {
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        result = result.filter((o) => {
          // Format ngày trong DB: "HH:mm DD/MM/YYYY"
          const parts = o.orderTime.split(" ");
          if (parts.length < 2) return false;
          const [d, m, y] = parts[1].split("/");
          const date = new Date(`${y}-${m}-${d}`);
          return date >= start && date <= end;
        });
      }

      const pageSize = 10;
      const totalElements = result.length;
      const totalPages = Math.ceil(totalElements / pageSize);
      const page = Math.min(Math.max(filters.page || 1, 1), totalPages || 1);
      const startIdx = (page - 1) * pageSize;

      return {
        orders: result.slice(startIdx, startIdx + pageSize),
        totalPages,
        totalElements,
      };
    },
    staleTime: 0,
  });
}

// 6. Thông tin quán (Đã sửa để hỗ trợ Multi-store)
export function useStoreInfo(storeId) {
  return useQuery({
    queryKey: ["storeInfo", storeId],
    // Nếu có storeId thì fetch đúng store đó, nếu không thì... (dành cho guest)
    queryFn: async () => {
      if (storeId) {
        return await db.stores.getOne(storeId);
      }
      // Mặc định trả về Store 1 nếu không chỉ định (cho trang chủ User)
      const allStores = await db.stores.getAll();
      // Logic trong dbService.js của stores.getAll() đã tính toán revenue rồi
      return allStores[0];
    },
    staleTime: Infinity,
  });
}

// 7. [MỚI] Lấy danh sách tất cả Store (Cho Dropdown Header)
export function useStores() {
  return useQuery({
    queryKey: ["publicStores"],
    queryFn: async () => {
      const allStores = await db.stores.getAll();
      // Lọc chỉ lấy quán đang hoạt động
      return allStores.filter((s) => s.status === "active");
    },
    staleTime: Infinity,
  });
}

// 8. Yêu cầu rút tiền (Lấy danh sách)
export function useWithdrawRequests() {
  return useQuery({
    queryKey: ["withdrawRequests"],
    queryFn: async () => {
      return await db.withdraws.getAll();
    },
    staleTime: 0,
  });
}

// [MỚI] Hook Lấy thông tin Ví tiền của Store (Dành cho Store Admin)
export function useStoreWallet(storeId) {
  return useQuery({
    queryKey: ["storeWallet", storeId],
    enabled: !!storeId,
    queryFn: async () => {
      // Gọi service tính toán ví tiền (đã có logic tính trong dbService)
      return await db.wallet.getStats(storeId);
    },
    staleTime: 0,
    refetchInterval: 3000, // Tự động lấy dữ liệu mới mỗi 3 giây
  });
}

// [MỚI] Hook Tạo yêu cầu rút tiền (QUAN TRỌNG VỚI STORE WALLET)
export function useCreateWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestData) => {
      return await db.withdraws.create(requestData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["storeWallet", variables.storeId]);
      queryClient.invalidateQueries(["withdrawRequests"]);
    },
    onError: (err) => {
      throw err;
    },
  });
}

// [MỚI] Hook Cập nhật trạng thái Rút tiền (Duyệt/Từ chối)
export function useUpdateWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      return await db.withdraws.updateStatus(id, status);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["withdrawRequests"]);
      // Invalidate ví tiền của store liên quan (nếu cần thiết, tuy nhiên ở đây admin ko biết storeId ngay)
    },
    onError: (err) => {
      throw err;
    },
  });
}

// 10. Danh sách cửa hàng (Admin quản lý - SERVER SIDE)
// Lấy tất cả để Admin quản lý (cả active, inactive, pending)
export function useServerStores() {
  return useQuery({
    queryKey: ["serverStores"],
    queryFn: async () => {
      // Admin cần xem revenue thực tế, db.stores.getAll() trong service mới đã tính sẵn rồi
      return await db.stores.getAll();
    },
    staleTime: 0,
  });
}

// 11. Hook Tạo Store Mới
export function useCreateStore() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (newStoreData) => {
      return await db.stores.add(newStoreData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["publicStores"]);
      queryClient.invalidateQueries(["serverStores"]);

      showToast({
        title: "Thành công",
        message: "Tạo cửa hàng mới thành công!",
        type: "success",
      });
    },
    onError: (err) => {
      showToast({
        title: "Lỗi",
        message: err.message,
        type: "error",
      });
    },
  });
}

// 12. Hook Update Store
export function useUpdateStore() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      return await db.stores.update(id, data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["publicStores"]);
      queryClient.invalidateQueries(["serverStores"]);
      queryClient.invalidateQueries(["storeInfo", variables.id]);

      const msg = variables.data.status
        ? "Cập nhật trạng thái thành công!"
        : "Lưu thông tin thành công!";

      showToast({
        title: "Thành công",
        message: msg,
        type: "success",
      });
    },
    onError: (err) => {
      showToast({
        title: "Lỗi",
        message: err.message,
        type: "error",
      });
    },
  });
}

// 13. Hook Tạo User Mới
export function useCreateUser() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (newUserData) => {
      return await db.users.create(newUserData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["serverUsers"]);
      showToast({
        title: "Thành công",
        message: "Tạo tài khoản mới thành công!",
        type: "success",
      });
    },
    onError: (err) => {
      showToast({
        title: "Lỗi",
        message: err.message,
        type: "error",
      });
    },
  });
}

// 14. Hook Cập nhật User
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (userData) => {
      return await db.users.update(userData);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["serverUsers"]);
      queryClient.invalidateQueries(["customers"]); // Update cả list khách hàng
      queryClient.invalidateQueries(["userDetail", variables.id]);

      const msg = variables.status
        ? "Cập nhật trạng thái thành công!"
        : "Cập nhật thông tin thành công!";

      showToast({
        title: "Thành công",
        message: msg,
        type: "success",
      });
    },
    onError: (err) => {
      showToast({
        title: "Lỗi",
        message: err.message,
        type: "error",
      });
    },
  });
}

// --- STORE ---
// Hook Xóa Store
export function useDeleteStore() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (storeId) => {
      return await db.stores.delete(storeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["serverStores"]);
      queryClient.invalidateQueries(["publicStores"]);
      showToast({
        title: "Thành công",
        message: "Đã xóa cửa hàng vĩnh viễn!",
        type: "success",
      });
    },
    onError: (err) => {
      showToast({
        title: "Lỗi",
        message: err.message,
        type: "error",
      });
    },
  });
}

// --- USER ---
// Hook Xóa User
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (userId) => {
      return await db.users.delete(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["serverUsers"]);
      queryClient.invalidateQueries(["customers"]);
      showToast({
        title: "Thành công",
        message: "Đã xóa tài khoản vĩnh viễn!",
        type: "success",
      });
    },
    onError: (err) => {
      showToast({
        title: "Lỗi",
        message: err.message,
        type: "error",
      });
    },
  });
}

// [MỚI] Hook lấy thống kê tài chính toàn hệ thống (Cho Super Admin)
export function useSystemFinance() {
  return useQuery({
    queryKey: ["systemFinance"],
    queryFn: async () => {
      return await db.wallet.getSystemStats();
    },
    staleTime: 0,
    refetchInterval: 5000, // Tự cập nhật 5s/lần
  });
}

// [BỔ SUNG QUAN TRỌNG] Hook useServerUsers mà bạn có ở file cũ
// Dùng để lấy list user cho admin dashboard
export function useServerUsers() {
  return useQuery({
    queryKey: ["serverUsers"],
    queryFn: async () => {
      return await db.users.getAll();
    },
    staleTime: 0,
  });
}
