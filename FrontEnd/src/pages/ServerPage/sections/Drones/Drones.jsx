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
// [FIX] Dùng đúng đường dẫn data như bạn cung cấp
import { db, SEED_HUBS } from "../../../../data/mockData";
import { useToast } from "../../../../context/ToastContext";
import DroneDetailModal from "../../components/Modals/DroneDetailModal";

// --- ICONS ---
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
  // Lưu ý: Drones lấy qua local state để animation, query chỉ để fetch lần đầu hoặc backup
  const { data: dbDrones = [] } = useQuery({
    queryKey: ["allDrones"],
    queryFn: async () => db.drones.getAll(),
    staleTime: 0,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["allOrdersForMap"],
    queryFn: async () => db.orders.getAll(),
    refetchInterval: 2000, // Cập nhật danh sách đơn hàng định kỳ
  });

  const { data: allStores = [] } = useQuery({
    queryKey: ["allStoresForMap"],
    queryFn: async () => db.stores.getAll(),
    staleTime: 0,
  });

  // State local để render mượt
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

  // --- [FIX QUAN TRỌNG] ĐỒNG BỘ ENGINE VỚI DRONEMAP ---
  // Sử dụng db.drones.processSimulationTick() thay vì tự tính toán moveTowards
  useEffect(() => {
    const interval = setInterval(() => {
      // Gọi "nhịp tim" của hệ thống từ MockData
      // Hàm này sẽ tự động kiểm tra timestamp để không bị xung đột với tab khác
      const updatedDrones = db.drones.processSimulationTick();

      if (updatedDrones) {
        setLocalDrones(updatedDrones);
      } else {
        // Nếu không có update (đứng yên), lấy dữ liệu hiện tại để đảm bảo UI không mất
        setLocalDrones(db.drones.getAll());
      }
    }, 100); // 100ms = 10 FPS (Mượt mà)

    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleEdit = (drone) => {
    setSelectedDrone(drone);
    setIsModalOpen(true);
  };

  const handleRecallAll = () => {
    if (window.confirm("BÁO ĐỘNG: Thu hồi toàn bộ Drone?")) {
      db.drones.recallAll();
      setLocalDrones(db.drones.getAll()); // Reset ngay lập tức trên UI
      showToast({
        title: "Đã thu hồi",
        message: "Tất cả Drone đang quay về trạm.",
        type: "warning",
      });
    }
  };

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
        <button className={styles.btnEmergency} onClick={handleRecallAll}>
          <i className="fa-solid fa-triangle-exclamation"></i> THU HỒI
        </button>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.mapContainer}>
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

            {/* VẼ HUBS */}
            {SEED_HUBS.map((hub) => (
              <Marker key={hub.id} position={hub.location} icon={hubIcon}>
                <Popup>
                  <b>{hub.name}</b>
                </Popup>
              </Marker>
            ))}

            {/* VẼ STORES */}
            {allStores.map((store) => (
              <Marker key={store.id} position={store.location} icon={storeIcon}>
                <Popup>
                  <b>{store.name}</b>
                </Popup>
              </Marker>
            ))}

            {/* VẼ DRONES & ĐƯỜNG BAY 3 MÀU */}
            {localDrones.map((drone) => {
              // Tìm đơn hàng liên quan
              const order = orders.find((o) => o.id === drone.currentOrderId);
              const store = order
                ? allStores.find((s) => s.id === order.restaurantId)
                : null;

              // Tọa độ các điểm
              const dronePos = [
                drone.currentLat || CENTER_POS[0],
                drone.currentLng || CENTER_POS[1],
              ];
              const hubPos = SEED_HUBS[0].location; // Giả định Hub 1
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

                  {/* VẼ ĐƯỜNG BAY 3 MÀU CHO TẤT CẢ DRONE ĐANG BAY */}
                  {isFlying && order && (
                    <>
                      {/* 1. Trạm -> Quán (Màu Cam) */}
                      {drone.status === "moving_to_store" ? (
                        <Polyline
                          positions={[dronePos, storePos]}
                          color="#e67e22"
                          weight={4}
                        /> // Đang bay
                      ) : (
                        <Polyline
                          positions={[hubPos, storePos]}
                          color="#e67e22"
                          dashArray="5, 8"
                          weight={2}
                          opacity={0.5}
                        /> // Đã qua
                      )}

                      {/* 2. Quán -> Khách (Màu Xanh lá) */}
                      {drone.status === "moving_to_store" ? (
                        <Polyline
                          positions={[storePos, custPos]}
                          color="#27ae60"
                          dashArray="5, 8"
                          weight={2}
                          opacity={0.5}
                        /> // Chưa tới
                      ) : drone.status === "delivering" ? (
                        <Polyline
                          positions={[dronePos, custPos]}
                          color="#27ae60"
                          weight={4}
                        /> // Đang bay
                      ) : (
                        <Polyline
                          positions={[storePos, custPos]}
                          color="#27ae60"
                          dashArray="5, 8"
                          weight={2}
                          opacity={0.5}
                        /> // Đã qua
                      )}

                      {/* 3. Khách -> Trạm (Màu Xám) */}
                      {drone.status === "returning" ? (
                        <Polyline
                          positions={[dronePos, hubPos]}
                          color="#95a5a6"
                          weight={4}
                        /> // Đang bay
                      ) : (
                        <Polyline
                          positions={[custPos, hubPos]}
                          color="#95a5a6"
                          dashArray="5, 8"
                          weight={2}
                          opacity={0.5}
                        /> // Chưa tới
                      )}

                      {/* Marker Khách */}
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
          <h3 className={styles.panelTitle}>Đội bay</h3>
          <div className={styles.droneList}>
            {localDrones.map((drone) => (
              <div
                key={drone.id}
                className={styles.droneRow}
                onClick={() => handleEdit(drone)}
              >
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
        onSaveSuccess={() => {
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default Drones;
