// src/utils/mockData.js

// ==============================================================================
// PHẦN 1: DỮ LIỆU GỐC (SEED DATA) - Dùng để khởi tạo khi LocalStorage trống
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

// 3. CỬA HÀNG MẪU (2 STORE RIÊNG BIỆT)
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
    location: [10.776019, 106.702068], // Tọa độ Quận 1
  },
  // {
  //   id: "RES-02",
  //   name: "KHK Food Thủ Đức",
  //   address: "20 Võ Văn Ngân, TP. Thủ Đức",
  //   phone: "0909333444",
  //   description: "Không gian rộng rãi, phù hợp cho sinh viên và gia đình.",
  //   openTime: "07:00",
  //   closeTime: "23:00",
  //   status: "active",
  //   avatar: "https://via.placeholder.com/150",
  //   location: [10.850632, 106.771913], // Tọa độ Thủ Đức
  // },
];

// 4. DANH SÁCH DRONE (ĐỘI BAY)
const SEED_DRONES = [
  { id: "DR-001", name: "Drone Alpha", status: "ready", battery: 100 },
  { id: "DR-002", name: "Drone Beta", status: "ready", battery: 95 },
  { id: "DR-003", name: "Drone Gamma", status: "ready", battery: 80 },
  { id: "DR-004", name: "Drone Delta", status: "maintenance", battery: 20 },
  { id: "DR-005", name: "Drone Epsilon", status: "charging", battery: 45 },
];

// 5. SẢN PHẨM MẪU (Đã phân chia theo Store)
const SEED_PRODUCTS = [
  // --- SẢN PHẨM CỦA STORE 1 (RES-01): Burger, Gà, Lẩu ---
  {
    id: 1,
    storeId: "RES-01", // Thuộc Store 1
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
    storeId: "RES-01", // Thuộc Store 1
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
    storeId: "RES-01", // Thuộc Store 1
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
    storeId: "RES-01", // Thuộc Store 1
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
    storeId: "RES-01", // Thuộc Store 1
    name: "Lẩu Thái Hải Sản",
    status: "ACTIVE",
    priceBase: 250000.0,
    description: "Lẩu chua cay chuẩn vị",
    imgMain: "https://via.placeholder.com/150",
    categoryId: 2,
    optionGroups: [],
  },

  // // --- SẢN PHẨM CỦA STORE 2 (RES-02): Pizza, Trà sữa ---
  // {
  //   id: 6,
  //   storeId: "RES-02", // Thuộc Store 2
  //   name: "Pizza Hải Sản",
  //   status: "ACTIVE",
  //   priceBase: 129000.0,
  //   description: "Pizza topping hải sản tươi ngon",
  //   imgMain: "https://via.placeholder.com/150",
  //   categoryId: 6,
  //   optionGroups: [],
  // },
  // {
  //   id: 10,
  //   storeId: "RES-02", // Thuộc Store 2
  //   name: "Pizza Truyền Thống",
  //   status: "ACTIVE",
  //   priceBase: 109000.0,
  //   description: "Pizza truyền thống Ý",
  //   imgMain: "https://via.placeholder.com/150",
  //   categoryId: 6,
  //   optionGroups: [],
  // },
  // {
  //   id: 13,
  //   storeId: "RES-02", // Thuộc Store 2
  //   name: "Trà Sữa Trân Châu",
  //   status: "ACTIVE",
  //   priceBase: 35000.0,
  //   description: "Trà sữa truyền thống",
  //   imgMain: "https://via.placeholder.com/150",
  //   categoryId: 3,
  //   optionGroups: [
  //     {
  //       id: 7,
  //       name: "Đường",
  //       values: [
  //         { id: 71, value: "100% Đường", price: 0 },
  //         { id: 72, value: "70% Đường", price: 0 },
  //         { id: 73, value: "50% Đường", price: 0 },
  //       ],
  //     },
  //     {
  //       id: 8,
  //       name: "Đá",
  //       values: [
  //         { id: 81, value: "100% Đá", price: 0 },
  //         { id: 82, value: "70% Đá", price: 0 },
  //         { id: 83, value: "50% Đá", price: 0 },
  //       ],
  //     },
  //   ],
  // },
];

// 6. USER MẪU
const SEED_USERS = [
  // --- ADMIN ACCOUNTS ---
  {
    id: "ADMIN-001",
    fullName: "Quản lý Quận 1",
    phoneNumber: "0900111222",
    address: "Tầng 1, KHK Office",
    gender: "Other",
    email: "admin1@khkfood.com",
    password: "123", // Mật khẩu test
    role: "ADMIN",
    userType: 1,
    storeId: "RES-01", // <--- Admin này CHỈ quản lý Store 1
    status: true,
    createAt: "2025-09-01T10:00:00.000Z",
    addresses: [], // Admin thường không cần sổ địa chỉ nhận hàng
  },
  // {
  //   id: "ADMIN-002",
  //   fullName: "Quản lý Thủ Đức",
  //   phoneNumber: "0900333444",
  //   address: "Tầng 2, KHK Office",
  //   gender: "Other",
  //   email: "admin2@khkfood.com",
  //   password: "123",
  //   role: "ADMIN",
  //   userType: 1,
  //   storeId: "RES-02", // <--- Admin này CHỈ quản lý Store 2
  //   status: true,
  //   createAt: "2025-10-15T10:00:00.000Z",
  //   addresses: [],
  // },
  // {
  //   id: "ADMIN-003",
  //   fullName: "Admin bị khóa",
  //   phoneNumber: "0900555666",
  //   address: "Tầng 3, KHK Office",
  //   gender: "Other",
  //   email: "admin-locked@khkfood.com",
  //   password: "123",
  //   role: "ADMIN",
  //   userType: 1,
  //   storeId: "RES-01",
  //   status: false, // Bị khóa
  //   createAt: "2025-11-20T10:00:00.000Z",
  //   addresses: [],
  // },
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
    // [NEW] Sổ địa chỉ
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

// 7. YÊU CẦU RÚT TIỀN MẪU
const SEED_WITHDRAW_REQUESTS = [
  {
    id: 1,
    storeId: "RES-01",
    storeName: "KHK Food Quận 1",
    amount: 5000000,
    status: "PENDING",
    requestDate: "20/11/2025",
    bankInfo: "VCB - 123456789",
  },
  {
    id: 2,
    storeId: "RES-02",
    storeName: "KHK Food Thủ Đức",
    amount: 2500000,
    status: "APPROVED",
    requestDate: "19/11/2025",
    bankInfo: "ACB - 987654321",
  },
];

// 8. HELPER: Sinh tọa độ ngẫu nhiên xung quanh 1 điểm (bán kính ~3km)
const getRandomLocation = (centerPos) => {
  const [lat, lng] = centerPos;
  // Random lệch khoảng +/- 0.03 độ
  const rLat = lat + (Math.random() - 0.5) * 0.06;
  const rLng = lng + (Math.random() - 0.5) * 0.06;
  return [rLat, rLng];
};

// 9. HÀM SINH ĐƠN HÀNG MẪU (CẬP NHẬT THÊM PAYMENT METHOD & DELIVERY INFO)
const generateSeedOrders = (count) => {
  const orders = [];
  // SỬA QUAN TRỌNG: Dùng mã IN HOA để khớp với Orders.jsx
  const statusCycle = [
    "PLACED",
    "CONFIRMED", // Đơn này sẽ hiển thị chờ giao trên map
    "SHIPPING", // Đơn này đã có drone giao
    "COMPLETED", // Lịch sử
    "CANCELLED",
  ];

  for (let i = 0; i < count; i++) {
    // Lấy random user từ những user có sẵn địa chỉ (User 1 và 2)
    const user = SEED_USERS.filter(
      (u) => u.userType === 0 && u.addresses && u.addresses.length > 0
    )[Math.floor(Math.random() * 2)];

    const store = SEED_STORES[Math.floor(Math.random() * SEED_STORES.length)];
    const availableProducts = SEED_PRODUCTS.filter(
      (p) => p.storeId === store.id
    );

    const status = statusCycle[i % statusCycle.length];

    // 1. Drone
    let droneId = null;
    if (status === "SHIPPING" || status === "COMPLETED") {
      const randomDrone =
        SEED_DRONES[Math.floor(Math.random() * SEED_DRONES.length)];
      droneId = randomDrone.id;
    }

    // 2. Map
    const customerLocation = getRandomLocation(store.location);

    // 3. Snapshot Delivery Info (Lấy địa chỉ mặc định của user)
    const defaultAddress =
      user.addresses.find((a) => a.isDefault) || user.addresses[0];

    const deliveryInfo = {
      name: defaultAddress.name,
      phone: defaultAddress.phone,
      address: defaultAddress.address,
      type: defaultAddress.type,
    };

    // 4. Payment Method (Ngẫu nhiên)
    const paymentMethod = Math.random() > 0.5 ? "CASH" : "VNPAY";

    const itemCount = Math.floor(Math.random() * 3) + 1;
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

    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 10));
    date.setHours(
      Math.floor(Math.random() * 14) + 8,
      Math.floor(Math.random() * 60)
    );

    const timeString = `${date.getHours().toString().padStart(2, 0)}:${date
      .getMinutes()
      .toString()
      .padStart(2, 0)} ${date.getDate()}/${
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
      // [NEW] Thông tin giao hàng snapshot
      deliveryInfo: deliveryInfo,
      // [NEW] Phương thức thanh toán
      paymentMethod: paymentMethod,
      // Thông tin Drone & Map
      droneId: droneId,
      customerLocation: customerLocation,
      customerAddress: deliveryInfo.address, // Map field này để tương thích ngược
    });
  }

  return orders.sort((a, b) => b.id - a.id);
};

const SEED_ORDERS = generateSeedOrders(1);

// ==============================================================================
// PHẦN 2: DATABASE ENGINE (XỬ LÝ LOCAL STORAGE)
// ==============================================================================

const DB_KEYS = {
  PRODUCTS: "db_products",
  ORDERS: "db_orders",
  CATEGORIES: "db_categories",
  USERS: "db_users",
  STORES: "db_stores",
  WITHDRAWS: "db_withdraws",
  CART: "cart_items",
  DRONES: "db_drones", // Thêm key cho Drones
};

// Helper: Lấy dữ liệu (Nếu chưa có thì lấy từ SEED và lưu vào LS)
const getFromLS = (key, seedData) => {
  if (typeof window === "undefined") return seedData; // SSR safety
  const stored = localStorage.getItem(key);
  if (stored) {
    return JSON.parse(stored);
  } else {
    // Lần đầu tiên chạy: Gieo dữ liệu mẫu vào LS
    localStorage.setItem(key, JSON.stringify(seedData));
    return seedData;
  }
};

// Helper: Lưu dữ liệu
const saveToLS = (key, data) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
};

// Hàm khởi tạo (Gọi 1 lần khi App mount)
export const initializeDatabase = () => {
  // Gọi các hàm getFromLS để kích hoạt việc seed data nếu LS trống
  getFromLS(DB_KEYS.PRODUCTS, SEED_PRODUCTS);
  getFromLS(DB_KEYS.ORDERS, SEED_ORDERS);
  getFromLS(DB_KEYS.CATEGORIES, SEED_CATEGORIES);
  getFromLS(DB_KEYS.USERS, SEED_USERS);
  getFromLS(DB_KEYS.STORES, SEED_STORES);
  getFromLS(DB_KEYS.WITHDRAWS, SEED_WITHDRAW_REQUESTS);
  console.log("⚡ Mock Database initialized!");
};

// --- XUẤT RA CÁC ĐỐI TƯỢNG ĐỂ APP SỬ DỤNG (Fake API) ---

export const db = {
  // 1. PRODUCTS
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

  // 2. ORDERS
  orders: {
    getAll: () => getFromLS(DB_KEYS.ORDERS, SEED_ORDERS),

    updateStatus: (orderId, newStatus) => {
      const list = getFromLS(DB_KEYS.ORDERS, SEED_ORDERS);
      const index = list.findIndex((o) => o.id == orderId);
      if (index !== -1) {
        list[index].orderStatus = newStatus;
        // Nếu hủy đơn thì xóa droneId
        if (newStatus === "CANCELLED") {
          list[index].droneId = null;
        }
        saveToLS(DB_KEYS.ORDERS, list);
        return true;
      }
      return false;
    },

    // [NEW] Hàm gán Drone cho đơn hàng (Dùng cho DroneMap)
    assignDrone: (orderId) => {
      const list = getFromLS(DB_KEYS.ORDERS, SEED_ORDERS);
      const index = list.findIndex((o) => o.id == orderId);
      if (index !== -1) {
        // 1. Chuyển trạng thái sang SHIPPING
        list[index].orderStatus = "SHIPPING";
        // 2. Random một con drone
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
  },

  // 3. CATEGORIES
  categories: {
    getAll: () => getFromLS(DB_KEYS.CATEGORIES, SEED_CATEGORIES),
  },

  // 4. USERS
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
        addresses: [], // [NEW] Khởi tạo mảng địa chỉ rỗng
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
      // Merge data (bao gồm cả addresses nếu có)
      users[index] = { ...users[index], ...updatedUser };
      saveToLS(DB_KEYS.USERS, users);
      return users[index];
    },

    // [MỚI] Hàm xóa User
    delete: (userId) => {
      let list = getFromLS(DB_KEYS.USERS, SEED_USERS);
      const newList = list.filter((u) => u.id !== userId);
      if (list.length === newList.length) throw new Error("User không tồn tại");

      saveToLS(DB_KEYS.USERS, newList);
      return true;
    },
  },

  // 5. STORES (Cập nhật đầy đủ cho chức năng Cài đặt quán)
  stores: {
    getAll: () => {
      const stores = getFromLS(DB_KEYS.STORES, SEED_STORES);
      const orders = getFromLS(DB_KEYS.ORDERS, SEED_ORDERS);

      // Duyệt qua từng store để tính toán lại số liệu
      const calculatedStores = stores.map((store) => {
        // Lấy đơn hàng của store này
        const storeOrders = orders.filter((o) => o.restaurantId === store.id);

        // Lấy đơn hàng đã hoàn thành để tính doanh thu
        const completedOrders = storeOrders.filter(
          (o) => o.orderStatus === "COMPLETED"
        );

        // Tính tổng tiền
        const realRevenue = completedOrders.reduce(
          (sum, o) => sum + (o.totalPrice || 0),
          0
        );

        return {
          ...store,
          totalOrders: storeOrders.length,
          revenue: realRevenue, // Ghi đè revenue ảo bằng số liệu thật
        };
      });

      return calculatedStores;
    },
    getOne: (storeId) => {
      // Gọi getAll để đảm bảo lấy được thông tin đã tính toán doanh thu
      const list = db.stores.getAll();
      return list.find((s) => s.id === storeId);
    },
    // [MỚI] Hàm thêm cửa hàng
    add: (newStore) => {
      const list = getFromLS(DB_KEYS.STORES, SEED_STORES);
      // Sinh ID mới: RES-03, RES-04...
      const nextId = "RES-" + String(list.length + 1).padStart(2, "0");

      const storeWithId = {
        id: nextId,
        ...newStore,
        joinedAt: new Date().toISOString(), // Ngày tạo
        revenue: 0, // Doanh thu mặc định
        totalOrders: 0,
        location: newStore.location || [10.776019, 106.702068], // Mặc định toạ độ nếu chưa chọn
      };

      list.push(storeWithId);
      saveToLS(DB_KEYS.STORES, list);
      return storeWithId;
    },
    // Hàm update đã có
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
    // [MỚI] Hàm xóa Store
    delete: (storeId) => {
      let list = getFromLS(DB_KEYS.STORES, SEED_STORES);
      const newList = list.filter((s) => s.id !== storeId);
      if (list.length === newList.length)
        throw new Error("Cửa hàng không tồn tại");

      saveToLS(DB_KEYS.STORES, newList);
      return true;
    },
  },

  // 6. WITHDRAWS
  withdraws: {
    getAll: () => getFromLS(DB_KEYS.WITHDRAWS, SEED_WITHDRAW_REQUESTS),
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
