// src/services/dbService.js
import axios from "axios";

// ==============================================================================
// CẤU HÌNH KẾT NỐI SERVER
// ==============================================================================

// [QUAN TRỌNG]: Khi chạy demo LAN, đổi "localhost" thành IP máy của bạn
const API_URL = "http://192.168.97.114:4000"; // Địa chỉ JSON Server

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Helper rút gọn để lấy data từ response
const getData = (res) => res.data;

// ==============================================================================
// CÁC HẰNG SỐ & HELPER
// ==============================================================================

export const STATUSES = [
  { id: "pending", label: "Chờ xác nhận", iconClass: "fas fa-hourglass-half" },
  { id: "picking", label: "Đang lấy hàng", iconClass: "fas fa-box-open" },
  { id: "shipping", label: "Đang vận chuyển", iconClass: "fas fa-truck" },
  { id: "delivered", label: "Đã giao", iconClass: "fas fa-check-circle" },
  { id: "returned", label: "Hoàn trả", iconClass: "fas fa-undo-alt" },
  { id: "cancelled", label: "Đã huỷ", iconClass: "fas fa-ban" },
];

export const HUB_LOCATION = [10.762622, 106.660172]; // Trạm sạc trung tâm (Q10)

export const SEED_HUBS = [
  {
    id: "HUB-01",
    name: "Trạm Trung Tâm (Q10)",
    location: [10.762622, 106.660172],
  },
  { id: "HUB-02", name: "Trạm Phụ (Q5)", location: [10.754622, 106.665172] },
  { id: "HUB-03", name: "Trạm Bắc (Q3)", location: [10.772622, 106.670172] },
];

// Helper tính khoảng cách giữa 2 điểm (đơn vị tọa độ)
const getDistance = (p1, p2) => {
  const dLat = p1[0] - p2[0];
  const dLng = p1[1] - p2[1];
  return Math.sqrt(dLat * dLat + dLng * dLng);
};

// Helper di chuyển
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

// Helper tạo log mới
const createLog = (message) => ({
  time: new Date().toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }),
  message: message,
});

// ==============================================================================
// DATABASE SERVICE
// ==============================================================================

export const db = {
  // --- 1. SẢN PHẨM ---
  products: {
    getAll: async () => getData(await api.get("/products")),
    getOne: async (id) => getData(await api.get(`/products/${id}`)),
    add: async (product) => getData(await api.post("/products", product)),
    update: async (id, data) =>
      getData(await api.patch(`/products/${id}`, data)),
  },

  // --- 2. ĐƠN HÀNG ---
  orders: {
    getAll: async () => getData(await api.get("/orders")),

    add: async (order) => getData(await api.post("/orders", order)),

    updateStatus: async (orderId, newStatus) => {
      const patchData = { orderStatus: newStatus };
      if (newStatus === "CANCELLED") {
        patchData.droneId = null;
      }
      return getData(await api.patch(`/orders/${orderId}`, patchData));
    },

    assignDrone: async (orderId) => {
      // Logic cũ (Random) - Có thể bỏ qua nếu dùng dispatchDrone
      const drones = getData(await api.get("/drones"));
      const randomDrone = drones[Math.floor(Math.random() * drones.length)];
      return getData(
        await api.patch(`/orders/${orderId}`, {
          orderStatus: "SHIPPING",
          droneId: randomDrone.id,
        })
      );
    },

    // [NÂNG CẤP] ĐIỀU PHỐI THÔNG MINH (CÓ TÍNH TOÁN PIN)
    dispatchDrone: async (orderId) => {
      const [order, drones] = await Promise.all([
        getData(await api.get(`/orders/${orderId}`)),
        getData(await api.get("/drones")),
      ]);
      const store = getData(await api.get(`/stores/${order.restaurantId}`));

      // Tính tổng quãng đường để làm mốc so sánh %
      const startPos = store.location;
      const endPos = order.customerLocation;
      const totalDistance = getDistance(startPos, endPos);

      // Tìm Drone (Giữ nguyên logic cũ)
      const requiredBattery = Math.ceil(totalDistance * 300);
      const availableDrone = drones.find(
        (d) =>
          (d.status === "ready" || d.status === "charging") &&
          d.battery >= requiredBattery
      );

      if (!availableDrone) throw new Error("Không có Drone khả dụng.");

      // Cập nhật Drone
      const updateDronePromise = api.patch(`/drones/${availableDrone.id}`, {
        status: "moving_to_store",
        currentOrderId: orderId,
        // Reset về vị trí Drone đang đứng (đã sửa ở câu trả lời trước)
      });

      // Cập nhật Order: Thêm trackingLogs ban đầu + totalDistance
      const trackingCode = `IV-${orderId}-${availableDrone.id.split("-")[1]}`; // VD: IV-2299-005

      const updateOrderPromise = api.patch(`/orders/${orderId}`, {
        orderStatus: "PICKING",
        droneId: availableDrone.id,
        trackingCode: trackingCode, // [MỚI] Mã vận đơn
        totalDistance: totalDistance, // [MỚI] Để tính %
        trackingLogs: [
          // [MỚI] Lịch sử vận chuyển
          createLog(`Đã điều phối Drone ${availableDrone.name}.`),
          createLog("Tài xế Drone đang đến lấy hàng."),
        ],
      });

      await Promise.all([updateDronePromise, updateOrderPromise]);
      return {
        ...availableDrone,
        status: "moving_to_store",
        currentOrderId: orderId,
      };
    },
  },

  // --- 3. DANH MỤC ---
  categories: {
    getAll: async () => getData(await api.get("/categories")),
  },

  // --- 4. CART ---
  cart: {
    getUserCart: async (userId) => {
      const res = await api.get(`/carts?userId=${userId}`);
      return res.data.length > 0 ? res.data[0] : null;
    },
    createCart: async (userId, items = []) => {
      const newCart = {
        id: `cart_${userId}`,
        userId: userId,
        items: items,
        updatedAt: Date.now(),
      };
      return getData(await api.post("/carts", newCart));
    },
    updateCartItems: async (cartId, items) => {
      return getData(
        await api.patch(`/carts/${cartId}`, {
          items: items,
          updatedAt: Date.now(),
        })
      );
    },
  },

  // --- 5. USERS ---
  users: {
    getAll: async () => getData(await api.get("/users")),
    getOne: async (id) => getData(await api.get(`/users/${id}`)),
    login: async (email) => {
      const res = await api.get(`/users?email=${email}`);
      return res.data.length > 0 ? res.data[0] : null;
    },
    create: async (newUser) => {
      const existing = await db.users.login(newUser.email);
      if (existing) throw new Error("Email đã tồn tại.");
      const fullNewUser = {
        id: "USER-" + Date.now(),
        userType: 0,
        role: "user",
        status: true,
        addresses: [],
        ...newUser,
      };
      return getData(await api.post("/users", fullNewUser));
    },
    update: async (updatedUser) =>
      getData(await api.patch(`/users/${updatedUser.id}`, updatedUser)),
    delete: async (userId) => getData(await api.delete(`/users/${userId}`)),
  },

  // --- 6. STORES ---
  stores: {
    getAll: async () => {
      const [stores, orders] = await Promise.all([
        getData(await api.get("/stores")),
        getData(await api.get("/orders")),
      ]);
      return stores.map((store) => {
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
    },
    getOne: async (id) => getData(await api.get(`/stores/${id}`)),
    add: async (newStore) =>
      getData(
        await api.post("/stores", {
          ...newStore,
          joinedAt: new Date().toISOString(),
        })
      ),
    update: async (id, data) => getData(await api.patch(`/stores/${id}`, data)),
    delete: async (id) => getData(await api.delete(`/stores/${id}`)),
  },

  // --- 7. WITHDRAWS ---
  withdraws: {
    getAll: async () => getData(await api.get("/withdraws")),
    create: async (requestData) => {
      const newRequest = {
        id: "WD-" + Date.now(),
        status: "pending",
        requestDate: new Date().toLocaleString("vi-VN"),
        ...requestData,
      };
      return getData(await api.post("/withdraws", newRequest));
    },
    updateStatus: async (id, newStatus) =>
      getData(await api.patch(`/withdraws/${id}`, { status: newStatus })),
  },

  // --- 8. WALLET ---
  wallet: {
    getStats: async (storeId) => {
      const [orders, withdraws] = await Promise.all([
        getData(
          await api.get(`/orders?restaurantId=${storeId}&orderStatus=COMPLETED`)
        ),
        getData(await api.get(`/withdraws?storeId=${storeId}`)),
      ]);
      const totalRevenue = orders.reduce(
        (sum, o) => sum + (o.totalPrice || 0),
        0
      );
      const totalWithdrawn = withdraws
        .filter((w) => w.status === "approved")
        .reduce((sum, w) => sum + Number(w.amount), 0);
      const totalPending = withdraws
        .filter((w) => w.status === "pending")
        .reduce((sum, w) => sum + Number(w.amount), 0);
      return {
        totalRevenue,
        totalWithdrawn,
        totalPending,
        availableBalance: totalRevenue - totalWithdrawn - totalPending,
        history: withdraws,
      };
    },
    getSystemStats: async () => {
      const [orders, withdraws] = await Promise.all([
        getData(await api.get("/orders?orderStatus=COMPLETED")),
        getData(await api.get("/withdraws")),
      ]);
      const totalRevenueSystem = orders.reduce(
        (sum, o) => sum + (o.totalPrice || 0),
        0
      );
      const totalPaid = withdraws
        .filter((w) => w.status === "approved")
        .reduce((sum, w) => sum + Number(w.amount), 0);
      const totalPending = withdraws
        .filter((w) => w.status === "pending")
        .reduce((sum, w) => sum + Number(w.amount), 0);
      return {
        totalRevenueSystem,
        totalPaid,
        totalPending,
        currentHolding: totalRevenueSystem - totalPaid,
      };
    },
  },

  // --- 9. DRONES (LOGIC BAY) ---
  drones: {
    getAll: async () => getData(await api.get("/drones")),

    create: async (data) => {
      const list = getData(await api.get("/drones"));
      const lastId =
        list.length > 0 ? parseInt(list[list.length - 1].id.split("-")[1]) : 0;
      const newId = `DR-${String(lastId + 1).padStart(3, "0")}`;

      // 1. Lấy danh sách Store để tra cứu tọa độ
      const stores = getData(await api.get("/stores"));

      // 2. Tìm tọa độ dựa trên tên địa điểm người dùng chọn (data.currentLocation)
      // Hàm findCoordinateByName logic như sau:
      let startCoords = HUB_LOCATION; // Mặc định

      // Tìm trong Hub có sẵn
      const foundHub = SEED_HUBS.find((h) => h.name === data.currentLocation);
      if (foundHub) {
        startCoords = foundHub.location;
      } else {
        // Tìm trong Store
        const foundStore = stores.find((s) => s.name === data.currentLocation);
        if (foundStore) {
          startCoords = foundStore.location;
        }
      }

      const newDrone = {
        id: newId,
        ...data,
        currentLat: startCoords[0], // Set tọa độ theo vị trí chọn
        currentLng: startCoords[1],
        lastUpdate: Date.now(),
      };
      return getData(await api.post("/drones", newDrone));
    },
    update: async (id, data) => getData(await api.patch(`/drones/${id}`, data)),
    delete: async (id) => getData(await api.delete(`/drones/${id}`)),

    // PROCESS SIMULATION TICK
    processSimulationTick: async () => {
      const [drones, orders, stores] = await Promise.all([
        getData(await api.get("/drones")),
        getData(await api.get("/orders")),
        getData(await api.get("/stores")),
      ]);

      const now = Date.now();
      const updates = [];
      const SPEED = 0.00008;

      for (const drone of drones) {
        if (now - (drone.lastUpdate || 0) < 50) continue;
        if (["ready", "charging", "maintenance"].includes(drone.status))
          continue;

        const order = orders.find((o) => o.id === drone.currentOrderId);
        if (!order) continue;

        const currentPos = [drone.currentLat, drone.currentLng];
        let target = HUB_LOCATION;
        let nextStatus = drone.status;
        let orderStatusChanged = null;

        // Mảng chứa các log mới sẽ thêm vào đợt này
        let logsToAdd = [];

        // 1. ĐANG ĐI LẤY HÀNG
        if (drone.status === "moving_to_store") {
          const store = stores.find((s) => s.id === order.restaurantId);
          target = store ? store.location : HUB_LOCATION;

          if (getDistance(currentPos, target) < 0.0005) {
            nextStatus = "delivering";
            orderStatusChanged = "SHIPPING";
            logsToAdd.push("Đã lấy món ăn tại nhà hàng. Bắt đầu giao đến bạn.");
          }
        }
        // 2. ĐANG GIAO HÀNG (SỬA LOGIC % TẠI ĐÂY)
        else if (drone.status === "delivering") {
          target = order.customerLocation;
          const distRemaining = getDistance(currentPos, target);

          // Lấy tổng quãng đường (đã lưu lúc dispatch) hoặc tính lại nếu thiếu
          const totalDist =
            order.totalDistance || getDistance(target, HUB_LOCATION) * 2; // Fallback

          // Tính % đã đi được (0.0 -> 1.0)
          const percent = 1 - distRemaining / totalDist;

          // Lấy danh sách log hiện tại để kiểm tra trùng lặp
          const existingLogs = order.trackingLogs || [];

          // Định nghĩa các mốc quan trọng
          const milestones = [
            { p: 0.25, msg: "Drone đã đi được 1/4 quãng đường." },
            { p: 0.5, msg: "Drone đã đi được một nửa quãng đường (50%)." },
            { p: 0.75, msg: "Tài xế Drone đã đi được 3/4 quãng đường." },
            {
              p: 0.9,
              msg: "Drone đang ở rất gần bạn, vui lòng chú ý điện thoại.",
            },
          ];

          milestones.forEach((m) => {
            // Điều kiện:
            // 1. Đã vượt qua mốc % (percent > m.p)
            // 2. Chưa từng log tin nhắn này trước đây (!some...)
            // 3. Chưa nằm trong danh sách chuẩn bị add (!includes...)
            if (percent >= m.p) {
              const isLogged =
                existingLogs.some((log) => log.message === m.msg) ||
                logsToAdd.includes(m.msg);
              if (!isLogged) {
                logsToAdd.push(m.msg);
              }
            }
          });

          // Đến nơi
          if (distRemaining < 0.0005) {
            nextStatus = "returning";
            orderStatusChanged = "COMPLETED";
            logsToAdd.push("Giao hàng thành công! Chúc bạn ngon miệng.");
          }
        }
        // 3. QUAY VỀ
        else if (drone.status === "returning") {
          const nearest = getNearestSafePoint(currentPos, SEED_HUBS, stores);
          target = nearest.location;
          if (getDistance(currentPos, target) < 0.0005) {
            nextStatus = "charging";
            updates.push(
              api.patch(`/drones/${drone.id}`, {
                currentOrderId: null,
                currentLocation: nearest.name,
              })
            );
          }
        }

        // --- UPDATE DATA ---
        const newPos = moveTowards(
          drone.currentLat,
          drone.currentLng,
          target[0],
          target[1],
          SPEED
        );

        // Hao pin
        let newBattery = drone.battery;
        if (Math.random() < 0.02 && newBattery > 0) newBattery -= 1;

        updates.push(
          api.patch(`/drones/${drone.id}`, {
            currentLat: newPos[0],
            currentLng: newPos[1],
            status: nextStatus,
            battery: newBattery,
            lastUpdate: now,
          })
        );

        // Chỉ gọi API update Order nếu CÓ THAY ĐỔI (để tránh spam server)
        if (orderStatusChanged || logsToAdd.length > 0) {
          const patchData = {};
          if (orderStatusChanged) patchData.orderStatus = orderStatusChanged;

          if (logsToAdd.length > 0) {
            // Nối log cũ + log mới (đã convert sang object có time)
            const oldLogs = order.trackingLogs || [];
            const newLogObjects = logsToAdd.map((msg) => createLog(msg));
            patchData.trackingLogs = [...oldLogs, ...newLogObjects];
          }
          updates.push(api.patch(`/orders/${order.id}`, patchData));
        }
      }

      if (updates.length > 0) await Promise.all(updates);
      return drones;
    },

    recallAll: async () => {
      const drones = getData(await api.get("/drones"));
      const updates = drones.map((d) =>
        api.patch(`/drones/${d.id}`, {
          status: d.status === "maintenance" ? "maintenance" : "ready",
          currentLat: HUB_LOCATION[0],
          currentLng: HUB_LOCATION[1],
          currentOrderId: null,
        })
      );
      await Promise.all(updates);
      return true;
    },
  },
  // --- 10. NOTIFICATIONS (MỚI) ---
  notifications: {
    // Lấy thông báo của riêng User đó
    getByUser: async (userId) => {
      const res = await api.get(
        `/notifications?userId=${userId}&_sort=createdAt&_order=desc`
      );
      return getData(res);
    },

    // Tạo thông báo mới (Lưu vào DB)
    create: async (notifData) => {
      const newNotif = {
        id: "NOTIF-" + Date.now(),
        createdAt: Date.now(),
        isRead: false,
        ...notifData, // Phải chứa userId
      };
      return getData(await api.post("/notifications", newNotif));
    },

    // Đánh dấu đã đọc
    markRead: async (id) => {
      return getData(await api.patch(`/notifications/${id}`, { isRead: true }));
    },

    // Đánh dấu tất cả là đã đọc của 1 user
    markAllRead: async (userId) => {
      // JSON Server không hỗ trợ update batch, nên phải làm thủ công hoặc dùng loop
      // Ở đây làm đơn giản phía Client UI, còn API gọi từng cái hoặc để sau
      const userNotifs = await db.notifications.getByUser(userId);
      const unread = userNotifs.filter((n) => !n.isRead);
      await Promise.all(
        unread.map((n) => api.patch(`/notifications/${n.id}`, { isRead: true }))
      );
      return true;
    },
  },
};

// [MỚI] Hàm tìm điểm đỗ (Hub hoặc Store) gần nhất
const getNearestSafePoint = (currentPos, hubs, stores) => {
  // 1. Gộp danh sách Hub và Store thành 1 danh sách các "Điểm an toàn"
  const safePoints = [
    ...hubs.map((h) => ({ ...h, type: "hub" })),
    ...stores.map((s) => ({ ...s, type: "store" })), // Coi Store như một trạm đỗ
  ];

  let nearestPoint = hubs[0]; // Mặc định là Hub đầu tiên
  let minDistance = Number.MAX_VALUE;

  // 2. Duyệt qua tất cả để tìm điểm gần nhất
  safePoints.forEach((point) => {
    // Kiểm tra data hợp lệ (phải có location)
    if (point.location && Array.isArray(point.location)) {
      const dist = getDistance(currentPos, point.location);
      if (dist < minDistance) {
        minDistance = dist;
        nearestPoint = point;
      }
    }
  });

  return nearestPoint;
};

// Export dummy
export const MOCK_PRODUCTS = [];
export const MOCK_ORDERS = [];
export const ALL_ORDERS = [];
export const MOCK_CATEGORIES = [];
export const MOCK_USERS = [];
export const MOCK_STORES = [];
export const MOCK_WITHDRAW_REQUESTS = [];
export const MOCK_CART_ITEMS = [];
