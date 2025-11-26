import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  // Lấy biến 'user' (State dành cho Admin) từ AuthContext
  const { user } = useAuth();

  // Debug: In ra console để xem nó nhận được gì
  console.log("🛡️ ProtectedRoute check User:", user);

  // 1. Kiểm tra đã đăng nhập chưa? (user phải tồn tại)
  // 2. Kiểm tra có phải Admin không? (userType phải là 1)
  if (!user || user.userType !== 1) {
    // Nếu không thỏa mãn, đá về trang đăng nhập Admin
    return <Navigate to="/admin-login" replace />;
  }

  // Nếu thỏa mãn, cho phép hiển thị trang Admin
  return children;
};

export default ProtectedRoute;
