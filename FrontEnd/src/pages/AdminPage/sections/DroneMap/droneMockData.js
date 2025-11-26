// Tọa độ cửa hàng (Quận 10) để tham chiếu: [10.762622, 106.660172]

export const DRONE_ORDERS_MOCK = [
  {
    id: "DR-001",
    customerName: "Trần Văn A",
    phone: "0909111222",
    email: "a.tran@example.com",
    address: "Vạn Hạnh Mall, Quận 10, TP.HCM",
    // Tọa độ thực: Gần Vạn Hạnh Mall
    customerLocation: [10.769856, 106.670532],
    totalAmount: 155000,
    status: "shipping", // Đang chờ giao
    items: "2x Burger Bò, 1x Coca",
  },
  {
    id: "DR-002",
    customerName: "Lê Thị Bích",
    phone: "0912333444",
    email: "bich.le@example.com",
    address: "Đại học Bách Khoa, Quận 10, TP.HCM",
    // Tọa độ thực: Gần ĐH Bách Khoa
    customerLocation: [10.772319, 106.657973],
    totalAmount: 89000,
    status: "shipping",
    items: "1x Cơm Tấm, 1x Trà Đá",
  },
  {
    id: "DR-003",
    customerName: "Nguyễn Hoàng C",
    phone: "0988777666",
    email: "cuong.nguyen@example.com",
    address: "Bệnh viện Chợ Rẫy, Quận 5, TP.HCM",
    // Tọa độ thực: Gần BV Chợ Rẫy
    customerLocation: [10.757638, 106.663518],
    totalAmount: 210000,
    status: "shipping",
    items: "3x Phở Đặc Biệt",
  },
  {
    id: "DR-004",
    customerName: "Phạm Minh D",
    phone: "0977555444",
    email: "duy.pham@example.com",
    address: "Nhà thi đấu Phú Thọ, Quận 11, TP.HCM",
    // Tọa độ thực: Gần NTĐ Phú Thọ
    customerLocation: [10.767995, 106.652778],
    totalAmount: 120000,
    status: "shipping",
    items: "1x Gà Rán, 1x Pepsi",
  },
  {
    id: "DR-005",
    customerName: "Hoàng Thùy L",
    phone: "0933222111",
    email: "linh.hoang@example.com",
    address: "Công viên Lê Thị Riêng, Quận 10, TP.HCM",
    // Tọa độ thực: Gần CV Lê Thị Riêng
    customerLocation: [10.786677, 106.666305],
    totalAmount: 65000,
    status: "picking", // Đang lấy hàng
    items: "1x Trà Sữa Trân Châu",
  },
];

export const DRONE_HISTORY_MOCK = [
  {
    id: "DR-099",
    customerName: "Khách Vãng Lai",
    totalAmount: 95000,
    address: "Quận 3, TP.HCM",
    deliveredAt: "09:30 AM",
  },
  {
    id: "DR-098",
    customerName: "Ngô Kiến Huy",
    totalAmount: 320000,
    address: "Quận 1, TP.HCM",
    deliveredAt: "10:15 AM",
  },
];
