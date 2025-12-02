export const DRONE_FLEET_MOCK = [
  {
    id: "DR-001",
    name: "KHK Drone Alpha",
    status: "ready",
    battery: 85,
    currentLocation: "Trạm Quận 10",
    totalDeliveries: 120,
    // Thêm dữ liệu lịch sử
    history: [
      {
        id: "ORD-112",
        time: "20/11 10:30",
        address: "Vạn Hạnh Mall",
        distance: "3.2 km",
      },
      {
        id: "ORD-109",
        time: "20/11 09:15",
        address: "ĐH Bách Khoa",
        distance: "1.5 km",
      },
      {
        id: "ORD-098",
        time: "19/11 14:20",
        address: "BV Chợ Rẫy",
        distance: "4.0 km",
      },
    ],
  },
  // ... (Các drone khác bạn cũng thêm history tương tự)
  {
    id: "DR-002",
    name: "KHK Drone Beta",
    status: "delivering",
    battery: 42,
    currentLocation: "Đang bay tới Q5...",
    totalDeliveries: 98,
    history: [
      {
        id: "ORD-221",
        time: "20/11 11:00",
        address: "Parkson Hùng Vương",
        distance: "2.8 km",
      },
    ],
  },
  // ...
];
