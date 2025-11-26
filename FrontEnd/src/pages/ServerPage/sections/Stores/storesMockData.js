export const STORES_MOCK = [
  {
    id: "STR-001",
    name: "KHK Food Quận 10",
    owner: "Nguyễn Văn Chủ",
    phone: "0909123456",
    email: "quan10@khkfood.com",
    address: "123 Đường 3/2, Quận 10, TP.HCM",
    status: "active",
    revenue: 150000000,
    totalOrders: 450,
    joinedAt: "15/01/2024",
    // Thông tin hồ sơ
    taxCode: "0312345678",
    businessLicense: "GPKD-112233",
    menuSample: [
      { name: "Cơm Gà Xối Mỡ", price: 45000 },
      { name: "Trà Đá", price: 5000 },
    ],
    documents: ["CCCD_MatTruoc.jpg", "CCCD_MatSau.jpg", "GPKD.jpg"],
  },
  {
    id: "STR-002",
    name: "Trà Sữa Mlem",
    owner: "Trần Văn Giám Đốc",
    phone: "0988777666",
    email: "mlemtea@gmail.com",
    address: "10 Võ Văn Ngân, Thủ Đức, TP.HCM",
    status: "pending", // Đang chờ duyệt
    revenue: 0,
    totalOrders: 0,
    joinedAt: "10/03/2024",
    // Hồ sơ cần duyệt
    taxCode: "0388899911",
    businessLicense: "GPKD-998877",
    menuSample: [
      { name: "Trà Sữa Trân Châu", price: 35000 },
      { name: "Hồng Trà", price: 25000 },
    ],
    documents: ["CCCD_A.jpg", "GPKD_B.jpg"],
  },
  // ... thêm các store khác
];
