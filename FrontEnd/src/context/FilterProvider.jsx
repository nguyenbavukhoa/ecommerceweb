import React, { createContext, useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { db } from "../data/mockData";
import orderService from "../services/orderService";
import storeService from "../services/storeService";
import categoryService from "../services/categoryService";
import authService from "../services/authService";
const FilterContext = createContext();

// Khởi tạo filter mặc định (quan trọng: có storeId)
const initialState = {
  storeId: "null", // Mặc định Store 1 cho User
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
      // Nếu đổi Store -> Reset category và name về mặc định để tránh lỗi logic
      if (newFilterValues.storeId && newFilterValues.storeId !== prev.storeId) {
        localStorage.setItem("currentStoreId", newFilterValues.storeId);
        updated.category = "all";
        updated.name = "";
        updated.page = 1;
      } else if (hasFilterChanged) {
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

export function useServerUsers() {
  return useQuery({
    queryKey: ["serverUsers"],
    queryFn: async () => {
      const users = await authService.getAllUsers();
      return users.map((u) => ({
        ...u,
        active: u.active === true || String(u.active) === "true", // Chuẩn hóa boolean
        fullName: u.accountName || u.fullName,
      }));
    },
    staleTime: 5000,
  });
}

/* ===========================================================
   CÁC HOOK DỮ LIỆU (DÙNG MOCK DATA)
   =========================================================== */

// 1. Lấy danh mục
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
    staleTime: Infinity,
  });
}

// 2. Lấy danh sách Khách hàng (Admin)
export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return db.users.getAll();
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
      await new Promise((r) => setTimeout(r, 300));
      const user = db.users.getOne(userId);
      if (!user) throw new Error("Không tìm thấy người dùng.");
      const orders = db.orders.getAll().filter((o) => o.userId == userId);
      return { ...user, ordersCount: orders.length };
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
      // await new Promise((r) => setTimeout(r, 500));
      // const isEdit = !!userData.id;
      // return isEdit ? db.users.update(userData) : db.users.create(userData);
      // Trường hợp 1: Khóa/Mở khóa
      if (userData.active !== undefined) {
        if (userData.active) {
          // Muốn active = true -> Gọi Unlock
          return authService.unlockAccount(userData.id);
        } else {
          // Muốn active = false -> Gọi Lock
          return authService.lockAccount(userData.id);
        }
      }
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

      // [FIX] Sửa cú pháp showToast
      showToast({
        title: "Thành công",
        message: message,
        type: "success",
      });
    },
    onError: (error) => {
      // [FIX] Sửa cú pháp showToast
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
    // Key phụ thuộc vào filter để tự reload khi đổi trang/store
    queryKey: ["adminOrders", filters, storeIdOverride],
    queryFn: async () => {
      // Xác định Store ID
      const activeStoreId = storeIdOverride || filters.storeId;

      if (!activeStoreId) {
        return { orders: [], totalPages: 0, totalElements: 0 };
      }

      // Gọi API lấy danh sách theo Store (có phân trang)
      const { content, totalPages, totalElements } =
        await orderService.getOrdersByRestaurant(
          activeStoreId,
          filters.page,
          10 // PageSize mặc định
        );

      // Lưu ý: Hiện tại API chưa hỗ trợ lọc theo Search/Status/Date trên server
      // Dữ liệu trả về là của trang hiện tại.
      // Nếu muốn filter client-side thì chỉ filter được trên 10 item này thôi.
      // Tạm thời trả về nguyên bản từ API.

      return {
        orders: content,
        totalPages: totalPages,
        totalElements: totalElements,
      };
    },
    keepPreviousData: true, // Giữ data cũ khi chuyển trang để mượt hơn
    staleTime: 30 * 1000, // Cache 30s
  });
}

// 6. Thông tin quán (Đã sửa để hỗ trợ Multi-store)
export function useStoreInfo(storeId) {
  return useQuery({
    queryKey: ["storeInfo", storeId],
    // Nếu có storeId thì fetch đúng store đó, nếu không thì... (dành cho guest)
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      if (storeId) {
        // Gọi service lấy chi tiết store
        return await storeService.getOne(storeId);
      }
      const all = await storeService.getAll();
      return all.length > 0 ? all[0] : null;
    },
    staleTime: Infinity,
  });
}

// 7. [MỚI] Lấy danh sách tất cả Store (Cho Dropdown Header)
export function useStores() {
  return useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const stores = await storeService.getAll();
      // Chỉ lấy quán đang hoạt động (active: true)
      return stores.filter((s) => s.active === true);
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    refetchOnWindowFocus: false,
  });
}

// 8. Hook Update Store (Dành cho Admin Setting)
// export function useUpdateStore() {
//   const queryClient = useQueryClient();
//   const { showToast } = useToast();

//   return useMutation({
//     mutationFn: async ({ storeId, data }) => {
//       await new Promise((r) => setTimeout(r, 500));
//       return db.stores.update(storeId, data);
//     },
//     onSuccess: (data, variables) => {
//       queryClient.invalidateQueries(["storeInfo", variables.storeId]);
//       showToast("success", "Cập nhật thông tin quán thành công!");
//     },
//     onError: (err) => {
//       showToast("error", "Lỗi: " + err.message);
//     },
//   });
// }

// 9. Yêu cầu rút tiền (Lấy danh sách)
export function useWithdrawRequests() {
  return useQuery({
    queryKey: ["withdrawRequests"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return db.withdraws.getAll();
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
      // Giảm delay xuống thấp chút để polling mượt hơn
      await new Promise((r) => setTimeout(r, 100));
      return db.wallet.getStats(storeId);
    },
    staleTime: 0,
    refetchInterval: 3000, // [QUAN TRỌNG]: Tự động lấy dữ liệu mới mỗi 3 giây
  });
}

// [MỚI] Hook Tạo yêu cầu rút tiền (QUAN TRỌNG VỚI STORE WALLET)
export function useCreateWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestData) => {
      await new Promise((r) => setTimeout(r, 500));
      return db.withdraws.create(requestData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["storeWallet", variables.storeId]);
      queryClient.invalidateQueries(["withdrawRequests"]);
    },
    onError: (err) => {
      // Ném lỗi để component gọi có thể bắt được
      throw err;
    },
  });
}

// [MỚI] Hook Cập nhật trạng thái Rút tiền (Duyệt/Từ chối)
export function useUpdateWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      await new Promise((r) => setTimeout(r, 500));
      return db.withdraws.updateStatus(id, status);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["withdrawRequests"]);
    },
    onError: (err) => {
      // Ném lỗi để component gọi có thể bắt được
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
      // Gọi API lấy danh sách
      const stores = await storeService.getAll();

      // Nếu cần tính doanh thu (revenue) giả lập ở Client (vì API Get Restaurant chưa trả về revenue)
      // Ta có thể giữ logic tính toán cũ nếu muốn, hoặc hiển thị 0 tạm thời.
      // Ở đây trả về nguyên bản từ API để test kết nối trước.
      return stores;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// 11. Hook Tạo Store Mới
export function useCreateStore() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (newStoreData) => {
      // Gọi API Create
      return storeService.create(newStoreData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["serverStores"]);
      queryClient.invalidateQueries(["stores"]); // Refresh cả dropdown header
      showToast({
        title: "Thành công",
        message: "Tạo cửa hàng mới thành công!",
        type: "success",
      });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.message;
      showToast({ title: "Lỗi", message: msg, type: "error" });
    },
  });
}

// 12. Hook Update Store
export function useUpdateStore() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      // Gọi API Update
      return storeService.update(id, data);
    },
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries(["serverStores"]);
      queryClient.invalidateQueries(["storeInfo", variables.id]);
      showToast({
        title: "Thành công",
        message: "Cập nhật thành công!",
        type: "success",
      });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.message;
      showToast({ title: "Lỗi", message: msg, type: "error" });
    },
  });
}

// 13. Hook Tạo User Mới
// Tạo tài khoản mới
export function useCreateUser() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (newUserData) => {
      // [FIX] Map fullName từ Form sang accountName của API
      const payload = {
        email: newUserData.email,
        password: newUserData.password,
        accountName: newUserData.fullName,
        role: newUserData.role,
      };
      return authService.register(payload);
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
      const msg = err.response?.data?.message || "Tạo thất bại.";
      showToast({ title: "Lỗi", message: msg, type: "error" });
    },
  });
}

// 14. Hook Cập nhật User
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (userData) => {
      // userData: { id, active (boolean), ... }

      // [FIX] Kiểm tra nếu là hành động đổi trạng thái (active)
      if (userData.active !== undefined) {
        if (userData.active) {
          // Muốn active = true -> Gọi Unlock
          return authService.unlockAccount(userData.id);
        } else {
          // Muốn active = false -> Gọi Lock
          return authService.lockAccount(userData.id);
        }
      }

      // Nếu update thông tin khác (hiện chưa có API, gọi placeholder)
      return authService.updateAccount(userData.id, userData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["serverUsers"]);

      if (variables.active !== undefined) {
        const msg = variables.active
          ? "Đã mở khóa tài khoản!"
          : "Đã khóa tài khoản!";
        showToast({ title: "Thành công", message: msg, type: "success" });
      } else {
        showToast({
          title: "Thành công",
          message: "Cập nhật thành công!",
          type: "success",
        });
      }
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Thao tác thất bại.";
      showToast({ title: "Lỗi", message: msg, type: "error" });
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
      // Gọi API Delete
      return storeService.delete(storeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["serverStores"]);
      queryClient.invalidateQueries(["stores"]);
      showToast({
        title: "Thành công",
        message: "Đã xóa cửa hàng!",
        type: "success",
      });
    },
    onError: (err) => {
      // Lỗi thường gặp: "Cannot delete restaurant with active orders"
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        err.message;
      showToast({ title: "Xóa thất bại", message: msg, type: "error" });
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
      return authService.deleteAccount(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["serverUsers"]);
      showToast({
        title: "Thành công",
        message: "Đã xóa tài khoản!",
        type: "success",
      });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Xóa thất bại.";
      showToast({ title: "Lỗi", message: msg, type: "error" });
    },
  });
}

// [MỚI] Hook lấy thống kê tài chính toàn hệ thống (Cho Super Admin)
export function useSystemFinance() {
  return useQuery({
    queryKey: ["systemFinance"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return db.wallet.getSystemStats();
    },
    staleTime: 0,
    refetchInterval: 5000, // Tự cập nhật 5s/lần
  });
}
