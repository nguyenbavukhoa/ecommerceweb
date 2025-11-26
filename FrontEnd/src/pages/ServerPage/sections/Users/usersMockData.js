export const USERS_MOCK = [
  // --- KHÁCH HÀNG (CUSTOMERS) ---
  {
    id: "USR-001",
    name: "Trần Văn Khách",
    email: "khach.tran@gmail.com",
    phone: "0901222333",
    role: "customer",
    status: "active",
    totalOrders: 45,
    joinedAt: "10/01/2024",
    reportNote: "",
    storeId: null, // Khách hàng không có store
  },
  {
    id: "USR-002",
    name: "Lê Thị Boom",
    email: "lethiboom@yahoo.com",
    phone: "0912345678",
    role: "customer",
    status: "blocked", // Bị khóa
    totalOrders: 2,
    joinedAt: "20/02/2024",
    reportNote: "Bom hàng 3 lần liên tiếp",
    storeId: null,
  },
  {
    id: "USR-003",
    name: "Phạm Văn Vip",
    email: "vip.pham@gmail.com",
    phone: "0988888888",
    role: "customer",
    status: "active",
    totalOrders: 150,
    joinedAt: "05/11/2023",
    reportNote: "Khách hàng thân thiết",
    storeId: null,
  },

  // --- ĐỐI TÁC / ADMIN (PARTNERS) ---
  // Dữ liệu này KHỚP với STORES_MOCK bạn cung cấp
  {
    id: "ADM-001",
    name: "Nguyễn Văn Chủ", // Chủ quán KHK Food Q10
    email: "quan10@khkfood.com",
    phone: "0909123456",
    role: "admin",
    status: "active",
    totalOrders: 0,
    joinedAt: "15/01/2024",
    reportNote: "",
    storeId: "STR-001", // ✅ Khớp với KHK Food Quận 10
  },
  {
    id: "ADM-002",
    name: "Trần Văn Giám Đốc", // Chủ quán Trà Sữa Mlem
    email: "mlemtea@gmail.com",
    phone: "0988777666",
    role: "admin",
    status: "active", // Tài khoản vẫn active dù store pending
    totalOrders: 0,
    joinedAt: "10/03/2024",
    reportNote: "Đang chờ duyệt hồ sơ cửa hàng",
    storeId: "STR-002", // ✅ Khớp với Trà Sữa Mlem
  },
  {
    id: "ADM-003",
    name: "Lê Thị Quản Lý", // Ví dụ một quán khác chưa có trong mock store hiện tại
    email: "binhthanh@khkfood.com",
    phone: "0912345678",
    role: "admin",
    status: "active",
    totalOrders: 0,
    joinedAt: "20/02/2024",
    reportNote: "",
    storeId: "STR-003", // Giả sử có quán STR-003
  },
];
