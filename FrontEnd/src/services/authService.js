import axiosClient from "./axiosClient";

const authService = {
  // ============================================================
  // 1. ACCOUNT & AUTHENTICATION (Theo Sheet Auth trong Excel)
  // ============================================================

  // 1.1 Đăng nhập (Login)
  login: async (email, password) => {
    try {
      // B1: Gọi API Login lấy Token
      const response = await axiosClient.post(
        "/auth/login",
        { email, password },
        { useToken: false }
      );

      let loginData = response.data || response;

      // B2: Lưu token ngay lập tức
      if (loginData.accessToken || loginData.token) {
        localStorage.setItem(
          "accessToken",
          loginData.accessToken || loginData.token
        );
      }

      // B3: Gọi API all-user để tìm ID thật
      try {
        const userRes = await axiosClient.get("/auth/all-user");
        const users = userRes.data || [];
        const foundUser = users.find((u) => u.email === email);

        if (foundUser) {
          loginData = {
            ...loginData,
            id: foundUser.id,
            email: foundUser.email,
            phoneNumber: foundUser.phoneNumber,
            fullName: foundUser.fullName || foundUser.accountName,
            role: foundUser.role,
            storeId: foundUser.storeId,
            status: foundUser.status,
            active: foundUser.active,
          };
        }
      } catch (err) {
        console.warn("⚠️ Không thể lấy thông tin chi tiết user:", err);
      }

      return loginData;
    } catch (error) {
      console.error("❌ Login Failed:", error);
      throw error;
    }
  },

  // 1.2 Đăng ký (Register)
  register: async (userData) => {
    try {
      return await axiosClient.post("/auth/register", userData, {
        useToken: false,
      });
    } catch (error) {
      console.error("❌ Register Failed:", error);
      throw error;
    }
  },

  // 2. TẠO USER (Dành cho Admin) -> Cho phép chọn Role
  createUser: async (userData) => {
    try {
      const payload = {
        email: userData.email,
        password: userData.password,
        accountName: userData.name || userData.fullName, // UI dùng 'name', API cần 'accountName'
        role: userData.role === "admin" ? "ADMIN" : "USER", // Map role từ UI sang API
      };
      // Admin dùng chung API register nhưng có Token quyền Admin
      return await axiosClient.post("/auth/register", payload);
    } catch (error) {
      console.error("Lỗi Create User (Admin):", error);
      throw error;
    }
  },

  // 1.3 Lấy tất cả tài khoản
  getAllUsers: async () => {
    try {
      const response = await axiosClient.get("/auth/all-user");
      return response.data || [];
    } catch (error) {
      console.error("❌ Get All Users Failed:", error);
      // Trả về mảng rỗng để không crash UI
      return [];
    }
  },

  // 1.4 Cập nhật Tài khoản (Admin)
  updateAccount: async (id, data) => {
    try {
      return await axiosClient.put(`/auth/update/${id}`, data);
    } catch (error) {
      console.error(`❌ Update Account ${id} Failed:`, error);
      throw error;
    }
  },

  // 5. [MỚI] KHÓA TÀI KHOẢN
  lockAccount: async (id) => {
    // API: PUT /auth/{id}/lock
    return await axiosClient.put(`/auth/${id}/lock`);
  },

  // 6. [MỚI] MỞ KHÓA TÀI KHOẢN
  unlockAccount: async (id) => {
    // API: PUT /auth/{id}/unlock
    return await axiosClient.put(`/auth/${id}/unlock`);
  },

  // 1.5 Xóa Tài khoản (Admin)
  deleteAccount: async (id) => {
    try {
      return await axiosClient.delete(`/auth/delete/${id}`);
    } catch (error) {
      console.error(`❌ Delete Account ${id} Failed:`, error);
      throw error;
    }
  },

  // 1.6 Đăng xuất
  logout: async () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user_info");
      // await axiosClient.post("/auth/logout");
    } catch (error) {
      console.error("❌ Logout Failed:", error);
    }
  },

  // ============================================================
  // 2. USER INFO (Địa chỉ giao hàng & Thông tin chi tiết)
  // ============================================================

  // 2.1 Lấy danh sách địa chỉ theo Account ID
  getUserInfos: async (accountId) => {
    try {
      if (!accountId) return [];
      const response = await axiosClient.get(`/user-info/${accountId}`);
      return response.data || [];
    } catch (error) {
      console.error(
        `❌ Get User Infos Failed for Account ${accountId}:`,
        error
      );
      return [];
    }
  },

  // 2.2 Tạo địa chỉ mới
  createUserInfo: async (data) => {
    try {
      return await axiosClient.post("/user-info", data);
    } catch (error) {
      console.error("❌ Create User Info Failed:", error);
      throw error;
    }
  },

  // 2.3 Cập nhật địa chỉ
  updateUserInfo: async (id, data) => {
    try {
      return await axiosClient.put(`/user-info/${id}`, data);
    } catch (error) {
      console.error(`❌ Update User Info ${id} Failed:`, error);
      throw error;
    }
  },

  // 2.4 Xóa địa chỉ
  deleteUserInfo: async (id) => {
    try {
      return await axiosClient.delete(`/user-info/${id}`);
    } catch (error) {
      console.error(`❌ Delete User Info ${id} Failed:`, error);
      throw error;
    }
  },

  // 2.5 Lấy tất cả User Info
  getAllUserInfos: async () => {
    try {
      const response = await axiosClient.get("/user-info/all");
      return response.data || [];
    } catch (error) {
      console.error("❌ Get All User Infos Failed:", error);
      return [];
    }
  },

  // ============================================================
  // 3. PASSWORD & OTP
  // ============================================================

  forgotPassword: async (email) => {
    try {
      return await axiosClient.post(
        "/auth/forgot-password",
        { email },
        { useToken: false }
      );
    } catch (error) {
      console.error("❌ Forgot Password Failed:", error);
      throw error;
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      return await axiosClient.post(
        "/auth/verify-otp",
        { email, otp },
        { useToken: false }
      );
    } catch (error) {
      console.error("❌ Verify OTP Failed:", error);
      throw error;
    }
  },

  resetPassword: async (email, newPassword) => {
    try {
      return await axiosClient.post(
        "/auth/reset-password",
        { email, newPassword },
        { useToken: false }
      );
    } catch (error) {
      console.error("❌ Reset Password Failed:", error);
      throw error;
    }
  },
};

export default authService;
