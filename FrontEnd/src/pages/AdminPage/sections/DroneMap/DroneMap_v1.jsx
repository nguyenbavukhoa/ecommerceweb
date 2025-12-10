// src/pages/ServerPage/sections/Drones/DroneMap.jsx
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
import { useAuth } from "../../../../context/AuthContext";
import { useToast } from "../../../../context/ToastContext";
import { db, SEED_HUBS } from "../../../../data/mockData";
import { useQuery } from "@tanstack/react-query";
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

// Component ép Map vẽ lại
const MapUpdater = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

// Hàm parse ngày
const parseOrderDate = (timeStr) => {
  if (!timeStr) return new Date();
  const [time, date] = timeStr.split(" ");
  const [d, m, y] = date.split("/");
  return new Date(`${y}-${m}-${d}`);
};

const getTodayString = () => {
  return new Date().toISOString().split("T")[0];
};

const DroneMap = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const storeId = user?.storeId || "RES-01";

  // State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getTodayString());

  // Local State cho Drone để animation mượt
  const [localDrones, setLocalDrones] = useState([]);

  // Queries
  const { data: store } = useQuery({
    queryKey: ["storeInfo", storeId],
    queryFn: () => db.stores.getOne(storeId),
  });

  // Lấy TOÀN BỘ đơn hàng của quán (để vẽ map kể cả khi đơn đã completed)
  const { data: orders = [], refetch: refetchOrders } = useQuery({
    queryKey: ["storeOrders", storeId],
    queryFn: () => db.orders.getAll().filter((o) => o.restaurantId === storeId),
    refetchInterval: 2000,
  });

  // --- [FIX] SIMULATION ENGINE ĐỒNG BỘ ---
  // Sử dụng hàm chung processSimulationTick của mockData
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Gọi hàm xử lý tập trung (Nó sẽ check timestamp để không xung đột với Server Admin)
      const updatedDrones = db.drones.processSimulationTick();

      // 2. Cập nhật state nội bộ để vẽ Map ngay lập tức
      if (updatedDrones) {
        setLocalDrones(updatedDrones);
      } else {
        // Nếu không có update (đứng yên), lấy dữ liệu hiện tại
        setLocalDrones(db.drones.getAll());
      }
    }, 100); // 10 FPS cho mượt

    return () => clearInterval(interval);
  }, []);

  // Sync refetch order thưa hơn
  useEffect(() => {
    const interval = setInterval(() => {
      refetchOrders();
    }, 2000);
    return () => clearInterval(interval);
  }, [refetchOrders]);

  // Handlers
  const handleCallDrone = (e, order) => {
    e.stopPropagation();
    try {
      db.orders.dispatchDrone(order.id);
      showToast({
        title: "Thành công",
        message: "Đã điều phối Drone!",
        type: "success",
      });
      refetchOrders();
    } catch (err) {
      showToast({ title: "Lỗi", message: err.message, type: "error" });
    }
  };

  // --- FILTERING (Cho Sidebar) ---
  const filteredOrders = useMemo(() => {
    let list = orders;
    if (activeTab === "pending")
      list = list.filter((o) => o.orderStatus === "CONFIRMED");
    else if (activeTab === "active")
      list = list.filter((o) =>
        ["PICKING", "SHIPPING"].includes(o.orderStatus)
      );
    else if (activeTab === "history")
      list = list.filter((o) =>
        ["COMPLETED", "CANCELLED"].includes(o.orderStatus)
      );

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toString().includes(lower) ||
          o.deliveryInfo?.name?.toLowerCase().includes(lower)
      );
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      list = list.filter((o) => {
        const orderDate = parseOrderDate(o.orderTime);
        return orderDate >= start && orderDate <= end;
      });
    }
    return list.sort((a, b) => b.id - a.id);
  }, [orders, activeTab, searchTerm, startDate, endDate]);

  const getDroneInfo = (order) => {
    if (!order.droneId) return null;
    const drone = localDrones.find((d) => d.id === order.droneId); // Dùng localDrones
    return drone ? drone.name : "Unknown Drone";
  };

  if (!store) return <div>Loading Store...</div>;

  return (
    <div className={styles.container}>
      {/* SIDEBAR (Giữ nguyên) */}
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h2 className={styles.title}>Quản lý Giao hàng</h2>
          <div className={styles.searchBox}>
            <i className="fa-light fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Tìm mã đơn, tên khách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.dateFilter}>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span>-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "pending" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Chờ giao
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "active" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("active")}
          >
            Đang giao
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "history" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("history")}
          >
            Lịch sử
          </button>
        </div>

        <div className={styles.list}>
          {filteredOrders.length === 0 ? (
            <div className={styles.empty}>Không có đơn hàng.</div>
          ) : (
            filteredOrders.map((order) => {
              const droneName = getDroneInfo(order);
              return (
                <div
                  key={order.id}
                  className={`${styles.card} ${
                    selectedOrder?.id === order.id ? styles.selected : ""
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
                    <i className="fa-solid fa-clock"></i> {order.orderTime}
                  </div>
                  <div className={styles.cardInfo}>
                    <i className="fa-solid fa-location-dot"></i>{" "}
                    {order.customerAddress || "Khách vãng lai"}
                  </div>
                  {droneName && (
                    <div className={styles.droneTag}>
                      <i className="fa-solid fa-robot"></i> {droneName}
                    </div>
                  )}

                  {activeTab === "pending" && (
                    <button
                      className={styles.btnCall}
                      onClick={(e) => handleCallDrone(e, order)}
                    >
                      <i className="fa-solid fa-paper-plane"></i> Gọi Drone ngay
                    </button>
                  )}
                  {activeTab !== "pending" && (
                    <div
                      className={`${styles.statusBadge} ${
                        styles[order.orderStatus.toLowerCase()]
                      }`}
                    >
                      {order.orderStatus}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MAP */}
      <div className={styles.mapWrapper}>
        <MapContainer
          center={store.location}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
        >
          <MapUpdater />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* STORE & HUBS */}
          <Marker position={store.location} icon={storeIcon}>
            <Popup>
              <b>{store.name}</b>
            </Popup>
          </Marker>
          {SEED_HUBS.map((hub) => (
            <Marker key={hub.id} position={hub.location} icon={hubIcon}>
              <Popup>
                <b>{hub.name}</b>
              </Popup>
            </Marker>
          ))}

          {/* [FIX QUAN TRỌNG] VẼ DRONES & ĐƯỜNG BAY */}
          {/* Lặp qua localDrones để vẽ tất cả drone đang hoạt động liên quan đến quán */}
          {localDrones.map((drone) => {
            // Kiểm tra Drone này có đang phục vụ quán không (dựa trên orderId)
            const order = orders.find((o) => o.id === drone.currentOrderId);
            if (!order) return null;

            // Kiểm tra trạng thái bay
            const isFlying = [
              "moving_to_store",
              "delivering",
              "returning",
            ].includes(drone.status);
            if (!isFlying) return null;

            const isSelected = selectedOrder?.id === order.id;
            const dronePos = [drone.currentLat, drone.currentLng];
            const storePos = store.location;
            const custPos = order.customerLocation;
            const hubPos = SEED_HUBS[0].location;

            return (
              <React.Fragment key={drone.id}>
                <Marker position={dronePos} icon={droneIcon}>
                  <Popup>
                    <b>{drone.name}</b>
                    <br />
                    Pin: {drone.battery}%
                  </Popup>
                </Marker>

                {/* VẼ ĐƯỜNG BAY 3 MÀU (Chỉ khi chọn) */}
                {isSelected && (
                  <>
                    {/* 1. Trạm -> Quán (Cam) */}
                    {drone.status === "moving_to_store" ? (
                      <Polyline
                        positions={[dronePos, storePos]}
                        color="#e67e22"
                        weight={4}
                      />
                    ) : (
                      <Polyline
                        positions={[hubPos, storePos]}
                        color="#e67e22"
                        dashArray="5, 8"
                        opacity={0.6}
                        weight={2}
                      />
                    )}

                    {/* 2. Quán -> Khách (Xanh) */}
                    {drone.status === "moving_to_store" ? (
                      <Polyline
                        positions={[storePos, custPos]}
                        color="#27ae60"
                        dashArray="5, 8"
                        opacity={0.6}
                        weight={2}
                      />
                    ) : drone.status === "delivering" ? (
                      <Polyline
                        positions={[dronePos, custPos]}
                        color="#27ae60"
                        weight={4}
                      />
                    ) : (
                      <Polyline
                        positions={[storePos, custPos]}
                        color="#27ae60"
                        dashArray="5, 8"
                        opacity={0.6}
                        weight={2}
                      />
                    )}

                    {/* 3. Khách -> Trạm (Xám) */}
                    {drone.status === "returning" ? (
                      <Polyline
                        positions={[dronePos, hubPos]}
                        color="#95a5a6"
                        weight={4}
                      />
                    ) : (
                      <Polyline
                        positions={[custPos, hubPos]}
                        color="#95a5a6"
                        dashArray="5, 8"
                        opacity={0.6}
                        weight={2}
                      />
                    )}

                    <Marker position={custPos} icon={customerIcon}>
                      <Popup>Khách hàng #{order.id}</Popup>
                    </Marker>
                  </>
                )}
              </React.Fragment>
            );
          })}

          {/* LỊCH SỬ ĐƠN HOÀN THÀNH */}
          {selectedOrder && selectedOrder.orderStatus === "COMPLETED" && (
            <>
              <Marker
                position={selectedOrder.customerLocation}
                icon={customerIcon}
              >
                <Popup>Đã giao tại đây</Popup>
              </Marker>
              <Polyline
                positions={[SEED_HUBS[0].location, store.location]}
                color="#e67e22"
                dashArray="5, 8"
                opacity={0.5}
              />
              <Polyline
                positions={[store.location, selectedOrder.customerLocation]}
                color="#27ae60"
                dashArray="5, 8"
                opacity={0.5}
              />
              <Polyline
                positions={[
                  selectedOrder.customerLocation,
                  SEED_HUBS[0].location,
                ]}
                color="#95a5a6"
                dashArray="5, 8"
                opacity={0.5}
              />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default DroneMap;
