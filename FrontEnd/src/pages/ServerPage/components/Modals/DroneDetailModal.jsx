import React, { useState, useEffect } from "react";
import CommonModal from "../../../AdminPage/components/Modals/CommonModal";
import styles from "./DroneDetailModal.module.scss";
import droneService from "../../../../services/droneService";
import { useToast } from "../../../../context/ToastContext";

// [CẬP NHẬT] Chỉ còn 3 trạng thái (Bỏ Charging)
const STATUS_OPTIONS = [
  { value: "IDLE", label: "Sẵn sàng (IDLE)" },
  { value: "MAINTENANCE", label: "Bảo trì (MAINTENANCE)" },
  { value: "OFFLINE", label: "Tắt nguồn (OFFLINE)" },
];

const DroneDetailModal = ({ isOpen, onClose, drone, onUpdateSuccess }) => {
  const { showToast } = useToast();
  const isCreateMode = !drone; // Nếu không có drone truyền vào là Mode Tạo Mới

  // State Form
  const [formData, setFormData] = useState({
    serial: "",
    model: "DJI Phantom 4",
    maxRangeKm: 20,
    avgSpeedKmh: 35,
    batteryPct: 100,
    status: "IDLE",
    restaurantId: 1,
  });

  const [loading, setLoading] = useState(false);

  // Load dữ liệu khi mở Modal
  useEffect(() => {
    if (isOpen) {
      if (drone) {
        // Mode Edit/View: Fill data từ drone
        setFormData({
          serial: drone.serial,
          model: drone.model,
          maxRangeKm: drone.maxRangeKm,
          avgSpeedKmh: drone.avgSpeedKmh,
          batteryPct: drone.batteryPct,
          status: drone.status,
          restaurantId: drone.restaurantId,
        });
      } else {
        // Mode Create: Reset form
        setFormData({
          serial: "",
          model: "DJI Phantom 4",
          maxRangeKm: 20,
          avgSpeedKmh: 35,
          batteryPct: 100,
          status: "IDLE",
          restaurantId: 1,
        });
      }
    }
  }, [isOpen, drone]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (isCreateMode) {
        // --- TẠO MỚI ---
        await droneService.createDrone(formData);
        showToast({
          title: "Thành công",
          message: "Tạo Drone mới thành công!",
          type: "success",
        });
      } else {
        // --- CẬP NHẬT TRẠNG THÁI ---
        // Chỉ cho phép cập nhật Status (theo logic cũ của bạn)
        await droneService.updateDroneStatus(drone.id, formData.status);
        showToast({
          title: "Thành công",
          message: "Cập nhật trạng thái thành công!",
          type: "success",
        });
      }

      onUpdateSuccess(); // Refresh list bên ngoài
      onClose();
    } catch (error) {
      showToast({
        title: "Lỗi",
        message: isCreateMode ? "Tạo thất bại" : "Cập nhật thất bại",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isCreateMode ? "Thêm Drone Mới" : `Chi tiết Drone: ${formData.serial}`
      }
    >
      <div className={styles.container}>
        {/* HEADER INFO (Chỉ hiện khi Xem chi tiết) */}
        {!isCreateMode && (
          <div className={styles.headerInfo}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3063/3063822.png"
              alt="Drone"
              className={styles.droneImg}
            />
            <div className={styles.infoText}>
              <h3>{formData.model}</h3>
              <p>ID: {drone.id}</p>
              <span
                className={`${styles.badge} ${
                  styles[formData.status?.toLowerCase()] || styles.ready
                }`}
              >
                {formData.status}
              </span>
            </div>
          </div>
        )}

        {/* FORM NHẬP LIỆU */}
        <div className={styles.settingsSection}>
          {/* SERIAL & MODEL (Chỉ cho nhập khi Tạo mới) */}
          {isCreateMode && (
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Serial Number</label>
                <input
                  type="text"
                  name="serial"
                  value={formData.serial}
                  onChange={handleChange}
                  placeholder="VD: DRN-001"
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Model</label>
                <select
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="DJI Phantom 4">DJI Phantom 4</option>
                  <option value="DJI Mavic Air 2">DJI Mavic Air 2</option>
                  <option value="DJI Mini 3 Pro">DJI Mini 3 Pro</option>
                </select>
              </div>
            </div>
          )}

          {/* THÔNG SỐ KỸ THUẬT (Chỉ hiện Inputs khi Tạo mới, Xem chi tiết thì hiện Text) */}
          {isCreateMode ? (
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Pin (%)</label>
                <input
                  type="number"
                  name="batteryPct"
                  value={formData.batteryPct}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Tốc độ (km/h)</label>
                <input
                  type="number"
                  name="avgSpeedKmh"
                  value={formData.avgSpeedKmh}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Tầm bay (km)</label>
                <input
                  type="number"
                  name="maxRangeKm"
                  value={formData.maxRangeKm}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            </div>
          ) : (
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <label>Pin</label>
                <span>
                  {formData.batteryPct
                    ? Number(formData.batteryPct).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <div className={styles.statItem}>
                <label>Tốc độ TB</label>
                <span>{formData.avgSpeedKmh} km/h</span>
              </div>
              <div className={styles.statItem}>
                <label>Tầm bay</label>
                <span>{formData.maxRangeKm} km</span>
              </div>
            </div>
          )}

          {/* STATUS SELECT (Luôn hiện để cập nhật) */}
          <div className={styles.formRow} style={{ marginTop: 20 }}>
            <div className={styles.formGroup} style={{ width: "100%" }}>
              <label>Trạng thái hoạt động</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
                className={styles.select}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* BUTTON SAVE */}
          <button
            className={styles.btnSave}
            onClick={handleSave}
            disabled={loading}
          >
            {loading
              ? "Đang xử lý..."
              : isCreateMode
              ? "Tạo Drone Mới"
              : "Lưu Thay Đổi"}
          </button>
        </div>
      </div>
    </CommonModal>
  );
};

export default DroneDetailModal;
