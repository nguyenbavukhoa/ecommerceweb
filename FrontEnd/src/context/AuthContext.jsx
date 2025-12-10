// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
// [QUAN TRỌNG] Đổi import sang dbService
import { db } from "../services/dbService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  // State User cho ADMIN
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // --- 1. LOGIN ADMIN ---
  const loginAdmin = async (email, password) => {
    // Không cần setTimeout giả lập nữa
    try {
      // Admin vẫn cần fetch all để check userType (hoặc viết API riêng, nhưng MVP dùng getAll ok)
      const users = await db.users.getAll();

      const foundAdmin = users.find(
        (u) => u.email === email && u.password === password && u.userType === 1
      );

      if (foundAdmin) {
        const adminSession = {
          ...foundAdmin,
          accessToken: "fake-admin-token-" + Date.now(),
        };
        setUser(adminSession);
        localStorage.setItem("currentUser", JSON.stringify(adminSession));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Lỗi đăng nhập Admin:", error);
      return false;
    }
  };

  // --- 2. LOGIN USER (KHÁCH HÀNG) ---
  const loginUser = async (email, password, rememberMe = false) => {
    try {
      // [MỚI] Dùng hàm login của service (gọi API filter theo email)
      const foundUser = await db.users.login(email);

      // Check password và userType (chỉ cho phép userType = 0 đăng nhập ở trang này)
      if (foundUser && foundUser.password === password) {
        if (foundUser.userType !== 0) {
          throw new Error("Tài khoản này không phải là Khách hàng.");
        }

        // [SỬA] Lưu đầy đủ thông tin vào session
        const authData = {
          id: foundUser.id,
          email: foundUser.email,
          accountName: foundUser.fullName, // Map tên hiển thị
          fullName: foundUser.fullName, // Lưu tên gốc
          role: "USER",
          phone: foundUser.phoneNumber,
          address: foundUser.address || "", // Địa chỉ phẳng
          addresses: foundUser.addresses || [], // [QUAN TRỌNG] Sổ địa chỉ
          gender: foundUser.gender, // [MỚI] Giới tính
          accessToken: "fake-jwt-token-" + Date.now(),
        };

        setAuth(authData);
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("auth", JSON.stringify(authData));
        return authData;
      } else {
        throw new Error("Email hoặc mật khẩu không chính xác!");
      }
    } catch (error) {
      // Ném lỗi ra để Component bắt được và hiển thị Toast
      throw error;
    }
  };

  // --- 3. SIGNUP USER ---
  const signupUser = async (email, password, accountName) => {
    try {
      // [MỚI] Thêm await
      await db.users.create({
        email,
        password,
        fullName: accountName,
        // db.users.create (trong service) đã tự xử lý logic check trùng email
      });
      return { success: true, message: "Đăng ký thành công! Hãy đăng nhập." };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // --- 4. UPDATE PROFILE (NÂNG CẤP) ---
  const updateProfile = async (newData) => {
    if (!auth) return;

    // 1. Cập nhật State & Session Storage (Client side - để UI mượt)
    const updatedAuth = {
      ...auth,
      ...newData,
      // Nếu newData có 'name', cập nhật lại accountName/fullName cho đồng bộ
      accountName: newData.name || newData.fullName || auth.accountName,
      fullName: newData.name || newData.fullName || auth.fullName,
    };

    setAuth(updatedAuth);

    // Lưu lại session
    if (localStorage.getItem("auth")) {
      localStorage.setItem("auth", JSON.stringify(updatedAuth));
    } else {
      sessionStorage.setItem("auth", JSON.stringify(updatedAuth));
    }

    // 2. Cập nhật vào JSON Server (Server side)
    try {
      // Chuẩn bị payload để gửi API
      const dbPayload = {
        id: auth.id,
        ...newData, // Spread dữ liệu mới
      };

      // Map lại tên trường nếu UI gửi lên khác tên trong DB
      if (newData.name) dbPayload.fullName = newData.name;
      if (newData.phone) dbPayload.phoneNumber = newData.phone;

      // [MỚI] Gọi API update
      await db.users.update(dbPayload);
    } catch (err) {
      console.error("Lỗi cập nhật DB:", err);
      // Có thể revert state auth nếu muốn chặt chẽ, nhưng MVP thì log lỗi là được
      throw err;
    }
  };

  // --- LOGOUT ---
  const logout = async () => {
    if (user) {
      setUser(null);
      localStorage.removeItem("currentUser");
      window.location.href = "/admin-login"; // Chuyển hướng về trang đăng nhập Admin
      return;
    }

    setAuth(null);
    localStorage.removeItem("auth");
    sessionStorage.removeItem("auth");
  };

  // Load session khi F5
  useEffect(() => {
    const saved =
      localStorage.getItem("auth") || sessionStorage.getItem("auth");
    if (saved) setAuth(JSON.parse(saved));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        user,
        loginUser,
        signupUser,
        loginAdmin,
        logout,
        updateProfile,
        isLoggedIn: !!auth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
