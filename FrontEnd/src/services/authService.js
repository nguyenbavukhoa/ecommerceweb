import axiosClient from "./axiosClient";
import { SEED_USERS } from "../data/mockData"; // Giữ lại nếu cần cho Login fallback, nếu không có thể bỏ

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const authService = {
  // 1. LOGIN
  login: async (email, password) => {
    try {
      // Gọi API Login
      const data = await axiosClient.post(
        "/auth/login",
        { email, password },
        { useToken: false }
      );
      return data;
    } catch (error) {
      console.warn("API Login lỗi. Thử Mock Data...");
      await delay(800);

      // Fallback Mock (Giữ lại phòng khi API chưa chạy)
      const user = SEED_USERS.find(
        (u) => u.email === email && u.password === password
      );
      if (user) {
        if (!user.status)
          throw { response: { data: { message: "Tài khoản bị khóa!" } } };
        return { accessToken: "mock-token", user };
      }
      // Ném lỗi để Context bắt
      throw error;
    }
  },

  // 2. REGISTER
  register: async (userData) => {
    try {
      return await axiosClient.post("/auth/register", userData, {
        useToken: false,
      });
    } catch (error) {
      console.error("Lỗi Register:", error);
      throw error;
    }
  },

  // 3. GET PROFILE
  getUserProfile: async (userId) => {
    try {
      return await axiosClient.get(`/users/${userId}`);
    } catch (error) {
      // Mock fallback
      const user = SEED_USERS.find((u) => String(u.id) === String(userId));
      if (user) return user;
      throw error;
    }
  },

  // 4. LOGOUT
  logout: async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (e) {}
  },

  // --- [MỚI] BỘ 3 API QUÊN MẬT KHẨU (KHÔNG DÙNG MOCK) ---

  // 5. Gửi Email yêu cầu (Forgot Password)
  forgotPassword: async (email) => {
    try {
      // API trả về message: "Đã gửi OTP..."
      return await axiosClient.post(
        "/auth/forgot-password",
        { email },
        { useToken: false }
      );
    } catch (error) {
      console.error("Lỗi Forgot Password:", error);
      throw error; // Ném thẳng lỗi ra để Context xử lý
    }
  },

  // 6. Xác thực OTP
  verifyOtp: async (email, otp) => {
    try {
      return await axiosClient.post(
        "/auth/verify-otp",
        { email, otp },
        { useToken: false }
      );
    } catch (error) {
      console.error("Lỗi Verify OTP:", error);
      throw error;
    }
  },

  // 7. Đặt lại mật khẩu (Reset Password)
  resetPassword: async (email, newPassword) => {
    try {
      // Gửi đúng cấu trúc: { "email": "...", "newPassword": "..." }
      return await axiosClient.post(
        "/auth/reset-password",
        { email, newPassword },
        { useToken: false }
      );
    } catch (error) {
      console.error("Lỗi API Reset Password:", error);
      throw error;
    }
  },
};

export default authService;
