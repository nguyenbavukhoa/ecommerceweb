export const DRONE_FLEET_MOCK = [
  {
    id: "DR-001",
    name: "KHK Drone Alpha",
    status: "delivering",
    battery: 85,
    currentLocation: "Trạm Quận 10",
    totalDeliveries: 120,
    // Thêm dữ liệu lịch sử
    history: [
      {
        id: "ORD-112",
        time: "20/11 10:30",
        address: "Vạn Hạnh Mall",
        totalPrice: 175000,
      },
      {
        id: "ORD-109",
        time: "20/11 09:15",
        address: "ĐH Bách Khoa",
        totalPrice: 98000,
      },
      {
        id: "ORD-098",
        time: "19/11 14:20",
        address: "BV Chợ Rẫy",
        totalPrice: 142000,
      },
    ],
    // Nếu đang giao, cung cấp đơn hiện tại (đồng bộ với SEED_ORDERS id 9999)
    currentOrderId: 9999,
    currentOrder: {
      id: 9999,
      customerName: "Nguyễn Văn An",
      customerLocation: [10.7635, 106.6615],
      time: "20/11 12:05",
      address: "123 Lê Lợi, Q.1",
      totalPrice: 120000,
      note: "Giao trong giờ trưa",
    },
  },
  // ... (Các drone khác bạn cũng thêm history tương tự)
  {
    id: "DR-002",
    name: "KHK Drone Beta",
    status: "delivering",
    battery: 42,
    currentLocation: "Đang bay tới Q5...",
    totalDeliveries: 98,
    // Đơn hàng hiện tại đang giao (dùng để lưu local hoặc hiển thị khi orders DB không có)
    currentOrderId: "ORD-221",
    currentOrder: {
      id: "ORD-221",
      customerName: "Nguyễn Văn Bình",
      customerLocation: [10.757, 106.667],
      time: "20/11 11:00",
      address: "Parkson Hùng Vương, Q5",
      totalPrice: 98000,
      note: "Khách cần nhận trước 11h15",
    },
    history: [
      {
        id: "ORD-221",
        time: "20/11 11:00",
        address: "Parkson Hùng Vương",
        totalPrice: 98000,
      },
    ],
  },
  // ...
];
