import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./Drones.module.scss";
import DroneDetailModal from "../../components/Modals/DroneDetailModal";
import { DRONE_FLEET_MOCK } from "./droneServerMock";
import { useToast } from "../../../../context/ToastContext";

// --- CẤU HÌNH BẢN ĐỒ & ICONS ---
const CENTER_POS = [10.762622, 106.660172]; // Quận 10

const droneIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
  iconSize: [45, 45],
  iconAnchor: [22, 22],
});

const storeIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// --- HELPERS ---
const getStatusBadge = (status) => {
  switch (status) {
    case "ready":
      return (
        <span className={`${styles.statusBadge} ${styles.ready}`}>
          Sẵn sàng
        </span>
      );
    case "delivering":
      return (
        <span className={`${styles.statusBadge} ${styles.delivering}`}>
          Đang giao
        </span>
      );
    case "charging":
      return (
        <span className={`${styles.statusBadge} ${styles.charging}`}>
          Đang sạc
        </span>
      );
    case "maintenance":
      return (
        <span className={`${styles.statusBadge} ${styles.maintenance}`}>
          Bảo trì
        </span>
      );
    default:
      return <span>{status}</span>;
  }
};

const getBatteryColor = (level) => {
  if (level > 70) return "#2ecc71";
  if (level > 30) return "#f1c40f";
  return "#e74c3c";
};

// Tạo tọa độ ngẫu nhiên quanh trạm (để demo hiển thị trên map)
const getRandomPos = (base, range = 0.01) => [
  base[0] + (Math.random() - 0.5) * range,
  base[1] + (Math.random() - 0.5) * range,
];

const Drones = () => {
  const { showToast } = useToast();

  // Thêm tọa độ giả lập cho mỗi drone để hiện lên map
  const [drones, setDrones] = useState(() =>
    DRONE_FLEET_MOCK.map((d) => ({
      ...d,
      position: getRandomPos(CENTER_POS), // Mỗi con 1 vị trí
    }))
  );

  // --- STATE CHO MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDrone, setSelectedDrone] = useState(null);

  // Hàm mở modal edit
  const handleEdit = (drone) => {
    setSelectedDrone(drone);
    setIsModalOpen(true);
  };

  // Hàm mở modal Add
  const handleAddDrone = () => {
    setSelectedDrone(null); // null = chế độ thêm mới
    setIsModalOpen(true);
  };

  // Hàm xử lý Lưu (Add hoặc Update)
  const handleSaveSuccess = (id, newData) => {
    if (id) {
      // --- UPDATE DRONE CŨ ---
      setDrones((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...newData } : d))
      );
    } else {
      // --- THÊM DRONE MỚI ---
      const newId = `DR-${String(drones.length + 1).padStart(3, "0")}`;
      const newDrone = {
        id: newId,
        ...newData,
        totalDeliveries: 0,
        history: [],
        lastMaintenance: "Chưa có",
        position: getRandomPos(CENTER_POS), // Gán vị trí ngẫu nhiên trên bản đồ
      };
      setDrones((prev) => [...prev, newDrone]);
    }
  };

  // Nút bảo trì nhanh ở ngoài
  const handleMaintain = (id) => {
    setDrones((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "maintenance" } : d))
    );
    showToast({
      title: "Thành công",
      message: `Đã đưa Drone ${id} vào bảo trì`,
      type: "success",
    });
  };

  // Thống kê
  const stats = [
    {
      title: "Tổng Drone",
      value: drones.length,
      icon: "fa-light fa-drone",
      color: "#3498db",
    },
    {
      title: "Đang bay",
      value: drones.filter((d) => d.status === "delivering").length,
      icon: "fa-light fa-paper-plane",
      color: "#e67e22",
    },
    {
      title: "Sẵn sàng",
      value: drones.filter((d) => d.status === "ready").length,
      icon: "fa-light fa-check-circle",
      color: "#2ecc71",
    },
    {
      title: "Bảo trì/Sạc",
      value: drones.filter((d) =>
        ["maintenance", "charging"].includes(d.status)
      ).length,
      icon: "fa-light fa-screwdriver-wrench",
      color: "#e74c3c",
    },
  ];

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <i className="fa-light fa-drone-front"></i> Quản lý & Giám sát Drone
        </h2>
        <button className={styles.btnAdd} onClick={handleAddDrone}>
          <i className="fa-light fa-plus"></i> Thêm Drone
        </button>
      </div>

      {/* PHẦN 1: BẢN ĐỒ TRỰC QUAN & THỐNG KÊ */}
      <div className={styles.topSection}>
        {/* Cột Trái: Thống kê nhanh */}
        <div className={styles.statsContainer}>
          {stats.map((stat, index) => (
            <div className={styles.statCard} key={index}>
              <div
                className={styles.statIcon}
                style={{
                  backgroundColor: `${stat.color}20`,
                  color: stat.color,
                }}
              >
                <i className={stat.icon}></i>
              </div>
              <div className={styles.statInfo}>
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Cột Phải: Bản đồ thời gian thực */}
        <div className={styles.mapWrapper}>
          <MapContainer
            center={CENTER_POS}
            zoom={15}
            className={styles.mapContainer}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Trạm trung tâm */}
            <Marker position={CENTER_POS} icon={storeIcon}>
              <Popup>🏠 Trạm điều hành trung tâm</Popup>
            </Marker>

            {/* Các Drone */}
            {drones.map((drone) => (
              <Marker key={drone.id} position={drone.position} icon={droneIcon}>
                <Popup>
                  <b>{drone.name}</b> <br />
                  Pin: {drone.battery}% <br />
                  Trạng thái: {drone.status}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* PHẦN 2: DANH SÁCH CHI TIẾT (GRID CARD) */}
      <h3 className={styles.subTitle}>📋 Danh sách chi tiết đội bay</h3>
      <div className={styles.droneGrid}>
        {drones.map((drone) => (
          <div className={styles.droneCard} key={drone.id}>
            <div className={styles.droneHeader}>
              <div>
                <h4>{drone.name}</h4>
                <span>{drone.id}</span>
              </div>
              {getStatusBadge(drone.status)}
            </div>

            <div className={styles.droneBody}>
              <div className={styles.infoRow}>
                <span>
                  <i className="fa-light fa-location-dot"></i> Vị trí:
                </span>
                <strong style={{ color: "#555", fontSize: "13px" }}>
                  {drone.currentLocation}
                </strong>
              </div>

              <div className={styles.infoRow}>
                <span>
                  <i className="fa-light fa-box"></i> Đã giao:
                </span>
                <strong>{drone.totalDeliveries} đơn</strong>
              </div>

              <div>
                <div className={styles.infoRow}>
                  <span>
                    <i className="fa-light fa-battery-full"></i> Pin:
                  </span>
                  <strong style={{ color: getBatteryColor(drone.battery) }}>
                    {drone.battery}%
                  </strong>
                </div>
                <div className={styles.batteryBar}>
                  <div
                    style={{
                      width: `${drone.battery}%`,
                      backgroundColor: getBatteryColor(drone.battery),
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.btnMaintain}
                onClick={() => handleEdit(drone)}
              >
                <i className="fa-light fa-gear"></i> Cài đặt
              </button>
              <button
                className={styles.btnLog}
                onClick={() => handleEdit(drone)}
              >
                <i className="fa-light fa-file-lines"></i> Lịch sử
              </button>
            </div>
          </div>
        ))}
      </div>
      <DroneDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        drone={selectedDrone}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
};

export default Drones;
