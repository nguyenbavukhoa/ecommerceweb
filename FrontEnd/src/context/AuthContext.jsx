import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  // --- HÀM HELPER: LẤY MESSAGE LỖI ---
  const getErrorMessage = (error, defaultMessage) => {
    const res = error.response?.data;
    if (res?.message) return res.message;
    if (typeof res === "string") return res;
    return defaultMessage;
  };

  // 1. TỰ ĐỘNG ĐĂNG NHẬP (Khi F5 hoặc mở lại web)
  useEffect(() => {
    // Kiểm tra xem trong kho lưu trữ có Token và thông tin User chưa
    const token = localStorage.getItem("accessToken");
    const savedUser = localStorage.getItem("user_info");

    if (token && savedUser) {
      try {
        // Nếu có, phục hồi lại trạng thái đăng nhập ngay lập tức
        setAuth(JSON.parse(savedUser));
      } catch (e) {
        // Nếu dữ liệu lỗi thì xóa đi đăng nhập lại
        logout();
      }
    }
  }, []);

  // 2. LOGIN (Lưu Token để dùng lần sau)
  const loginUser = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      // API trả về cấu trúc: { success: true, data: { accessToken, accountName, ... } }
      const data = response.data || response;

      // Lấy Token từ kết quả trả về
      const accessToken = data.accessToken || data.token;

      if (accessToken) {
        // [QUAN TRỌNG] Lưu lại để lần sau dùng
        localStorage.setItem("accessToken", accessToken);

        // Lưu cả Refresh Token (nếu có) để sau này gia hạn
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }

        // Lưu thông tin user (Tên, Role...) để hiển thị lên Header
        localStorage.setItem("user_info", JSON.stringify(data));

        // Cập nhật State để web biết là đã đăng nhập
        setAuth(data);

        return { success: true, message: "Đăng nhập thành công!" };
      } else {
        return { success: false, message: "Lỗi: Server không trả về Token." };
      }
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "Đăng nhập thất bại."),
      };
    }
  };

  // 3. LOGOUT (Xóa sạch để thoát hẳn)
  const logout = async () => {
    await authService.logout();
    // Xóa hết những gì đã lưu
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user_info");
    setAuth(null);
  };

  // ... (Các hàm Register, Forgot, Verify, Reset GIỮ NGUYÊN) ...
  const signupUser = async (userData) => {
    try {
      const res = await authService.register(userData);
      return { success: true, message: res.message || "Đăng ký thành công!" };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "Đăng ký thất bại."),
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await authService.forgotPassword(email);
      return { success: true, message: res.message || "Đã gửi mã xác nhận." };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "Lỗi gửi email."),
      };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const res = await authService.verifyOtp(email, otp);
      return { success: true, message: res.message || "Xác thực thành công!" };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "Mã OTP không đúng."),
      };
    }
  };

  const resetPassword = async (email, newPassword) => {
    try {
      const res = await authService.resetPassword(email, newPassword);
      return {
        success: true,
        message: res.message || "Đổi mật khẩu thành công!",
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "Đổi mật khẩu thất bại."),
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        loginUser,
        signupUser,
        logout,
        forgotPassword,
        verifyOtp,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
