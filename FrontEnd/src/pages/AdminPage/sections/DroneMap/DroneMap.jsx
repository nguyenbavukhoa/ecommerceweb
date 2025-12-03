import React, { useState, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./DroneMap.module.scss";

// Services & Context
import { useAuth } from "../../../../context/AuthContext";
import { useToast } from "../../../../context/ToastContext";
import { useQuery } from "@tanstack/react-query";
import droneService from "../../../../services/droneService";
import deliveryService from "../../../../services/deliveryService";
import orderService from "../../../../services/orderService";
import storeService from "../../../../services/storeService";
import { SEED_HUBS } from "../../../../data/mockData";
import { vnd } from "../../utils";

// --- ICONS ---
const droneIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});
const storeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});
const customerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});
const hubIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/921/921347.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Component cập nhật View bản đồ
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 14);
    const timer = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(timer);
  }, [map, center]);
  return null;
};

const DroneMap = () => {
  const { auth: currentUser } = useAuth();
  const { showToast } = useToast();
  const storeId =
    localStorage.getItem("currentStoreId") || currentUser?.storeId || 1;

  // --- STATE ---
  const [activeTab, setActiveTab] = useState("pending"); // "pending" (Chuẩn bị) | "flying" (Đang bay)
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingData, setTrackingData] = useState(null); // Dữ liệu tracking chi tiết
  const [searchTerm, setSearchTerm] = useState("");

  // --- 1. DATA FETCHING ---

  // Lấy thông tin Store
  const { data: store } = useQuery({
    queryKey: ["storeInfo", storeId],
    queryFn: async () => {
      const stores = await storeService.getAll();
      return (
        stores.find((s) => s.id.toString() === storeId.toString()) || stores[0]
      );
    },
    staleTime: Infinity,
  });

  // Lấy danh sách Drone (Polling 1s để thấy bay realtime)
  const { data: drones = [], refetch: refetchDrones } = useQuery({
    queryKey: ["drones"],
    queryFn: async () => await droneService.getAllDrones(),
    refetchInterval: 1000,
  });

  // Lấy danh sách Đơn hàng (Polling 2s)
  const { data: orders = [], refetch: refetchOrders } = useQuery({
    queryKey: ["droneMapOrders", storeId], // Đổi key để không trùng cache
    queryFn: async () => {
      // Gọi hàm mới chuyên dụng
      return await orderService.getAllOrdersForMap(storeId);
    },
    refetchInterval: 2000, // Vẫn polling để cập nhật trạng thái đơn mới
  });

  // --- 2. TRACKING LOGIC (Khi chọn đơn đang bay) ---
  useEffect(() => {
    let intervalId;

    // Chỉ tracking khi đang ở tab "Đang bay" và đã chọn đơn
    if (activeTab === "flying" && selectedOrder) {
      // Lấy deliveryId từ LocalStorage (đã lưu lúc tạo)
      const deliveryMap = JSON.parse(
        localStorage.getItem("deliveryMap") || "{}"
      );
      const deliveryId = deliveryMap[selectedOrder.id];

      if (deliveryId) {
        // Polling API Tracking riêng cho đơn này
        intervalId = setInterval(async () => {
          try {
            const trackRes = await deliveryService.getDeliveryTracking(
              deliveryId
            );
            if (trackRes) setTrackingData(trackRes);
          } catch (e) {
            console.error("Tracking error", e);
          }
        }, 1000);
      } else {
        // Nếu không có deliveryId (do F5 mất hoặc tạo ở máy khác),
        // ta sẽ fallback: Tìm drone nào đang có currentOrderId == selectedOrder.id
        const linkedDrone = drones.find(
          (d) => d.currentOrderId === selectedOrder.id
        );
        if (linkedDrone) {
          setTrackingData({
            currentLat: linkedDrone.currentLat,
            currentLng: linkedDrone.currentLng,
            status: linkedDrone.status,
            // Mock các field khác nếu API list drone ko có
            progressPct: 50,
          });
        }
      }
    } else {
      setTrackingData(null);
    }

    return () => clearInterval(intervalId);
  }, [selectedOrder, activeTab, drones]);

  // --- 3. HANDLER: GỌI DRONE (CREATE DELIVERY) ---
  const handleCallDrone = async (e, order) => {
    e.stopPropagation();
    try {
      // B1: Tìm Drone rảnh
      const candidates = await droneService.getCandidateDrones(15, storeId);
      if (!candidates || candidates.length === 0) {
        showToast({
          title: "Lỗi",
          message: "Không có Drone rảnh!",
          type: "error",
        });
        return;
      }

      const selectedDrone = candidates[0];

      // B2: Tạo Delivery
      const res = await deliveryService.createDelivery(
        order.id,
        selectedDrone.id
      );

      // B3: [QUAN TRỌNG] Lưu Delivery ID vào LocalStorage để dùng cho Tracking
      // API trả về data: { id: 11, ... }
      const newDeliveryId = res.data?.id || res.id;

      if (newDeliveryId) {
        const currentMap = JSON.parse(
          localStorage.getItem("deliveryMap") || "{}"
        );
        currentMap[order.id] = newDeliveryId;
        localStorage.setItem("deliveryMap", JSON.stringify(currentMap));
      }

      showToast({
        title: "Thành công",
        message: `Drone ${selectedDrone.serial} bắt đầu giao!`,
        type: "success",
      });

      // B4: Refresh và chuyển tab
      refetchOrders();
      refetchDrones();
      setActiveTab("flying"); // Chuyển ngay sang tab Đang bay
      setSelectedOrder(order); // Tự động chọn đơn vừa tạo để track luôn
    } catch (err) {
      showToast({
        title: "Lỗi",
        message: "Điều phối thất bại.",
        type: "error",
      });
    }
  };

  // --- 4. FILTERING (Phân loại đơn theo 2 Tab) ---
  const filteredOrders = useMemo(() => {
    let list = orders;

    // Lọc theo Tab
    if (activeTab === "pending") {
      // CHUẨN BỊ BAY: Placed, Confirmed, Ready
      list = list.filter((o) =>
        ["PLACED", "CONFIRMED", "READY_FOR_DELIVERY"].includes(o.orderStatus)
      );
    } else if (activeTab === "flying") {
      // ĐANG BAY: In Progress, Shipping, Out For Delivery
      list = list.filter((o) =>
        ["IN_PROGRESS", "SHIPPING", "OUT_FOR_DELIVERY"].includes(o.orderStatus)
      );
    } else {
      // Lịch sử (nếu cần)
      list = list.filter((o) =>
        ["COMPLETED", "DELIVERED", "CANCELLED", "FAILED"].includes(
          o.orderStatus
        )
      );
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter((o) => o.id.toString().includes(lower));
    }
    return list.sort((a, b) => b.id - a.id);
  }, [orders, activeTab, searchTerm]);

  // --- RENDER ---
  if (!store) return <div>Loading Map...</div>;

  const defaultCenter = [store.lat || 10.776019, store.lng || 106.702068];

  // Center Map: Nếu đang track thì theo drone, không thì theo store
  const mapCenter = trackingData
    ? [trackingData.currentLat, trackingData.currentLng]
    : selectedOrder?.customerLocation || defaultCenter;

  return (
    <div className={styles.container}>
      {/* SIDEBAR */}
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h2 className={styles.title}>Điều phối Drone</h2>
          {/* Search box giữ nguyên */}
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Tìm mã đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 2 TAB CHÍNH */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "pending" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveTab("pending");
              setSelectedOrder(null);
              setTrackingData(null);
            }}
          >
            Chuẩn bị bay
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "flying" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveTab("flying");
              setSelectedOrder(null);
            }}
          >
            Đang bay
          </button>
        </div>

        <div className={styles.list}>
          {filteredOrders.length === 0 ? (
            <div className={styles.empty}>Không có đơn hàng.</div>
          ) : (
            filteredOrders.map((order) => {
              const isSelected = selectedOrder?.id === order.id;

              // Tìm tên Drone nếu đang bay
              const linkedDrone = drones.find(
                (d) => d.currentOrderId === order.id || d.id === order.droneId
              );

              return (
                <div
                  key={order.id}
                  className={`${styles.card} ${
                    isSelected ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className={styles.cardTop}>
                    <span className={styles.oid}>#{order.id}</span>
                    <span className={styles.price}>
                      {vnd(order.totalPrice)}
                    </span>
                  </div>
                  <div className={styles.cardInfo}>
                    📍 {order.customerAddress || order.deliveryInfo?.address}
                  </div>

                  {/* Tag hiển thị Drone đang giao */}
                  {activeTab === "flying" && linkedDrone && (
                    <div className={styles.droneTag}>
                      🚁 {linkedDrone.serial}
                    </div>
                  )}

                  {/* Nút Gọi Drone (Chỉ hiện ở Tab Pending) */}
                  {activeTab === "pending" && (
                    <button
                      className={styles.btnCall}
                      onClick={(e) => handleCallDrone(e, order)}
                    >
                      🚀 Cho bay ngay
                    </button>
                  )}

                  {/* Panel Tracking Mini (Chỉ hiện khi chọn ở Tab Flying) */}
                  {isSelected && activeTab === "flying" && trackingData && (
                    <div className={styles.trackingInfo}>
                      <p>Tiến độ: {trackingData.progressPct?.toFixed(0)}%</p>
                      <p>Tốc độ: {linkedDrone?.avgSpeedKmh || 35} km/h</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MAP WRAPPER */}
      <div className={styles.mapWrapper}>
        <MapContainer
          center={defaultCenter}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
        >
          <MapUpdater center={mapCenter} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* 1. STORE & HUB */}
          <Marker position={defaultCenter} icon={storeIcon}>
            <Popup>
              <b>{store.name}</b>
            </Popup>
          </Marker>
          {/* {SEED_HUBS.map((h) => (
            <Marker key={h.id} position={h.location} icon={hubIcon} />
          ))} */}

          {/* 2. VẼ DRONE */}
          {/* Nếu đang chọn 1 đơn đang bay -> Vẽ chi tiết Tracking (Line, Customer) */}
          {activeTab === "flying" && selectedOrder && trackingData ? (
            <>
              {/* Drone đang track */}
              <Marker
                position={[trackingData.currentLat, trackingData.currentLng]}
                icon={droneIcon}
              >
                <Popup>Đang giao đơn #{selectedOrder.id}</Popup>
              </Marker>

              {/* Khách hàng */}
              <Marker
                position={[trackingData.endLat, trackingData.endLng]}
                icon={customerIcon}
              >
                <Popup>Khách hàng</Popup>
              </Marker>

              {/* Đường bay */}
              <Polyline
                positions={[
                  [
                    store.lat || defaultCenter[0],
                    store.lng || defaultCenter[1],
                  ],
                  [trackingData.currentLat, trackingData.currentLng],
                  [trackingData.endLat, trackingData.endLng],
                ]}
                color="#e74c3c"
                weight={4}
                dashArray="10, 5"
              />
            </>
          ) : (
            // Nếu không chọn đơn cụ thể, vẽ tất cả Drone ở vị trí hiện tại (từ API list)
            drones.map((d) => {
              const lat = d.currentLat || SEED_HUBS[0].location[0];
              const lng = d.currentLng || SEED_HUBS[0].location[1];
              return (
                <Marker
                  key={d.id}
                  position={[lat, lng]}
                  icon={droneIcon}
                  opacity={0.7}
                >
                  <Popup>
                    {d.serial} ({d.status})
                  </Popup>
                </Marker>
              );
            })
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default DroneMap;
