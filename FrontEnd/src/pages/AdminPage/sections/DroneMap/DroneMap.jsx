// src/pages/AdminPage/sections/DroneMap/DroneMap.jsx
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
import { db, SEED_HUBS } from "../../../../services/dbService";
import { useQuery } from "@tanstack/react-query";
import { vnd } from "../../utils";
import { useSearchParams } from "react-router-dom";

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
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// Component cập nhật Map khi resize
const MapUpdater = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

const parseOrderDate = (timeStr) => {
  if (!timeStr) return new Date();
  const [time, date] = timeStr.split(" ");
  if (!date) return new Date();
  const [d, m, y] = date.split("/");
  return new Date(`${y}-${m}-${d}`);
};

const DroneMap = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const storeId = user?.storeId || "RES-01";

  const [searchParams] = useSearchParams();
  const highlightOrderId = searchParams.get("orderId");

  // State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [localDrones, setLocalDrones] = useState([]);

  // [MỚI] State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Query Store
  const { data: store } = useQuery({
    queryKey: ["storeInfo", storeId],
    queryFn: async () => await db.stores.getOne(storeId),
  });

  // Query Orders
  const { data: orders = [], refetch: refetchOrders } = useQuery({
    queryKey: ["storeOrders", storeId],
    queryFn: async () => {
      const all = await db.orders.getAll();
      return all.filter((o) => o.restaurantId === storeId);
    },
    refetchInterval: 2000,
  });

  // Effect: Highlight order từ URL
  useEffect(() => {
    if (highlightOrderId && orders.length > 0) {
      const targetOrder = orders.find(
        (o) => o.id.toString() === highlightOrderId
      );
      if (targetOrder) {
        if (["PLACED", "CONFIRMED"].includes(targetOrder.orderStatus))
          setActiveTab("pending");
        else if (["PICKING", "SHIPPING"].includes(targetOrder.orderStatus))
          setActiveTab("active");
        else setActiveTab("history");

        setSelectedOrder(targetOrder);
      }
    }
  }, [highlightOrderId, orders]);

  // [FIX] Scroll Jumping: Chỉ scroll khi selectedOrder THAY ĐỔI, không scroll mỗi lần render
  useEffect(() => {
    if (selectedOrder) {
      const element = document.getElementById(`order-card-${selectedOrder.id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedOrder]);

  // Reset trang về 1 khi đổi tab hoặc search
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, startDate, endDate]);

  // Simulation Tick
  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedDrones = await db.drones.processSimulationTick();
      if (updatedDrones) setLocalDrones(updatedDrones);
    }, 1000); // Tăng lên 1s để đỡ lag
    return () => clearInterval(interval);
  }, []);

  const handleCallDrone = async (e, order) => {
    e.stopPropagation();
    try {
      await db.orders.dispatchDrone(order.id);
      showToast({
        title: "Thành công",
        message: "Đã điều phối Drone!",
        type: "success",
      });
      refetchOrders();
      setActiveTab("active");
    } catch (err) {
      showToast({ title: "Lỗi", message: err.message, type: "error" });
    }
  };

  // --- FILTERING ---
  const filteredOrders = useMemo(() => {
    let list = [...orders];

    // Filter by Tab
    if (activeTab === "pending")
      list = list.filter((o) =>
        ["PLACED", "CONFIRMED"].includes(o.orderStatus)
      );
    else if (activeTab === "active")
      list = list.filter((o) =>
        ["PICKING", "SHIPPING"].includes(o.orderStatus)
      );
    else if (activeTab === "history")
      list = list.filter((o) =>
        ["COMPLETED", "CANCELLED"].includes(o.orderStatus)
      );

    // Filter by Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toString().includes(lower) ||
          o.deliveryInfo?.name?.toLowerCase().includes(lower)
      );
    }

    // Filter by Date
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

    // Sort: Mới nhất lên đầu
    return list.sort((a, b) => b.id - a.id);
  }, [orders, activeTab, searchTerm, startDate, endDate]);

  // --- PAGINATION CALCULATION ---
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const getDroneInfo = (order) => {
    if (!order.droneId) return null;
    const drone = localDrones.find((d) => d.id === order.droneId);
    return drone ? drone.name : "Unknown Drone";
  };

  // [FIX LOGIC VẼ ĐƯỜNG] Hàm render đường đi dựa trên status
  const renderOrderRoute = () => {
    if (!selectedOrder || !store) return null;

    const { orderStatus, droneId, customerLocation } = selectedOrder;
    const drone = localDrones.find((d) => d.id === droneId);
    const dronePos = drone ? [drone.currentLat, drone.currentLng] : null;
    const storePos = store.location;

    // 1. Đơn đang đi lấy (PICKING): Vẽ từ Drone -> Cửa hàng
    if (orderStatus === "PICKING" && dronePos) {
      return (
        <>
          <Polyline
            positions={[dronePos, storePos]}
            color="#e67e22"
            dashArray="5, 5"
            weight={3}
          />
          <Marker position={storePos} icon={storeIcon}>
            <Popup>Điểm lấy hàng</Popup>
          </Marker>
        </>
      );
    }

    // 2. Đơn đang giao (SHIPPING): Vẽ từ Cửa hàng -> Khách (Drone bay trên đường này)
    if (orderStatus === "SHIPPING") {
      return (
        <>
          <Polyline
            positions={[storePos, customerLocation]}
            color="#b5292f"
            weight={3}
          />
          {/* Nếu có Drone, vẽ thêm đoạn từ Drone -> Khách để thấy progress */}
          {dronePos && (
            <Polyline
              positions={[dronePos, customerLocation]}
              color="#27ae60"
              weight={2}
            />
          )}
          <Marker position={customerLocation} icon={customerIcon}>
            <Popup>Khách hàng</Popup>
          </Marker>
        </>
      );
    }

    // 3. Đơn lịch sử (COMPLETED/CANCELLED): Chỉ vẽ Cửa hàng -> Khách (Tĩnh)
    if (["COMPLETED", "CANCELLED"].includes(orderStatus) && customerLocation) {
      return (
        <>
          <Polyline
            positions={[storePos, customerLocation]}
            color="#888"
            dashArray="10, 5"
            weight={2}
          />
          <Marker position={customerLocation} icon={customerIcon}>
            <Popup>Điểm giao hàng</Popup>
          </Marker>
        </>
      );
    }

    // 4. Pending: Chỉ hiện Marker Khách
    if (["PLACED", "CONFIRMED"].includes(orderStatus) && customerLocation) {
      return (
        <Marker position={customerLocation} icon={customerIcon}>
          <Popup>Vị trí khách</Popup>
        </Marker>
      );
    }

    return null;
  };

  if (!store) return <div>Loading Map...</div>;

  return (
    <div className={styles.container}>
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
          {paginatedOrders.length === 0 ? (
            <div className={styles.empty}>Không tìm thấy đơn hàng.</div>
          ) : (
            paginatedOrders.map((order) => {
              const droneName = getDroneInfo(order);
              const isHighlighted = selectedOrder?.id === order.id;

              return (
                <div
                  key={order.id}
                  id={`order-card-${order.id}`} // [FIX] ID cho scroll
                  className={`${styles.card} ${
                    isHighlighted ? styles.selected : ""
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

        {/* [MỚI] PHÂN TRANG UI */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>

      <div className={styles.mapWrapper}>
        <MapContainer
          center={store.location}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
        >
          <MapUpdater />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Store & Hubs Markers */}
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

          {/* Drones (Chỉ hiện các Drone đang bay thực sự) */}
          {localDrones.map((drone) => {
            const isFlying = [
              "moving_to_store",
              "delivering",
              "returning",
            ].includes(drone.status);
            if (!isFlying) return null;
            return (
              <Marker
                key={drone.id}
                position={[drone.currentLat, drone.currentLng]}
                icon={droneIcon}
              >
                <Popup>
                  <b>{drone.name}</b>
                  <br />
                  Pin: {drone.battery}%
                </Popup>
              </Marker>
            );
          })}

          {/* [FIX] VẼ ĐƯỜNG ĐI THEO LOGIC MỚI */}
          {renderOrderRoute()}
        </MapContainer>
      </div>
    </div>
  );
};

export default DroneMap;
