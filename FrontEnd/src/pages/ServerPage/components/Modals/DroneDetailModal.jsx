import React, { useState, useEffect } from "react";
import CommonModal from "../../../AdminPage/components/Modals/CommonModal";
import styles from "./DroneDetailModal.module.scss";
import droneService from "../../../../services/droneService";
import storeService from "../../../../services/storeService"; // [MỚI] Import storeService
import { useToast } from "../../../../context/ToastContext";

const STATUS_OPTIONS = [
  { value: "IDLE", label: "Sẵn sàng (IDLE)" },
  { value: "MAINTENANCE", label: "Bảo trì (MAINTENANCE)" },
  { value: "OFFLINE", label: "Tắt nguồn (OFFLINE)" },
];

const DroneDetailModal = ({ isOpen, onClose, drone, onUpdateSuccess }) => {
  const { showToast } = useToast();
  const isCreateMode = !drone;

  const [formData, setFormData] = useState({
    serial: "",
    model: "DJI Phantom 4",
    maxRangeKm: 20,
    avgSpeedKmh: 35,
    batteryPct: 100,
    status: "IDLE",
    restaurantId: "", // [MỚI] Để trống ban đầu để bắt buộc chọn
  });

  const [stores, setStores] = useState([]); // [MỚI] Danh sách cửa hàng
  const [loading, setLoading] = useState(false);

  // Load dữ liệu khi mở Modal
  useEffect(() => {
    if (isOpen) {
      // 1. Load danh sách Store để chọn
      const fetchStores = async () => {
        try {
          const storeList = await storeService.getAll();
          setStores(storeList);

          // Nếu tạo mới và chưa chọn store, set default là cái đầu tiên
          if (isCreateMode && storeList.length > 0) {
            setFormData((prev) => ({ ...prev, restaurantId: storeList[0].id }));
          }
        } catch (e) {
          console.error("Lỗi load store:", e);
        }
      };
      fetchStores();

      // 2. Set form data
      if (drone) {
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
        // Reset form tạo mới
        setFormData((prev) => ({
          ...prev,
          serial: "",
          model: "DJI Phantom 4",
          maxRangeKm: 20,
          avgSpeedKmh: 35,
          batteryPct: 100,
          status: "IDLE",
        }));
      }
    }
  }, [isOpen, drone, isCreateMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (isCreateMode) {
        // Validate restaurantId
        if (!formData.restaurantId) {
          showToast({
            title: "Lỗi",
            message: "Vui lòng chọn cửa hàng quản lý",
            type: "warning",
          });
          setLoading(false);
          return;
        }

        // Payload chuẩn theo ví dụ bạn gửi
        const payload = {
          serial: formData.serial,
          model: formData.model,
          maxRangeKm: Number(formData.maxRangeKm),
          batteryPct: Number(formData.batteryPct),
          avgSpeedKmh: Number(formData.avgSpeedKmh),
          status: formData.status,
          restaurantId: Number(formData.restaurantId), // Đảm bảo là số
        };

        await droneService.createDrone(payload);
        showToast({
          title: "Thành công",
          message: "Tạo Drone mới thành công!",
          type: "success",
        });
      } else {
        // Update Status
        await droneService.updateDroneStatus(drone.id, formData.status);
        showToast({
          title: "Thành công",
          message: "Cập nhật trạng thái thành công!",
          type: "success",
        });
      }

      onUpdateSuccess();
      onClose();
    } catch (error) {
      const msg = error.response?.data?.message || "Thao tác thất bại";
      showToast({ title: "Lỗi", message: msg, type: "error" });
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
        {!isCreateMode && (
          <div className={styles.headerInfo}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3063/3063822.png"
              alt="Drone"
              className={styles.droneImg}
            />
            <div className={styles.infoText}>
              <h3>{formData.model}</h3>
              <p>
                Thuộc cửa hàng:{" "}
                {stores.find((s) => s.id == formData.restaurantId)?.name ||
                  `#${formData.restaurantId}`}
              </p>
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

        <div className={styles.settingsSection}>
          {/* SECTION 1: THÔNG TIN CƠ BẢN (Chỉ hiện khi tạo mới) */}
          {isCreateMode && (
            <>
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

              {/* [QUAN TRỌNG] DROPDOWN CHỌN CỬA HÀNG */}
              <div className={styles.formRow}>
                <div className={styles.formGroup} style={{ width: "100%" }}>
                  <label>Cửa hàng quản lý</label>
                  <select
                    name="restaurantId"
                    value={formData.restaurantId}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name.replace("KHK Food ", "")} (ID: {store.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* SECTION 2: THÔNG SỐ KỸ THUẬT */}
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
                <span>{Number(formData.batteryPct).toFixed(1)}%</span>
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

          {/* SECTION 3: TRẠNG THÁI */}
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
