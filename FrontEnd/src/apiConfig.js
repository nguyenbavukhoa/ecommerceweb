// src/apiConfig.js

// 1. Lấy địa chỉ (Hostname) hiện tại trên trình duyệt
// Ví dụ: Nếu mở trên điện thoại nó là "192.168.97.39"
// Ví dụ: Nếu mở trên máy tính nó là "localhost"
const hostname = window.location.hostname;

// 2. Cổng Backend (Bạn đã chốt là 8085)
const PORT = 8085;

// 3. Xuất ra đường dẫn API hoàn chỉnh
export const API_URL = `http://${hostname}:${PORT}/api/v1`;
// export const API_URL = `http://192.168.97.2:${PORT}/api/v1`;
