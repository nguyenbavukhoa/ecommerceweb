// // src/context/FilterProvider.jsx
// import React, { createContext, useContext, useState } from "react";
// // Bổ sung useMutation và useQueryClient
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useAuth } from "../context/AuthContext";
// // Bổ sung useToast (Giả định nằm trong cùng thư mục context)
// import { useToast } from "../context/ToastContext";

// // 1. IMPORT DATABASE ẢO
// import { db } from "../data/mockData";

// const FilterContext = createContext();

// const initialState = {
//   name: "",
//   status: "ALL",
//   category: "all",
//   minPrice: "",
//   maxPrice: "",
//   startDate: "",
//   endDate: "",
//   sortBy: "",
//   sortOrder: "",
//   page: 1,
// };

// export const FilterProvider = ({ children }) => {
//   const [filters, setFilters] = useState(initialState);

//   const updateFilters = (newFilterValues) => {
//     setFilters((prev) => {
//       const updated = { ...prev, ...newFilterValues };
//       // Reset về trang 1 nếu thay đổi tiêu chí lọc (trừ page)
//       const hasFilterChanged = Object.keys(newFilterValues).some(
//         (key) => key !== "page" && newFilterValues[key] !== prev[key]
//       );
//       if (hasFilterChanged) {
//         updated.page = 1;
//       }
//       return updated;
//     });
//   };

//   return (
//     <FilterContext.Provider value={{ filters, setFilters: updateFilters }}>
//       {children}
//     </FilterContext.Provider>
//   );
// };

// export const useFilters = () => {
//   const context = useContext(FilterContext);
//   if (!context)
//     throw new Error("useFilters must be used within a FilterProvider");
//   return context;
// };

// /* ===========================================================
//    CÁC HOOK DỮ LIỆU (DÙNG MOCK DATA)
//    =========================================================== */

// // 5. Lấy danh mục
// export function useCategories() {
//   return useQuery({
//     queryKey: ["categories"],
//     queryFn: async () => {
//       await new Promise((r) => setTimeout(r, 300));
//       return db.categories.getAll();
//     },
//     staleTime: Infinity,
//   });
// }

// // 6. Lấy danh sách Users (Admin)
// export function useCustomers() {
//   return useQuery({
//     queryKey: ["customers"],
//     queryFn: async () => {
//       await new Promise((r) => setTimeout(r, 300));
//       return db.users.getAll();
//     },
//     staleTime: 0,
//   });
// }

// // 7. Lấy thông tin chi tiết User
// export function useUserInfo(accountId) {
//   return useQuery({
//     queryKey: ["userInfo", accountId],
//     queryFn: async () => {
//       await new Promise((r) => setTimeout(r, 200));
//       const user = db.users.getOne(accountId);
//       return user ? [user] : [];
//     },
//     enabled: !!accountId,
//   });
// }

// // === 8. Lấy danh sách đơn hàng (Admin) + Lọc/Phân trang ===
// export function useAdminOrders(filters) {
//   return useQuery({
//     queryKey: ["adminOrders", filters],
//     queryFn: async () => {
//       await new Promise((resolve) => setTimeout(resolve, 400));

//       let result = db.orders.getAll();

//       // --- 1. LỌC THEO STORE ID ---
//       if (filters.storeId) {
//         result = result.filter((o) => o.restaurantId === filters.storeId);
//       }

//       // 2. Tìm kiếm (Mã đơn, Ghi chú, Tên người nhận từ Snapshot)
//       if (filters.name) {
//         const s = filters.name.toLowerCase();
//         result = result.filter((o) => {
//           // Tìm trong snapshot (ưu tiên)
//           const deliveryName = o.deliveryInfo?.name || "";

//           // Tìm fallback trong user DB
//           const userName = db.users.getOne(o.userId)?.fullName || "";

//           return (
//             o.id.toString().includes(s) ||
//             (o.note && o.note.toLowerCase().includes(s)) ||
//             deliveryName.toLowerCase().includes(s) ||
//             userName.toLowerCase().includes(s)
//           );
//         });
//       }

//       // ... (Các phần lọc status, date, phân trang GIỮ NGUYÊN) ...
//       if (filters.status && filters.status !== "ALL") {
//         result = result.filter((o) => o.orderStatus === filters.status);
//       }

//       if (filters.startDate && filters.endDate) {
//         // ... logic date ...
//         const start = new Date(filters.startDate);
//         const end = new Date(filters.endDate);
//         end.setHours(23, 59, 59, 999);
//         result = result.filter((o) => {
//           const parts = o.orderTime.split(" ");
//           if (parts.length < 2) return false;
//           const [d, m, y] = parts[1].split("/");
//           const date = new Date(`${y}-${m}-${d}`);
//           return date >= start && date <= end;
//         });
//       }

//       const pageSize = 10;
//       const totalElements = result.length;
//       const totalPages = Math.ceil(totalElements / pageSize);
//       const page = Math.min(Math.max(filters.page || 1, 1), totalPages || 1);
//       const startIdx = (page - 1) * pageSize;

//       return {
//         orders: result.slice(startIdx, startIdx + pageSize),
//         totalPages,
//         totalElements,
//       };
//     },
//     staleTime: 0,
//   });
// }

// // 9. Thông tin quán
// export function useStoreInfo() {
//   return useQuery({
//     queryKey: ["storeInfo"],
//     queryFn: async () => {
//       await new Promise((r) => setTimeout(r, 300));
//       // Mock cứng (chưa làm DB cho cái này vì ít sửa)
//       return {
//         name: "KHK Food & Beverage",
//         address: "Số 10, Đường 3/2, Quận 10, TP.HCM",
//         phone: "0356194587",
//         description: "Chuyên cung cấp các loại đồ ăn nhanh...",
//         openTime: "07:30",
//         closeTime: "22:30",
//         isOpen: true,
//         avatar: "https://via.placeholder.com/150",
//       };
//     },
//     staleTime: Infinity,
//   });
// }

// // 10. Yêu cầu rút tiền
// export function useWithdrawRequests() {
//   return useQuery({
//     queryKey: ["withdrawRequests"],
//     queryFn: async () => {
//       await new Promise((r) => setTimeout(r, 300));
//       return db.withdraws.getAll();
//     },
//     staleTime: 0,
//   });
// }

// // 11. Danh sách cửa hàng
// export function useServerStores() {
//   return useQuery({
//     queryKey: ["serverStores"],
//     queryFn: async () => {
//       await new Promise((r) => setTimeout(r, 300));
//       return db.stores.getAll();
//     },
//     staleTime: 0,
//   });
// }

// // 12. Danh sách users (Admin)
// export function useServerUsers() {
//   return useQuery({
//     queryKey: ["serverUsers"],
//     queryFn: async () => {
//       await new Promise((r) => setTimeout(r, 300));
//       return db.users.getAll();
//     },
//     staleTime: 0,
//   });
// }

// // 7. Hook Chi tiết Người dùng (useUserDetail) - Lấy thông tin đầy đủ cho Modal
// export function useUserDetail(userId) {
//   return useQuery({
//     queryKey: ["userDetail", userId],
//     enabled: !!userId, // Chỉ chạy khi có ID
//     queryFn: async () => {
//       await new Promise((r) => setTimeout(r, 300));

//       const user = db.users.getOne(userId);
//       if (!user) throw new Error("Không tìm thấy người dùng.");

//       // Thêm thông tin bổ sung: Đếm số đơn hàng
//       const orders = db.orders.getAll().filter((o) => o.userId == userId);

//       return {
//         ...user,
//         ordersCount: orders.length,
//       };
//     },
//     staleTime: 0,
//   });
// }

// // 8. Hook Mutation Cập nhật/Tạo mới Người dùng (useSaveUser)
// export function useSaveUser() {
//   const queryClient = useQueryClient();
//   const { showToast } = useToast();

//   return useMutation({
//     mutationFn: async (userData) => {
//       await new Promise((r) => setTimeout(r, 500));

//       // Nếu có ID, gọi UPDATE; nếu không, gọi CREATE
//       const isEdit = !!userData.id;
//       const result = isEdit
//         ? db.users.update(userData)
//         : db.users.create(userData);

//       return result;
//     },
//     onSuccess: (updatedUser, variables) => {
//       // 1. Invalidate list khách hàng để refresh table
//       queryClient.invalidateQueries(["customers"]);
//       // 2. Cập nhật cache của chi tiết người dùng (nếu đang mở modal)
//       queryClient.setQueryData(["userDetail", updatedUser.id], updatedUser);

//       const isStatusToggle = variables?.isStatusToggle;
//       const message = isStatusToggle
//         ? `Đã cập nhật trạng thái người dùng ${updatedUser.fullName}.`
//         : variables.id
//         ? "Đã lưu thông tin người dùng thành công!"
//         : "Đã tạo tài khoản mới thành công!";

//       showToast("success", message);
//     },
//     onError: (error) => {
//       showToast("error", `Lỗi: ${error.message}`);
//       throw error; // Quan trọng: Re-throw error để try/catch trong component bắt được
//     },
//   });
// }
// src/context/FilterProvider.jsx
import React, { createContext, useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { db } from "../data/mockData";

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

export function useServerUsers() {
  return useQuery({
    queryKey: ["serverUsers"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return db.users.getAll();
    },
    staleTime: 0,
  });
}

/* ===========================================================
   CÁC HOOK DỮ LIỆU (DÙNG MOCK DATA)
   =========================================================== */

// 1. Lấy danh mục
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return db.categories.getAll();
    },
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
      await new Promise((r) => setTimeout(r, 500));
      const isEdit = !!userData.id;
      return isEdit ? db.users.update(userData) : db.users.create(userData);
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
    queryKey: ["adminOrders", filters, storeIdOverride],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));

      let result = db.orders.getAll();

      // Ưu tiên storeId được truyền vào (dành cho Admin Dashboard), nếu không thì lấy từ filter
      const activeStoreId = storeIdOverride || filters.storeId;

      if (activeStoreId) {
        result = result.filter((o) => o.restaurantId === activeStoreId);
      }

      // Tìm kiếm thông minh (Search)
      if (filters.name) {
        const s = filters.name.toLowerCase();
        result = result.filter((o) => {
          const deliveryName = o.deliveryInfo?.name || ""; // Tìm trong snapshot
          const userName = db.users.getOne(o.userId)?.fullName || ""; // Fallback
          return (
            o.id.toString().includes(s) ||
            (o.note && o.note.toLowerCase().includes(s)) ||
            deliveryName.toLowerCase().includes(s) ||
            userName.toLowerCase().includes(s)
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
      await new Promise((r) => setTimeout(r, 300));
      if (storeId) {
        return db.stores.getOne(storeId);
      }
      // Mặc định trả về Store 1 nếu không chỉ định (cho trang chủ User)
      return db.stores.getAll()[0];
    },
    staleTime: Infinity,
  });
}

// 7. [MỚI] Lấy danh sách tất cả Store (Cho Dropdown Header)
export function useStores() {
  return useQuery({
    queryKey: ["publicStores"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      const allStores = db.stores.getAll();
      // Lọc chỉ lấy quán đang hoạt động
      return allStores.filter((s) => s.status === "active");
    },
    staleTime: Infinity,
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
      await new Promise((r) => setTimeout(r, 300));
      // Admin cần xem revenue thực tế, db.stores.getAll() đã tính sẵn rồi
      return db.stores.getAll();
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
      await new Promise((r) => setTimeout(r, 500));
      return db.stores.add(newStoreData);
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
      await new Promise((r) => setTimeout(r, 500));
      return db.stores.update(id, data);
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
      await new Promise((r) => setTimeout(r, 500));
      return db.users.create(newUserData);
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
      await new Promise((r) => setTimeout(r, 500));
      return db.users.update(userData);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["serverUsers"]);
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
      await new Promise((r) => setTimeout(r, 500));
      return db.stores.delete(storeId);
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
      await new Promise((r) => setTimeout(r, 500));
      return db.users.delete(userId);
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
      await new Promise((r) => setTimeout(r, 300));
      return db.wallet.getSystemStats();
    },
    staleTime: 0,
    refetchInterval: 5000, // Tự cập nhật 5s/lần
  });
}
