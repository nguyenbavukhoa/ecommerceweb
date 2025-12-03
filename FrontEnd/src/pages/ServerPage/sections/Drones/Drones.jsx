import React, { useState } from "react";
import styles from "./Drones.module.scss";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "../../../../context/ToastContext";
import DroneDetailModal from "../../components/Modals/DroneDetailModal";
import droneService from "../../../../services/droneService";
// Bỏ CommonModal import vì đã dùng DroneDetailModal rồi

// Helper hiển thị trạng thái
const getStatusLabel = (status) => {
  let cls = "ready";
  if (status === "IDLE") cls = "ready";
  else if (["DELIVERING", "MOVING_TO_STORE", "RETURNING"].includes(status))
    cls = "busy";
  else if (status === "MAINTENANCE" || status === "OFFLINE")
    cls = "maintenance";
  // Fallback nếu có status cũ
  else if (status === "CHARGING") cls = "charging";

  return <span className={`${styles.badge} ${styles[cls]}`}>{status}</span>;
};

const Drones = () => {
  const { showToast } = useToast();

  const [selectedDrone, setSelectedDrone] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. LẤY DANH SÁCH DRONE TỪ API
  const { data: drones = [], refetch } = useQuery({
    queryKey: ["drones"],
    queryFn: async () => await droneService.getAllDrones(),
    refetchInterval: 5000,
  });

  // Mở Modal Xem chi tiết
  const handleOpenDetail = (drone) => {
    setSelectedDrone(drone);
    setIsModalOpen(true);
  };

  // Mở Modal Tạo mới (Truyền null)
  const handleCreateClick = () => {
    setSelectedDrone(null); // Null -> Create Mode
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDrone(null);
  };

  return (
    <div className={styles.section}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>
            <i className="fa-solid fa-robot"></i> Quản lý Đội bay
          </h2>
          <p className={styles.subtitle}>
            Theo dõi trạng thái và hiệu suất Drone
          </p>
        </div>
        <div className={styles.actions}>
          {/* Nút Thêm Drone -> Mở DroneDetailModal với data null */}
          <button className={styles.btnAdd} onClick={handleCreateClick}>
            <i className="fa-solid fa-plus"></i> Thêm Drone
          </button>
        </div>
      </header>

      {/* DANH SÁCH DRONE */}
      <div className={styles.droneGrid}>
        {drones.length === 0 ? (
          <div className={styles.emptyState}>Chưa có Drone nào.</div>
        ) : (
          drones.map((drone) => (
            <div
              key={drone.id}
              className={styles.droneCard}
              onClick={() => handleOpenDetail(drone)}
            >
              <div className={styles.cardIcon}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3063/3063822.png"
                  alt="Drone"
                />
              </div>
              <div className={styles.cardInfo}>
                <h4>{drone.serial}</h4>
                <p className={styles.model}>{drone.model}</p>
                <div className={styles.battery}>
                  <i
                    className={`fa-solid ${
                      drone.batteryPct > 20
                        ? "fa-battery-full"
                        : "fa-battery-quarter"
                    }`}
                    style={{
                      color: drone.batteryPct > 20 ? "#10b981" : "#ef4444",
                    }}
                  ></i>
                  {drone.batteryPct ? Number(drone.batteryPct).toFixed(0) : 0}%
                </div>
              </div>
              <div className={styles.cardStatus}>
                {getStatusLabel(drone.status)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL CHUNG (CREATE / EDIT) */}
      <DroneDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        drone={selectedDrone} // Null = Create, Object = Edit
        onUpdateSuccess={refetch}
      />
    </div>
  );
};

export default Drones;
