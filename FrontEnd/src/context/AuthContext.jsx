// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  // --- LOGIN THẬT ---
  const loginUser = async (username, password) => {
    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      const data = await res.json();

      if (data.accessToken) {
        const authData = {
          accountName: data.accountName,
          role: data.role,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
        setAuth(authData);
        if (!data.refreshToken)
          localStorage.setItem("auth", JSON.stringify(authData));
        return authData;
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
    return null;
  };

  // --- SIGNUP THẬT: chỉ tạo tài khoản, không login ---
  const signupUser = async (accountName, password) => {
    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountName, password }),
        credentials: "include",
      });
      const data = await res.json();

      // Nếu thành công, chỉ trả true để show toast, không login
      if (res.ok) return true;
    } catch (err) {
      console.error("Signup failed:", err);
    }
    return false;
  };

  // --- FAKE LOGIN ---
  const loginFakeUser = async (accountName = "Demo") => {
    const fakeData = {
      accountName,
      role: "user",
      accessToken: "abc123",
      refreshToken: null,
    };
    setAuth(fakeData);
    localStorage.setItem("auth", JSON.stringify(fakeData));
    return fakeData;
  };

  // --- FAKE SIGNUP ---
  const signupFakeUser = async (accountName = "Demo") => {
    return { accountName };
  };

  // --- LOGOUT ---
  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
    fetch("http://localhost:8080/logout", {
      method: "POST",
      credentials: "include",
    });
  };

  // --- Restore auth khi reload ---
  useEffect(() => {
    const restoreAuth = async () => {
      if (!auth) {
        try {
          const res = await fetch("http://localhost:8080/refresh-token", {
            method: "POST",
            credentials: "include",
          });
          const data = await res.json();
          if (data.accessToken) {
            setAuth({
              accountName: data.accountName,
              role: data.role,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            });
            return;
          }
        } catch (err) {
          console.log("Không có refresh token hoặc hết hạn");
        }

        const saved = localStorage.getItem("auth");
        if (saved) setAuth(JSON.parse(saved));
      }
    };
    restoreAuth();
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        loginUser,
        signupUser,
        loginFakeUser,
        signupFakeUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
