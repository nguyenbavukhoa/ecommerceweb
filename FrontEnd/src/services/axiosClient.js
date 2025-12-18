import axios from "axios";

// --- TỰ ĐỘNG LẤY BASE URL (Giữ nguyên logic cũ) ---
const getBaseUrl = () => {
  // if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  const { hostname } = window.location;
  const BACKEND_PORT = 8080; // Cổng backend
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `http://localhost:${BACKEND_PORT}/api/v1`;
  }
  return `http://${hostname}:${BACKEND_PORT}/api/v1`;
};
// const getBaseUrl = () => {
//   return "http://192.168.43.218:8080/api/v1/";
// };

const axiosClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// --- INTERCEPTOR REQUEST (ĐÃ SỬA) ---
axiosClient.interceptors.request.use(
  async (config) => {
    // [QUAN TRỌNG] Kiểm tra flag useToken
    // Nếu khi gọi API bạn truyền { useToken: false } thì sẽ KHÔNG gắn token
    if (config.useToken === false) {
      return config;
    }

    // Mặc định các API khác sẽ gắn Token (như Profile, Logout...)
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- INTERCEPTOR RESPONSE (Giữ nguyên) ---
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data;
    return response;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
