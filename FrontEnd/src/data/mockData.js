// src/utils/mockData.js

// ==============================================================================
// PHẦN 1: DỮ LIỆU GỐC (SEED DATA)
// ==============================================================================

// 1. TRẠNG THÁI ĐƠN HÀNG
export const STATUSES = [
  { id: "pending", label: "Chờ xác nhận", iconClass: "fas fa-hourglass-half" },
  { id: "picking", label: "Đang lấy hàng", iconClass: "fas fa-box-open" },
  { id: "shipping", label: "Đang vận chuyển", iconClass: "fas fa-truck" },
  { id: "delivered", label: "Đã giao", iconClass: "fas fa-check-circle" },
  { id: "returned", label: "Hoàn trả", iconClass: "fas fa-undo-alt" },
  { id: "cancelled", label: "Đã huỷ", iconClass: "fas fa-ban" },
];

// 2. DANH MỤC MẪU
const SEED_CATEGORIES = [
  { id: 1, name: "Món Burger" },
  { id: 2, name: "Món Lẩu" },
  { id: 3, name: "Đồ uống" },
  { id: 4, name: "Gà rán" },
  { id: 5, name: "Mì Ý" },
  { id: 6, name: "Pizza" },
];

// 3. CỬA HÀNG MẪU
const SEED_STORES = [
  {
    id: "RES-01",
    name: "KHK Food Quận 1",
    address: "10 Nguyễn Huệ, Q.1, TP.HCM",
    phone: "0909111222",
    description:
      "Chi nhánh trung tâm quận 1, chuyên phục vụ khách du lịch và văn phòng.",
    openTime: "08:00",
    closeTime: "22:00",
    status: "active",
    avatar: "https://via.placeholder.com/150",
    location: [10.776019, 106.702068],
  },
  {
    id: "RES-02",
    name: "KHK Food Thủ Đức",
    address: "20 Võ Văn Ngân, TP. Thủ Đức",
    phone: "0909333444",
    description: "Không gian rộng rãi, phù hợp cho sinh viên và gia đình.",
    openTime: "07:00",
    closeTime: "23:00",
    status: "active",
    avatar: "https://via.placeholder.com/150",
    location: [10.850632, 106.771913],
  },
];

// [CẬP NHẬT] 4. DANH SÁCH DRONE (LẤY TỪ droneServerMock)
const HUB_LOCATION = [10.762622, 106.660172]; // Trạm sạc trung tâm (Q10)

// Lấy dữ liệu drone từ file mock riêng cho phần Drones
import { DRONE_FLEET_MOCK } from "../pages/ServerPage/sections/Drones/droneServerMock";

// Map dữ liệu từ DRONE_FLEET_MOCK về cấu trúc SEED_DRONES ứng với engine
const SEED_DRONES = (DRONE_FLEET_MOCK || []).map((d) => ({
  id: d.id,
  name: d.name,
  status: d.status || "ready",
  battery: d.battery != null ? d.battery : 100,
  // nếu drone có currentOrder.customerLocation thì dùng làm vị trí, ngược lại lấy hub
  currentLat:
    (d.currentOrder &&
      d.currentOrder.customerLocation &&
      d.currentOrder.customerLocation[0]) ||
    HUB_LOCATION[0],
  currentLng:
    (d.currentOrder &&
      d.currentOrder.customerLocation &&
      d.currentOrder.customerLocation[1]) ||
    HUB_LOCATION[1],
  currentOrderId:
    d.currentOrderId || (d.currentOrder && d.currentOrder.id) || null,
  lastUpdate: d.lastUpdate || 0,
  history: d.history || [],
  totalDeliveries: d.totalDeliveries || 0,
}));

export const SEED_HUBS = [
  {
    id: "HUB-01",
    name: "Trạm Trung Tâm (Q10)",
    location: [10.762622, 106.660172],
  },
  { id: "HUB-02", name: "Trạm Phụ (Q5)", location: [10.754622, 106.665172] },
  { id: "HUB-03", name: "Trạm Bắc (Q3)", location: [10.772622, 106.670172] },
];

// Helper di chuyển (Đưa vào đây để dùng chung)
const moveTowards = (
  currentLat,
  currentLng,
  targetLat,
  targetLng,
  step = 0.0003
) => {
  const dLat = targetLat - currentLat;
  const dLng = targetLng - currentLng;
  const dist = Math.sqrt(dLat * dLat + dLng * dLng);

  if (dist < step) return [targetLat, targetLng]; // Đã đến nơi

  const ratio = step / dist;
  return [currentLat + dLat * ratio, currentLng + dLng * ratio];
};

// 5. SẢN PHẨM MẪU
const SEED_PRODUCTS = [
  // --- STORE 1 (RES-01) ---
  {
    id: 1,
    storeId: "RES-01",
    name: "Burger Bò Phô Mai",
    status: "ACTIVE",
    priceBase: 65000.0,
    description: "Burger bò kèm phô mai thơm béo",
    imgMain: "https://via.placeholder.com/150",
    categoryId: 1,
    optionGroups: [
      {
        id: 1,
        name: "Kích cỡ",
        values: [
          { id: 11, value: "Nhỏ", price: 0.0, stockQuantity: 100 },
          { id: 12, value: "Vừa", price: 10000.0, stockQuantity: 100 },
          { id: 13, value: "Lớn", price: 15000.0, stockQuantity: 100 },
        ],
      },
      {
        id: 2,
        name: "Thêm phô mai",
        values: [
          { id: 21, value: "Phô mai lát", price: 5000.0, stockQuantity: 80 },
          {
            id: 22,
            value: "Phô mai tan chảy",
            price: 8000.0,
            stockQuantity: 60,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    storeId: "RES-01",
    name: "Burger Gà Giòn",
    status: "ACTIVE",
    priceBase: 59000.0,
    description: "Burger gà chiên giòn rụm",
    imgMain: "https://via.placeholder.com/150",
    categoryId: 1,
    optionGroups: [],
  },
  {
    id: 3,
    storeId: "RES-01",
    name: "Burger Tôm",
    status: "ACTIVE",
    priceBase: 62000.0,
    description: "Burger tôm chiên kèm rau tươi",
    imgMain: "https://via.placeholder.com/150",
    categoryId: 1,
    optionGroups: [],
  },
  {
    id: 11,
    storeId: "RES-01",
    name: "Gà Rán Truyền Thống",
    status: "ACTIVE",
    priceBase: 45000.0,
    description: "Miếng gà rán giòn tan",
    imgMain: "https://via.placeholder.com/150",
    categoryId: 4,
    optionGroups: [],
  },
  {
    id: 15,
    storeId: "RES-01",
    name: "Lẩu Thái Hải Sản",
    status: "ACTIVE",
    priceBase: 250000.0,
    description: "Lẩu chua cay chuẩn vị",
    imgMain: "https://via.placeholder.com/150",
    categoryId: 2,
    optionGroups: [],
  },
  // --- STORE 2 (RES-02) ---
  {
    id: 6,
    storeId: "RES-02",
    name: "Pizza Hải Sản",
    status: "ACTIVE",
    priceBase: 129000.0,
    description: "Pizza topping hải sản tươi ngon",
    imgMain: "https://via.placeholder.com/150",
    categoryId: 6,
    optionGroups: [],
  },
  {
    id: 10,
    storeId: "RES-02",
    name: "Pizza Truyền Thống",
    status: "ACTIVE",
    priceBase: 109000.0,
    description: "Pizza truyền thống Ý",
    imgMain: "https://via.placeholder.com/150",
    categoryId: 6,
    optionGroups: [],
  },
  {
    id: 13,
    storeId: "RES-02",
    name: "Trà Sữa Trân Châu",
    status: "ACTIVE",
    priceBase: 35000.0,
    description: "Trà sữa truyền thống",
    imgMain: "https://via.placeholder.com/150",
    categoryId: 3,
    optionGroups: [
      {
        id: 7,
        name: "Đường",
        values: [
          { id: 71, value: "100% Đường", price: 0 },
          { id: 72, value: "70% Đường", price: 0 },
          { id: 73, value: "50% Đường", price: 0 },
        ],
      },
      {
        id: 8,
        name: "Đá",
        values: [
          { id: 81, value: "100% Đá", price: 0 },
          { id: 82, value: "70% Đá", price: 0 },
          { id: 83, value: "50% Đá", price: 0 },
        ],
      },
    ],
  },
];

// 6. USER MẪU
export const SEED_USERS = [
  // --- ADMIN ACCOUNTS ---
  {
    id: "ADMIN-001",
    fullName: "Quản lý Quận 1",
    phoneNumber: "0900111222",
    address: "Tầng 1, KHK Office",
    gender: "Other",
    email: "admin1@khkfood.com",
    password: "123",
    role: "ADMIN",
    userType: 1,
    storeId: "RES-01",
    status: true,
    createAt: "2025-09-01T10:00:00.000Z",
    addresses: [],
  },

  {
    id: "ADMIN-002",
    fullName: "Quản lý Thủ Đức",
    phoneNumber: "0900333444",
    address: "Tầng 2, KHK Office",
    gender: "Other",
    email: "admin2@khkfood.com",
    password: "123",
    role: "ADMIN",
    userType: 1,
    storeId: "RES-02",
    status: true,
    createAt: "2025-10-15T10:00:00.000Z",
    addresses: [],
  },
  {
    id: "ADMIN-003",
    fullName: "Admin bị khóa",
    phoneNumber: "0900555666",
    address: "Tầng 3, KHK Office",
    gender: "Other",
    email: "admin-locked@khkfood.com",
    password: "123",
    role: "ADMIN",
    userType: 1,
    storeId: "RES-01",
    status: false,
    createAt: "2025-11-20T10:00:00.000Z",
    addresses: [],
  },
  // --- USER ACCOUNTS ---
  {
    id: "USER-001",
    fullName: "Nguyễn Văn An",
    phoneNumber: "0909123456",
    address: "123 Lê Lợi, Q.1, TP.HCM",
    gender: "Nam",
    email: "an@example.com",
    password: "123",
    role: "USER",
    userType: 0,
    status: true,
    createAt: "2025-11-25T10:00:00.000Z",
    addresses: [
      {
        id: 1,
        name: "Nguyễn Văn An",
        phone: "0909123456",
        address: "123 Lê Lợi, Q.1, TP.HCM",
        type: "HOME",
        isDefault: true,
      },
      {
        id: 2,
        name: "Anh An (Công ty)",
        phone: "0909123456",
        address: "Tòa nhà Bitexco, Q.1, TP.HCM",
        type: "WORK",
        isDefault: false,
      },
    ],
  },
  {
    id: "USER-002",
    fullName: "Trần Thị Bích",
    phoneNumber: "0918888999",
    address: "456 Nguyễn Trãi, Q.5, TP.HCM",
    gender: "Nữ",
    email: "bich@example.com",
    password: "123",
    role: "USER",
    userType: 0,
    status: true,
    createAt: "2025-11-24T10:00:00.000Z",
    addresses: [
      {
        id: 101,
        name: "Chị Bích",
        phone: "0918888999",
        address: "456 Nguyễn Trãi, Q.5, TP.HCM",
        type: "HOME",
        isDefault: true,
      },
    ],
  },
  {
    id: "USER-003",
    fullName: "Lê Văn Cường",
    phoneNumber: "0987654321",
    address: "789 Điện Biên Phủ, Bình Thạnh",
    gender: "Nam",
    email: "cuong@example.com",
    password: "123",
    role: "USER",
    userType: 0,
    status: false,
    createAt: "2025-11-23T10:00:00.000Z",
    addresses: [],
  },
];

// 7. [SỬA] YÊU CẦU RÚT TIỀN (GIẢM SỐ TIỀN RÚT XUỐNG ĐỂ KHÔNG BỊ ÂM)
const SEED_WITHDRAW_REQUESTS = [
  {
    id: "WD-1001",
    storeId: "RES-01",
    storeName: "KHK Food Quận 1",
    amount: 500000, // [FIX] 5tr -> 500k
    status: "pending",
    requestDate: "20/11/2025 10:30",
    bankInfo: "VCB - 123456789 - NGUYEN VAN A",
  },
  {
    id: "WD-1002",
    storeId: "RES-02",
    storeName: "KHK Food Thủ Đức",
    amount: 250000, // [FIX] 2.5tr -> 250k
    status: "approved",
    requestDate: "19/11/2025 09:15",
    bankInfo: "ACB - 987654321 - TRAN THI B",
  },
  {
    id: "WD-1003",
    storeId: "RES-01",
    storeName: "KHK Food Quận 1",
    amount: 150000, // [FIX] 1.5tr -> 150k
    status: "rejected",
    requestDate: "18/11/2025 14:20",
    bankInfo: "MB - 88889999 - NGUYEN VAN A",
  },
  {
    id: "WD-1004",
    storeId: "RES-02",
    storeName: "KHK Food Thủ Đức",
    amount: 1000000, // [FIX] 10tr -> 1tr
    status: "pending",
    requestDate: "21/11/2025 08:00",
    bankInfo: "TECH - 190012345 - TRAN THI B",
  },
  {
    id: "WD-1005",
    storeId: "RES-01",
    storeName: "KHK Food Quận 1",
    amount: 320000, // [FIX] 3.2tr -> 320k
    status: "approved",
    requestDate: "15/11/2025 11:45",
    bankInfo: "VCB - 123456789 - NGUYEN VAN A",
  },
];

// 8. HELPER LOCATION
const getRandomLocation = (centerPos) => {
  const [lat, lng] = centerPos;
  const rLat = lat + (Math.random() - 0.5) * 0.06;
  const rLng = lng + (Math.random() - 0.5) * 0.06;
  return [rLat, rLng];
};

// 9. [SỬA] SINH ĐƠN HÀNG (TĂNG SỐ LƯỢNG & TỈ LỆ HOÀN THÀNH)
const generateSeedOrders = (count) => {
  const orders = [];
  // [FIX] Status Cycle: Tăng tỉ lệ COMPLETED để có doanh thu cao
  const statusCycle = [
    "PLACED",
    "CONFIRMED",
    "CONFIRMED",
    "COMPLETED",
    "COMPLETED",
    "COMPLETED", // Gấp 3 lần completed
    "CANCELLED",
  ];

  for (let i = 0; i < count; i++) {
    const user = SEED_USERS.filter(
      (u) => u.userType === 0 && u.addresses && u.addresses.length > 0
    )[Math.floor(Math.random() * 2)];

    const store = SEED_STORES[Math.floor(Math.random() * SEED_STORES.length)];
    const availableProducts = SEED_PRODUCTS.filter(
      (p) => p.storeId === store.id
    );

    const status = statusCycle[i % statusCycle.length];

    let droneId = null;
    if (status === "SHIPPING" || status === "COMPLETED") {
      const randomDrone =
        SEED_DRONES[Math.floor(Math.random() * SEED_DRONES.length)];
      droneId = randomDrone.id;
    }

    const customerLocation = getRandomLocation(store.location);
    const defaultAddress =
      user.addresses.find((a) => a.isDefault) || user.addresses[0];

    const deliveryInfo = {
      name: defaultAddress.name,
      phone: defaultAddress.phone,
      address: defaultAddress.address,
      type: defaultAddress.type,
    };

    const paymentMethod = Math.random() > 0.5 ? "CASH" : "VNPAY";

    // [FIX] Tăng số lượng món ăn trong 1 đơn (1-4 món) -> Tăng giá trị đơn
    const itemCount = Math.floor(Math.random() * 4) + 1;
    const orderItems = [];
    let totalPrice = 0;

    for (let j = 0; j < itemCount; j++) {
      if (availableProducts.length === 0) break;
      const product =
        availableProducts[Math.floor(Math.random() * availableProducts.length)];
      const qty = Math.floor(Math.random() * 2) + 1;
      totalPrice += product.priceBase * qty;

      orderItems.push({
        id: product.id + j * 1000 + i * 10000,
        productName: product.name,
        quantity: qty,
        price: product.priceBase,
        imgUrl: product.imgMain,
        note: Math.random() > 0.7 ? "Ghi chú món ăn..." : "",
        productId: product.id,
      });
    }

    // Random thời gian
    const date = new Date();
    // Nếu là đơn đang chờ (Confirmed/Placed), cho nó là mới đặt hôm nay
    if (status === "CONFIRMED" || status === "PLACED") {
      date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 60)); // Vừa đặt cách đây vài phút
    } else {
      // Đơn xong thì cho là quá khứ
      date.setDate(date.getDate() - Math.floor(Math.random() * 10));
    }

    const timeString = `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;

    orders.push({
      id: 2000 + i,
      orderTime: timeString,
      totalPrice: totalPrice,
      note: Math.random() > 0.8 ? "Giao nhanh giúp em" : "",
      orderStatus: status,
      userId: user.id,
      restaurantId: store.id,
      storeName: store.name,
      orderItems: orderItems,
      deliveryInfo: deliveryInfo,
      paymentMethod: paymentMethod,
      droneId: droneId, // Luôn null lúc đầu
      customerLocation: customerLocation,
      customerAddress: deliveryInfo.address,
    });
  }

  return orders.sort((a, b) => b.id - a.id);
};

// [FIX] Tăng số lượng đơn lên 300
const SEED_ORDERS = generateSeedOrders(300);

// Thêm đơn giả lập cho Drone DR-001 đang giao (id 9999)
if (!SEED_ORDERS.find((o) => o.id === 9999)) {
  SEED_ORDERS.unshift({
    id: 9999,
    orderTime: "11:00 20/11/2025",
    totalPrice: 120000,
    note: "Giao gấp",
    orderStatus: "SHIPPING",
    userId: "USER-001",
    restaurantId: "RES-01",
    storeName: "KHK Food Quận 1",
    orderItems: [],
    deliveryInfo: {
      name: "Nguyễn Văn An",
      phone: "0909123456",
      address: "123 Lê Lợi, Q.1",
    },
    paymentMethod: "CASH",
    droneId: "DR-001",
    customerLocation: [10.7635, 106.6615],
    customerAddress: "123 Lê Lợi, Q.1",
  });
}

// Thêm đơn giả lập ORD-221 cho Drone DR-002 đang giao (theo droneServerMock)
if (!SEED_ORDERS.find((o) => o.id === "ORD-221")) {
  SEED_ORDERS.unshift({
    id: "ORD-221",
    orderTime: "11:00 20/11/2025",
    totalPrice: 98000,
    note: "Đơn giao Drone Beta",
    orderStatus: "SHIPPING",
    userId: "USER-002",
    restaurantId: "RES-02",
    storeName: "KHK Food Thủ Đức",
    orderItems: [],
    deliveryInfo: {
      name: "Nguyễn Văn Bình",
      phone: "0909000000",
      address: "Parkson Hùng Vương, Q5",
    },
    paymentMethod: "CASH",
    droneId: "DR-002",
    customerLocation: [10.757, 106.667],
    customerAddress: "Parkson Hùng Vương, Q5",
  });
}

// ==============================================================================
// PHẦN 2: DATABASE ENGINE
// ==============================================================================

const DB_KEYS = {
  PRODUCTS: "db_products",
  ORDERS: "db_orders",
  CATEGORIES: "db_categories",
  USERS: "db_users",
  STORES: "db_stores",
  WITHDRAWS: "db_withdraws",
  CART: "cart_items",
  DRONES: "db_drones",
};

const getFromLS = (key, seedData) => {
  if (typeof window === "undefined") return seedData;
  const stored = localStorage.getItem(key);
  if (stored) {
    return JSON.parse(stored);
  } else {
    localStorage.setItem(key, JSON.stringify(seedData));
    return seedData;
  }
};

const saveToLS = (key, data) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
};

export const initializeDatabase = () => {
  getFromLS(DB_KEYS.PRODUCTS, SEED_PRODUCTS);
  // Ensure orders are initialized and include our special delivering order (id 9999)
  const existingOrders = getFromLS(DB_KEYS.ORDERS, SEED_ORDERS);
  // If the running local DB doesn't have the 9999 order, add it from seed
  if (!existingOrders.find((o) => o.id === 9999)) {
    const seeded9999 = SEED_ORDERS.find((o) => o.id === 9999);
    if (seeded9999) {
      existingOrders.unshift(seeded9999);
      saveToLS(DB_KEYS.ORDERS, existingOrders);
    }
  }
  getFromLS(DB_KEYS.CATEGORIES, SEED_CATEGORIES);
  getFromLS(DB_KEYS.USERS, SEED_USERS);
  getFromLS(DB_KEYS.STORES, SEED_STORES);
  getFromLS(DB_KEYS.WITHDRAWS, SEED_WITHDRAW_REQUESTS);
  // Merge/overwrite drone entries so updated seed statuses (e.g. delivering) apply
  const existingDrones = getFromLS(DB_KEYS.DRONES, SEED_DRONES);
  const mergedDrones = (SEED_DRONES || []).map((sd) => {
    const found = (existingDrones || []).find((d) => d.id === sd.id);
    if (found) {
      // merge but prefer seed's status/currentOrder/history to ensure UI shows delivering
      return { ...found, ...sd };
    }
    return sd;
  });
  // Save merged drones back to LS
  saveToLS(DB_KEYS.DRONES, mergedDrones);

  console.log("⚡ Mock Database initialized and merged drone/order seeds!");
};

// --- DATABASE METHODS (Giữ nguyên cấu trúc cũ) ---

export const db = {
  products: {
    getAll: () => getFromLS(DB_KEYS.PRODUCTS, SEED_PRODUCTS),
    getOne: (id) => {
      const list = getFromLS(DB_KEYS.PRODUCTS, SEED_PRODUCTS);
      return list.find((p) => p.id == id);
    },
    add: (product) => {
      const list = getFromLS(DB_KEYS.PRODUCTS, SEED_PRODUCTS);
      const newId =
        list.length > 0 ? Math.max(...list.map((p) => p.id)) + 1 : 1;
      const newProduct = { ...product, id: newId, status: "ACTIVE" };
      list.unshift(newProduct);
      saveToLS(DB_KEYS.PRODUCTS, list);
      return newProduct;
    },
    update: (id, newData) => {
      const list = getFromLS(DB_KEYS.PRODUCTS, SEED_PRODUCTS);
      const index = list.findIndex((p) => p.id == id);
      if (index !== -1) {
        list[index] = { ...list[index], ...newData };
        saveToLS(DB_KEYS.PRODUCTS, list);
        return list[index];
      }
      return null;
    },
  },

  orders: {
    getAll: () => getFromLS(DB_KEYS.ORDERS, SEED_ORDERS),
    updateStatus: (orderId, newStatus) => {
      const list = getFromLS(DB_KEYS.ORDERS, SEED_ORDERS);
      const index = list.findIndex((o) => o.id == orderId);
      if (index !== -1) {
        list[index].orderStatus = newStatus;
        if (newStatus === "CANCELLED") {
          list[index].droneId = null;
        }
        saveToLS(DB_KEYS.ORDERS, list);
        return true;
      }
      return false;
    },
    assignDrone: (orderId) => {
      const list = getFromLS(DB_KEYS.ORDERS, SEED_ORDERS);
      const index = list.findIndex((o) => o.id == orderId);
      if (index !== -1) {
        list[index].orderStatus = "SHIPPING";
        const randomDrone =
          SEED_DRONES[Math.floor(Math.random() * SEED_DRONES.length)];
        list[index].droneId = randomDrone.id;
        saveToLS(DB_KEYS.ORDERS, list);
        return list[index];
      }
      throw new Error("Order not found");
    },
    add: (order) => {
      const list = getFromLS(DB_KEYS.ORDERS, SEED_ORDERS);
      list.unshift(order);
      saveToLS(DB_KEYS.ORDERS, list);
    },

    // [LOGIC MỚI] TỰ ĐỘNG ĐIỀU PHỐI (AUTO DISPATCH)
    dispatchDrone: (orderId) => {
      const orders = getFromLS(DB_KEYS.ORDERS, SEED_ORDERS);
      const drones = getFromLS(DB_KEYS.DRONES, SEED_DRONES);

      const orderIndex = orders.findIndex((o) => o.id == orderId);
      if (orderIndex === -1) throw new Error("Đơn hàng không tồn tại");

      // Tìm Drone rảnh (ưu tiên pin cao)
      const availableDroneIndex = drones.findIndex(
        (d) =>
          (d.status === "ready" || d.status === "charging") && d.battery > 30
      );

      if (availableDroneIndex === -1) {
        throw new Error("Hệ thống quá tải! Không có Drone khả dụng lúc này.");
      }

      const selectedDrone = drones[availableDroneIndex];

      // Reset vị trí về Trạm (HUB) để bắt đầu bay
      // (Phòng trường hợp drone đang ở đâu đó do lỗi data cũ)
      selectedDrone.currentLat = HUB_LOCATION[0];
      selectedDrone.currentLng = HUB_LOCATION[1];
      selectedDrone.status = "moving_to_store";
      selectedDrone.currentOrderId = orderId;

      orders[orderIndex].orderStatus = "PICKING";
      orders[orderIndex].droneId = selectedDrone.id;

      saveToLS(DB_KEYS.ORDERS, orders);
      saveToLS(DB_KEYS.DRONES, drones);

      return selectedDrone;
    },

    // Hàm cập nhật vị trí drone (giả lập di chuyển)
    updateDronePosition: (droneId, lat, lng, status) => {
      const drones = getFromLS(DB_KEYS.DRONES, SEED_DRONES);
      const idx = drones.findIndex((d) => d.id === droneId);
      if (idx !== -1) {
        drones[idx].currentLat = lat;
        drones[idx].currentLng = lng;
        if (status) drones[idx].status = status;
        saveToLS(DB_KEYS.DRONES, drones);
      }
    },
  },

  categories: {
    getAll: () => getFromLS(DB_KEYS.CATEGORIES, SEED_CATEGORIES),
  },

  users: {
    getAll: () => getFromLS(DB_KEYS.USERS, SEED_USERS),
    getOne: (id) => {
      const list = getFromLS(DB_KEYS.USERS, SEED_USERS);
      return list.find((u) => u.id == id);
    },
    create: (newUser) => {
      let users = getFromLS(DB_KEYS.USERS, SEED_USERS);
      if (users.some((u) => u.email === newUser.email)) {
        throw new Error("Email đã tồn tại.");
      }
      const newId = "USER-" + Date.now();
      const fullNewUser = {
        id: newId,
        userType: 0,
        role: "user",
        fullName: newUser.fullName || "Khách hàng mới",
        phoneNumber: newUser.phoneNumber || "",
        address: newUser.address || "",
        status: true,
        addresses: [],
        ...newUser,
      };
      users.push(fullNewUser);
      saveToLS(DB_KEYS.USERS, users);
      return fullNewUser;
    },
    update: (updatedUser) => {
      let users = getFromLS(DB_KEYS.USERS, SEED_USERS);
      const index = users.findIndex((u) => u.id == updatedUser.id);
      if (index === -1) {
        throw new Error(`Không tìm thấy người dùng có ID: ${updatedUser.id}`);
      }
      users[index] = { ...users[index], ...updatedUser };
      saveToLS(DB_KEYS.USERS, users);
      return users[index];
    },
    delete: (userId) => {
      let list = getFromLS(DB_KEYS.USERS, SEED_USERS);
      const newList = list.filter((u) => u.id !== userId);
      if (list.length === newList.length) throw new Error("User không tồn tại");
      saveToLS(DB_KEYS.USERS, newList);
      return true;
    },
  },

  stores: {
    getAll: () => {
      const stores = getFromLS(DB_KEYS.STORES, SEED_STORES);
      const orders = getFromLS(DB_KEYS.ORDERS, SEED_ORDERS);
      const calculatedStores = stores.map((store) => {
        const storeOrders = orders.filter((o) => o.restaurantId === store.id);
        const completedOrders = storeOrders.filter(
          (o) => o.orderStatus === "COMPLETED"
        );
        const realRevenue = completedOrders.reduce(
          (sum, o) => sum + (o.totalPrice || 0),
          0
        );
        return {
          ...store,
          totalOrders: storeOrders.length,
          revenue: realRevenue,
        };
      });
      return calculatedStores;
    },
    getOne: (storeId) => {
      const list = db.stores.getAll();
      return list.find((s) => s.id === storeId);
    },
    add: (newStore) => {
      const list = getFromLS(DB_KEYS.STORES, SEED_STORES);
      const nextId = "RES-" + String(list.length + 1).padStart(2, "0");
      const storeWithId = {
        id: nextId,
        ...newStore,
        joinedAt: new Date().toISOString(),
        revenue: 0,
        totalOrders: 0,
        location: newStore.location || [10.776019, 106.702068],
      };
      list.push(storeWithId);
      saveToLS(DB_KEYS.STORES, list);
      return storeWithId;
    },
    update: (storeId, newData) => {
      const list = getFromLS(DB_KEYS.STORES, SEED_STORES);
      const index = list.findIndex((s) => s.id === storeId);
      if (index !== -1) {
        list[index] = { ...list[index], ...newData };
        saveToLS(DB_KEYS.STORES, list);
        return list[index];
      }
      throw new Error("Không tìm thấy cửa hàng");
    },
    delete: (storeId) => {
      let list = getFromLS(DB_KEYS.STORES, SEED_STORES);
      const newList = list.filter((s) => s.id !== storeId);
      if (list.length === newList.length)
        throw new Error("Cửa hàng không tồn tại");
      saveToLS(DB_KEYS.STORES, newList);
      return true;
    },
  },

  withdraws: {
    getAll: () => getFromLS(DB_KEYS.WITHDRAWS, SEED_WITHDRAW_REQUESTS),
    create: (requestData) => {
      const list = getFromLS(DB_KEYS.WITHDRAWS, SEED_WITHDRAW_REQUESTS);
      const newId = "WD-" + (1000 + list.length + 1);
      const newRequest = {
        id: newId,
        status: "pending",
        requestDate: new Date().toLocaleString("vi-VN"),
        ...requestData,
      };
      list.unshift(newRequest);
      saveToLS(DB_KEYS.WITHDRAWS, list);
      return newRequest;
    },
    updateStatus: (id, newStatus) => {
      const list = getFromLS(DB_KEYS.WITHDRAWS, SEED_WITHDRAW_REQUESTS);
      const index = list.findIndex((r) => r.id === id);
      if (index !== -1) {
        list[index].status = newStatus;
        saveToLS(DB_KEYS.WITHDRAWS, list);
        return list[index];
      }
      throw new Error("Không tìm thấy yêu cầu rút tiền");
    },
  },

  wallet: {
    getStats: (storeId) => {
      const allOrders = getFromLS(DB_KEYS.ORDERS, SEED_ORDERS);
      const storeOrders = allOrders.filter(
        (o) => o.restaurantId === storeId && o.orderStatus === "COMPLETED"
      );
      const totalRevenue = storeOrders.reduce(
        (sum, o) => sum + (o.totalPrice || 0),
        0
      );

      const allWithdraws = getFromLS(DB_KEYS.WITHDRAWS, SEED_WITHDRAW_REQUESTS);
      const storeWithdraws = allWithdraws.filter((w) => w.storeId === storeId);

      const totalWithdrawn = storeWithdraws
        .filter((w) => w.status === "approved")
        .reduce((sum, w) => sum + Number(w.amount), 0);

      const totalPending = storeWithdraws
        .filter((w) => w.status === "pending")
        .reduce((sum, w) => sum + Number(w.amount), 0);

      const availableBalance = totalRevenue - totalWithdrawn - totalPending;

      return {
        totalRevenue,
        totalWithdrawn,
        totalPending,
        availableBalance,
        history: storeWithdraws,
      };
    },

    // [MỚI] Hàm cho Super Admin: Tính dòng tiền toàn hệ thống
    getSystemStats: () => {
      // 1. Tổng doanh thu toàn sàn (Cash In)
      const allOrders = getFromLS(DB_KEYS.ORDERS, SEED_ORDERS);
      const totalRevenueSystem = allOrders
        .filter((o) => o.orderStatus === "COMPLETED")
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      // 2. Tổng tiền đã chi trả cho các quán (Cash Out)
      const allWithdraws = getFromLS(DB_KEYS.WITHDRAWS, SEED_WITHDRAW_REQUESTS);
      const totalPaid = allWithdraws
        .filter((w) => w.status === "approved")
        .reduce((sum, w) => sum + Number(w.amount), 0);

      // 3. Tổng tiền đang chờ duyệt (Pending)
      const totalPending = allWithdraws
        .filter((w) => w.status === "pending")
        .reduce((sum, w) => sum + Number(w.amount), 0);

      // 4. Số dư hiện tại mà Hệ thống đang "giữ hộ" các quán
      // (Là số tiền quán đã bán được nhưng chưa rút)
      const currentHolding = totalRevenueSystem - totalPaid;

      return {
        totalRevenueSystem, // Tổng tiền vào
        totalPaid, // Tổng tiền ra
        totalPending, // Tổng tiền sắp phải chi
        currentHolding, // Tổng tiền đang giữ
      };
    },
  },

  // [MỚI] Thêm Object Drones để quản lý riêng
  drones: {
    getAll: () => getFromLS(DB_KEYS.DRONES, SEED_DRONES),

    update: (id, data) => {
      const list = getFromLS(DB_KEYS.DRONES, SEED_DRONES);
      const idx = list.findIndex((d) => d.id === id);
      if (idx === -1) return null;

      const prevStatus = list[idx].status;
      const nextStatus =
        data && Object.prototype.hasOwnProperty.call(data, "status")
          ? data.status
          : prevStatus;

      const updatedDrone = { ...list[idx], ...data };

      // Nếu drone chuyển từ "delivering" -> "ready" thì ghi nhận lịch sử và clear đơn đang giao
      if (
        prevStatus === "delivering" &&
        nextStatus === "ready" &&
        (list[idx].currentOrderId || list[idx].currentOrder)
      ) {
        const orderId = list[idx].currentOrderId || list[idx].currentOrder?.id;
        let orders = getFromLS(DB_KEYS.ORDERS, SEED_ORDERS);
        const orderIndex = orders.findIndex((o) => o.id == orderId);
        const orderPayload =
          orderIndex !== -1 ? orders[orderIndex] : list[idx].currentOrder;

        if (!updatedDrone.history) updatedDrone.history = [];
        updatedDrone.history.unshift({
          id: orderPayload?.id || orderId || `ORD-${Date.now()}`,
          time: new Date().toLocaleString("vi-VN"),
          address:
            orderPayload?.customerAddress ||
            orderPayload?.deliveryInfo?.address ||
            orderPayload?.address ||
            "Chưa xác định",
          totalPrice: orderPayload?.totalPrice || 0,
        });

        updatedDrone.currentOrderId = null;
        if (
          Object.prototype.hasOwnProperty.call(updatedDrone, "currentOrder")
        ) {
          updatedDrone.currentOrder = null;
        }

        if (orderIndex !== -1) {
          orders[orderIndex].orderStatus = "COMPLETED";
          saveToLS(DB_KEYS.ORDERS, orders);
        }
      }

      list[idx] = updatedDrone;
      saveToLS(DB_KEYS.DRONES, list);
      return list[idx];
    },

    // [LOGIC MỚI] Xử lý toàn bộ việc bay của hệ thống
    processSimulationTick: () => {
      const drones = getFromLS(DB_KEYS.DRONES, SEED_DRONES);
      const orders = getFromLS(DB_KEYS.ORDERS, SEED_ORDERS);
      const stores = getFromLS(DB_KEYS.STORES, SEED_STORES);
      let hasChange = false;
      const now = Date.now();

      drones.forEach((drone) => {
        // 1. Locking: Nếu drone vừa được update bởi tab khác trong vòng 50ms, bỏ qua để tránh tăng tốc độ
        if (now - (drone.lastUpdate || 0) < 50) return;

        // 2. Logic Sạc Pin
        if (drone.status === "charging" && drone.battery < 100) {
          drone.battery = Math.min(100, drone.battery + 1); // Sạc chậm thôi
          if (drone.battery === 100) drone.status = "ready";
          drone.lastUpdate = now;
          hasChange = true;
          return;
        }

        // 3. Logic Bay
        if (["ready", "charging", "maintenance"].includes(drone.status)) return;

        const order = orders.find((o) => o.id === drone.currentOrderId);
        if (!order) return; // Lỗi data

        // Xác định đích đến
        const store = stores.find((s) => s.id === order.restaurantId);
        const storeLoc = store ? store.location : HUB_LOCATION;
        const custLoc = order.customerLocation;
        const hubLoc = HUB_LOCATION; // Default Hub 1

        let target = hubLoc;
        let nextStatus = drone.status;

        if (drone.status === "moving_to_store") {
          target = storeLoc;
          // Đến nơi -> Chuyển sang giao
          if (Math.abs(drone.currentLat - target[0]) < 0.0005) {
            nextStatus = "delivering";
            // Update Order Status trực tiếp tại đây
            const oIdx = orders.findIndex((o) => o.id === order.id);
            if (oIdx !== -1) orders[oIdx].orderStatus = "SHIPPING";
          }
        } else if (drone.status === "delivering") {
          target = custLoc;
          // Đến nơi -> Giao xong -> Về
          if (Math.abs(drone.currentLat - target[0]) < 0.0005) {
            nextStatus = "returning";
            const oIdx = orders.findIndex((o) => o.id === order.id);
            if (oIdx !== -1) orders[oIdx].orderStatus = "COMPLETED";

            // Ghi lịch sử
            if (!drone.history) drone.history = [];
            drone.history.unshift({
              id: order.id,
              time: new Date().toLocaleString("vi-VN"),
              address: order.customerAddress,
              totalPrice: order.totalPrice,
            });
          }
        } else if (drone.status === "returning") {
          target = hubLoc;
          // Về đến trạm -> Check bảo trì/Sạc
          if (Math.abs(drone.currentLat - target[0]) < 0.0005) {
            // Logic bảo trì
            if (Math.random() < 0.05) nextStatus = "maintenance";
            else nextStatus = "charging";
            drone.currentOrderId = null; // Xong việc
          }
        }

        const SPEED = 0.00008;

        // Di chuyển
        const newPos = moveTowards(
          drone.currentLat,
          drone.currentLng,
          target[0],
          target[1],
          SPEED
        ); // Tốc độ bay
        drone.currentLat = newPos[0];
        drone.currentLng = newPos[1];
        drone.status = nextStatus;

        // Giảm pin khi bay
        if (Math.random() > 0.8) drone.battery = Math.max(0, drone.battery - 1);

        drone.lastUpdate = now;
        hasChange = true;
      });

      if (hasChange) {
        saveToLS(DB_KEYS.DRONES, drones);
        saveToLS(DB_KEYS.ORDERS, orders); // Lưu cả orders vì có update status
      }

      return drones; // Trả về data mới để UI render ngay
    },

    // [MỚI] Hàm ghi lịch sử khi giao xong
    logHistory: (droneId, order) => {
      const list = getFromLS(DB_KEYS.DRONES, SEED_DRONES);
      const idx = list.findIndex((d) => d.id === droneId);
      if (idx !== -1) {
        // Tạo log mới
        const newLog = {
          id: order.id,
          time: new Date().toLocaleString("vi-VN"), // Thời gian hoàn thành
          address: order.customerAddress || "Khách vãng lai",
          distance: "2.5 km", // Giả lập khoảng cách
          totalPrice: order.totalPrice,
        };

        // Nếu chưa có mảng history thì tạo mới
        if (!list[idx].history) list[idx].history = [];

        // Thêm vào đầu danh sách
        list[idx].history.unshift(newLog);

        saveToLS(DB_KEYS.DRONES, list);
      }
    },

    // Logic sạc pin
    chargeDrones: () => {
      const list = getFromLS(DB_KEYS.DRONES, SEED_DRONES);
      let hasChange = false;

      list.forEach((d) => {
        // Chỉ sạc khi đang ở trạng thái 'charging'
        if (d.status === "charging" && d.battery < 100) {
          d.battery = Math.min(100, d.battery + 5);
          // Pin đầy thì chuyển sang Ready
          if (d.battery === 100) {
            d.status = "ready";
          }
          hasChange = true;
        }
      });

      if (hasChange) saveToLS(DB_KEYS.DRONES, list);
      return list;
    },

    // Hàm update vị trí thông minh
    updatePositionSmart: (droneId, lat, lng, nextStatus) => {
      const list = getFromLS(DB_KEYS.DRONES, SEED_DRONES);
      const idx = list.findIndex((d) => d.id === droneId);

      if (idx !== -1) {
        list[idx].currentLat = lat;
        list[idx].currentLng = lng;

        // Xử lý chuyển trạng thái
        if (nextStatus) {
          // Nếu Drone vừa hạ cánh an toàn (Về trạm -> Ready)
          if (list[idx].status === "returning" && nextStatus === "ready") {
            // [LOGIC MỚI] Kiểm tra bảo trì ngay khi về trạm
            const needsMaintenance = Math.random() < 0.1; // 10% cơ hội bị lỗi sau mỗi chuyến bay

            if (needsMaintenance) {
              list[idx].status = "maintenance"; // Báo lỗi ngay
            } else if (list[idx].battery < 100) {
              list[idx].status = "charging"; // Không lỗi thì sạc
            } else {
              list[idx].status = "ready"; // Pin đầy thì sẵn sàng
            }

            list[idx].currentOrderId = null; // Xóa đơn hàng cũ
          } else {
            // Các trạng thái bay bình thường
            list[idx].status = nextStatus;
          }
        }
        saveToLS(DB_KEYS.DRONES, list);
      }
    },
    // Hàm reset tất cả về trạm (Khẩn cấp)
    recallAll: () => {
      const list = getFromLS(DB_KEYS.DRONES, SEED_DRONES);
      const newList = list.map((d) => ({
        ...d,
        status: d.status === "maintenance" ? "maintenance" : "ready", // Không reset con đang bảo trì
        currentLat: HUB_LOCATION[0],
        currentLng: HUB_LOCATION[1],
        currentOrderId: null,
      }));
      saveToLS(DB_KEYS.DRONES, newList);
      return newList;
    },
  },
};

// Export tương thích ngược
export const MOCK_PRODUCTS = db.products.getAll();
export const MOCK_ORDERS = db.orders.getAll();
export const ALL_ORDERS = MOCK_ORDERS;
export const MOCK_CATEGORIES = db.categories.getAll();
export const MOCK_USERS = db.users.getAll();
export const MOCK_STORES = db.stores.getAll();
export const MOCK_WITHDRAW_REQUESTS = db.withdraws.getAll();

// GIỎ HÀNG MẶC ĐỊNH
export const MOCK_CART_ITEMS = [
  {
    id: 1001,
    productId: 1, // Burger Bò (Store 1)
    name: "Burger Bò Phô Mai",
    price: 65000,
    quantity: 2,
    img: "https://via.placeholder.com/150",
    selected: true,
  },
  {
    id: 1002,
    productId: 13, // Trà Sữa (Store 2)
    name: "Trà Sữa Trân Châu",
    price: 35000,
    quantity: 1,
    img: "https://via.placeholder.com/150",
    selected: true,
  },
];
