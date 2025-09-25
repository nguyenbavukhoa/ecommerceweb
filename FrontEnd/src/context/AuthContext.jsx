// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  // --- LOGIN ---
  const loginUser = async (email, password, rememberMe = false) => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        // credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success && data.data) {
        const userData = data.data;

        const authData = {
          email, // từ input login
          accountName: userData.accountName,
          role: userData.role || "USER", // fallback nếu null
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken,
        };

        setAuth(authData);

        // rememberMe -> localStorage, ngược lại sessionStorage
        if (rememberMe) {
          localStorage.setItem("auth", JSON.stringify(authData));
        } else {
          sessionStorage.setItem("auth", JSON.stringify(authData));
        }

        return authData;
      } else {
        throw new Error(data.message || "Sai email hoặc mật khẩu!");
      }
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  // --- SIGNUP ---
  const signupUser = async (email, password, accountName) => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          accountName,
          role: "USER", // server mặc định cũng có, nhưng thêm cho chắc
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Đăng ký thất bại!");
      }

      // Không login ngay, chỉ báo user check email
      return {
        success: true,
        message: "Vui lòng xác thực email rồi đăng nhập",
      };
    } catch (err) {
      console.error("Signup failed:", err);
      throw err;
    }
  };

  // --- LOGOUT ---
  const logout = async () => {
    try {
      setAuth(null);
      localStorage.removeItem("auth");
      sessionStorage.removeItem("auth");

      await fetch("http://localhost:8080/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // --- Restore auth khi reload ---
  useEffect(() => {
    const saved =
      localStorage.getItem("auth") || sessionStorage.getItem("auth");
    if (saved) {
      setAuth(JSON.parse(saved));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        loginUser,
        signupUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
