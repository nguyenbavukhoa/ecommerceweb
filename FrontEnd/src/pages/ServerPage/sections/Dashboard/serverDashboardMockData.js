// Giả lập dữ liệu thống kê tổng sàn
export const SERVER_STATS_MOCK = [
  {
    id: 1,
    title: "Tổng cửa hàng",
    value: 24,
    icon: "fa-light fa-store",
    color: "#3498db", // Xanh dương
  },
  {
    id: 2,
    title: "Tổng Drone",
    value: 15,
    icon: "fa-light fa-drone",
    color: "#9b59b6", // Tím
  },
  {
    id: 3,
    title: "Tổng đơn hàng",
    value: 1250,
    icon: "fa-light fa-basket-shopping",
    color: "#e67e22", // Cam
  },
  {
    id: 4,
    title: "Tổng doanh thu sàn",
    value: 850000000, // 850 triệu
    icon: "fa-light fa-sack-dollar",
    color: "#2ecc71", // Xanh lá
    isCurrency: true,
  },
  {
    id: 5,
    title: "Doanh thu Grab (20%)",
    value: 170000000,
    icon: "fa-light fa-building-columns",
    color: "#b5292f", // Đỏ
    isCurrency: true,
  },
  {
    id: 6,
    title: "Trả về Nhà hàng",
    value: 680000000,
    icon: "fa-light fa-money-bill-transfer",
    color: "#34495e", // Xám xanh
    isCurrency: true,
  },
];

// Giả lập danh sách hoạt động của các nhà hàng
export const RECENT_STORES_MOCK = [
  {
    id: "STR-001",
    name: "KHK Food Quận 10",
    revenue: 150000000,
    totalOrders: 450,
    status: "active",
  },
  {
    id: "STR-002",
    name: "Phở 24 Lý Tự Trọng",
    revenue: 85000000,
    totalOrders: 210,
    status: "active",
  },
  {
    id: "STR-003",
    name: "Cơm Tấm Cali Q5",
    revenue: 52000000,
    totalOrders: 180,
    status: "active",
  },
  {
    id: "STR-004",
    name: "Trà Sữa Mlem",
    revenue: 0,
    totalOrders: 0,
    status: "pending",
  },
  {
    id: "STR-005",
    name: "Bún Bò Huế O Loan",
    revenue: 25000000,
    totalOrders: 95,
    status: "inactive",
  },
];
