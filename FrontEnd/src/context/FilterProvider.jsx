import React, { createContext, useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

// 1. Tạo Context
const FilterContext = createContext();

// 2. Định nghĩa state ban đầu cho TẤT CẢ filter
const initialState = {
  name: "",
  category: "all",
  minPrice: "",
  maxPrice: "",
  sortBy: "",
  sortOrder: "",
  page: 1, // Bắt đầu từ trang 1
};

// 3. Tạo Provider
export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState(initialState);

  // Hàm "thông minh" để cập nhật state
  const updateFilters = (newFilterValues) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilterValues };

      // Quan trọng: Reset về trang 1 nếu filter thay đổi
      const hasFilterChanged = Object.keys(newFilterValues).some(
        (key) => key !== "page" && newFilterValues[key] !== prev[key]
      );
      if (hasFilterChanged) {
        updated.page = 1;
      }
      return updated;
    });
  };

  const value = {
    filters, // State filter hiện tại
    setFilters: updateFilters, // Hàm để thay đổi state
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

// 4. Tạo hook "useFilters" MỚI (để component sử dụng)
export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};

// 5. Hook useCategories (lấy từ file cũ)
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8080/api/v1/categories/all");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      return data.data || [];
    },
    staleTime: 1000 * 60 * 5, // cache 5 phút
  });
}

// === 6 Hook : Lấy danh sách Users ===
export function useCustomers() {
  return useQuery({
    // queryKey: Key dùng để cache
    queryKey: ["customers"],

    queryFn: async () => {
      const res = await fetch("http://localhost:8080/api/v1/auth/all-user");
      if (!res.ok) throw new Error("Lỗi khi tải danh sách người dùng");

      const data = await res.json();

      if (data.success) {
        return data.data || []; // Trả về mảng data
      } else {
        throw new Error(data.message || "Lấy dữ liệu thất bại");
      }
    },
    staleTime: 1000 * 60 * 5, // cache 5 phút
  });
}

// === 7. Hook MỚI: Lấy User Info (Chi tiết) ===
export function useUserInfo(accountId) {
  const { auth } = useAuth();
  const token = auth?.accessToken;

  return useQuery({
    queryKey: ["userInfo", accountId],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:8080/api/v1/user-info/${accountId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Lỗi khi tải thông tin người dùng");

      const data = await res.json();

      // === THAY ĐỔI QUAN TRỌNG ===
      if (data.success && data.data) {
        // Luôn trả về MẢNG data (dù rỗng hay có)
        return data.data; // Trả về mảng [ ... ]
      } else if (data.success && !data.data) {
        // Nếu API trả về data: null
        return []; // Trả về MẢNG RỖNG
      } else {
        throw new Error(data.message || "Lấy dữ liệu thất bại");
      }
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!accountId && !!token,
  });
}
