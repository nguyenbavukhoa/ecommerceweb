// src/pages/ServerPage/sections/Drones/Drones.jsx
import React, { useState, useEffect } from "react";
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
import styles from "./Drones.module.scss";
import { useQuery } from "@tanstack/react-query";
// [FIX] Import dbService thay vì mockData
import { db, SEED_HUBS } from "../../../../services/dbService";
import { useToast } from "../../../../context/ToastContext";
import DroneDetailModal from "../../components/Modals/DroneDetailModal";

// --- ICONS (Giữ nguyên) ---
const droneIconNormal = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});
const droneIconActive = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
  iconSize: [48, 48],
  iconAnchor: [24, 24],
  className: "pulsing-icon",
});
const hubIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/921/921347.png",
  iconSize: [50, 50],
  iconAnchor: [25, 25],
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

const CENTER_POS = [10.762622, 106.660172];

// Component ép Map vẽ lại (Fix lỗi map xám)
const MapUpdater = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

const Drones = () => {
  const { showToast } = useToast();

  // 1. Lấy dữ liệu tham chiếu (Store, Order)
  const { data: dbDrones = [] } = useQuery({
    queryKey: ["allDrones"],
    queryFn: async () => await db.drones.getAll(),
    staleTime: 0,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["allOrdersForMap"],
    queryFn: async () => await db.orders.getAll(),
    refetchInterval: 2000,
  });

  const { data: allStores = [] } = useQuery({
    queryKey: ["allStoresForMap"],
    queryFn: async () => await db.stores.getAll(),
    staleTime: 0,
  });

  const [localDrones, setLocalDrones] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trackingDroneId, setTrackingDroneId] = useState(null);

  // Sync dữ liệu lần đầu
  useEffect(() => {
    if (dbDrones.length > 0 && localDrones.length === 0) {
      setLocalDrones(dbDrones);
    }
  }, [dbDrones]);

  // --- [FIX QUAN TRỌNG] ĐỒNG BỘ ENGINE (ASYNC) ---
  useEffect(() => {
    const interval = setInterval(async () => {
      // Gọi "nhịp tim" (Async)
      const updatedDrones = await db.drones.processSimulationTick();

      if (updatedDrones) {
        setLocalDrones(updatedDrones);
      } else {
        // Nếu không có update, fetch lại state hiện tại
        const current = await db.drones.getAll();
        setLocalDrones(current);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Handlers
  // [MỚI] Hàm mở modal thêm mới
  const handleAdd = () => {
    setSelectedDrone(null); // Clear selected để modal hiểu là thêm mới
    setIsModalOpen(true);
  };

  // Hàm mở modal sửa (click vào list)
  const handleEdit = (drone) => {
    setSelectedDrone(drone);
    setIsModalOpen(true);
  };

  const handleRecallAll = async () => {
    if (window.confirm("BÁO ĐỘNG: Thu hồi toàn bộ Drone?")) {
      await db.drones.recallAll(); // Thêm await
      const resetDrones = await db.drones.getAll();
      setLocalDrones(resetDrones);
      showToast({
        title: "Đã thu hồi",
        message: "Tất cả Drone đang quay về trạm.",
        type: "warning",
      });
    }
  };

  // ... (Các hàm helper icon/label giữ nguyên) ...
  const getStatusIcon = (status) => {
    return ["moving_to_store", "delivering", "returning"].includes(status)
      ? droneIconActive
      : droneIconNormal;
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "ready":
        return (
          <span className={`${styles.badge} ${styles.ready}`}>Sẵn sàng</span>
        );
      case "moving_to_store":
        return (
          <span className={`${styles.badge} ${styles.busy}`}>Đến lấy hàng</span>
        );
      case "delivering":
        return (
          <span className={`${styles.badge} ${styles.busy}`}>Đang giao</span>
        );
      case "returning":
        return (
          <span className={`${styles.badge} ${styles.busy}`}>Về trạm</span>
        );
      case "charging":
        return (
          <span className={`${styles.badge} ${styles.charging}`}>Đang sạc</span>
        );
      default:
        return (
          <span className={`${styles.badge} ${styles.maintenance}`}>
            Bảo trì
          </span>
        );
    }
  };

  const activeDronesCount = localDrones.filter((d) =>
    ["moving_to_store", "delivering", "returning"].includes(d.status)
  ).length;

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>🕹️ Trung tâm điều hành Drone</h2>
          <p className={styles.subtitle}>
            Giám sát hạm đội bay theo thời gian thực
          </p>
        </div>
        {/* [MỚI] Khu vực nút bấm */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className={styles.btnAdd} // Bạn có thể dùng chung style với btnEmergency hoặc tạo class mới
            style={{
              backgroundColor: "#2980b9",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={handleAdd}
          >
            <i className="fa-solid fa-plus"></i> THÊM DRONE
          </button>

          <button className={styles.btnEmergency} onClick={handleRecallAll}>
            <i className="fa-solid fa-triangle-exclamation"></i> THU HỒI
          </button>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.mapContainer}>
          {/* ... (Phần render Map giữ nguyên, logic vẽ không đổi) ... */}
          <div className={styles.mapOverlayStats}>
            <div className={styles.statItem}>
              <strong>{localDrones.length}</strong> <span>Tổng</span>
            </div>
            <div className={`${styles.statItem} ${styles.active}`}>
              <strong>{activeDronesCount}</strong> <span>Bay</span>
            </div>
          </div>

          <MapContainer center={CENTER_POS} zoom={13} className={styles.map}>
            <MapUpdater />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {SEED_HUBS.map((hub) => (
              <Marker key={hub.id} position={hub.location} icon={hubIcon}>
                <Popup>
                  <b>{hub.name}</b>
                </Popup>
              </Marker>
            ))}
            {allStores.map((store) => (
              <Marker key={store.id} position={store.location} icon={storeIcon}>
                <Popup>
                  <b>{store.name}</b>
                </Popup>
              </Marker>
            ))}

            {localDrones.map((drone) => {
              const order = orders.find((o) => o.id === drone.currentOrderId);
              const store = order
                ? allStores.find((s) => s.id === order.restaurantId)
                : null;
              const dronePos = [
                drone.currentLat || CENTER_POS[0],
                drone.currentLng || CENTER_POS[1],
              ];
              const hubPos = SEED_HUBS[0].location;
              const storePos = store ? store.location : hubPos;
              const custPos = order ? order.customerLocation : hubPos;
              const isFlying = [
                "moving_to_store",
                "delivering",
                "returning",
              ].includes(drone.status);

              return (
                <React.Fragment key={drone.id}>
                  <Marker
                    position={dronePos}
                    icon={getStatusIcon(drone.status)}
                    eventHandlers={{
                      click: () => setTrackingDroneId(drone.id),
                    }}
                  >
                    <Popup>
                      <div style={{ textAlign: "center" }}>
                        <strong>{drone.name}</strong>
                        <br />
                        Pin:{" "}
                        <b
                          style={{
                            color: drone.battery > 30 ? "green" : "red",
                          }}
                        >
                          {drone.battery}%
                        </b>
                        <br />
                        {getStatusLabel(drone.status)}
                        {order && (
                          <div style={{ marginTop: 5, fontSize: 11 }}>
                            Đơn: #{order.id}
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                  {isFlying && order && (
                    <>
                      {/* Vẽ đường bay (Logic cũ giữ nguyên) */}
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
                          weight={2}
                          opacity={0.5}
                        />
                      )}
                      {drone.status === "moving_to_store" ? (
                        <Polyline
                          positions={[storePos, custPos]}
                          color="#27ae60"
                          dashArray="5, 8"
                          weight={2}
                          opacity={0.5}
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
                          weight={2}
                          opacity={0.5}
                        />
                      )}
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
                          weight={2}
                          opacity={0.5}
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
          </MapContainer>
        </div>

        {/* LIST */}
        <div className={styles.sidePanel}>
          <h3 className={styles.panelTitle}>Đội bay ({localDrones.length})</h3>
          <div className={styles.droneList}>
            {localDrones.map((drone) => (
              <div
                key={drone.id}
                className={styles.droneRow}
                onClick={() => handleEdit(drone)} // Click vào dòng để sửa
                style={{ cursor: "pointer" }}
              >
                {/* ... nội dung item drone ... */}
                <div className={styles.droneHeader}>
                  <span className={styles.droneName}>{drone.name}</span>
                  <span className={styles.droneId}>{drone.id}</span>
                </div>
                <div className={styles.droneDetails}>
                  <span className={styles.batteryLevel}>
                    <i className="fa-solid fa-battery-half"></i> {drone.battery}
                    %
                  </span>
                  {getStatusLabel(drone.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DroneDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        droneId={selectedDrone?.id}
        onSaveSuccess={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Drones;
