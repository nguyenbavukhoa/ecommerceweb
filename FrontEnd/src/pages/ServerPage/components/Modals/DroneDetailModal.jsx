// src/pages/ServerPage/components/Modals/DroneDetailModal.jsx
import React, { useState, useEffect } from "react";
import CommonModal from "../../../AdminPage/components/Modals/CommonModal";
import styles from "./DroneDetailModal.module.scss";
import { useToast } from "../../../../context/ToastContext";
import { db } from "../../../../data/mockData"; // Import DB
import { useQuery } from "@tanstack/react-query"; // [FIX] Import useQuery

const DroneDetailModal = ({ isOpen, onClose, droneId, onSaveSuccess }) => {
  const { showToast } = useToast();
  const isEdit = !!droneId;

  // [FIX] Lấy dữ liệu Drone realtime mỗi khi mở modal
  const { data: drone, refetch } = useQuery({
    queryKey: ["droneDetail", droneId],
    queryFn: async () => db.drones.getAll().find((d) => d.id === droneId),
    enabled: !!droneId && isOpen, // Chỉ fetch khi có ID và Modal mở
    refetchInterval: 2000, // Tự động refresh để thấy pin/lịch sử cập nhật
  });

  // State form local
  const [formData, setFormData] = useState({
    name: "",
    status: "ready",
    battery: 100,
    currentLocation: "Trạm Trung Tâm",
  });

  // Sync data vào form khi load xong
  useEffect(() => {
    if (isOpen && drone) {
      setFormData({
        name: drone.name,
        status: drone.status,
        battery: drone.battery,
        currentLocation: drone.currentLocation || "Trạm Trung Tâm",
      });
    } else if (isOpen && !isEdit) {
      setFormData({
        name: "",
        status: "ready",
        battery: 100,
        currentLocation: "Trạm Trung Tâm",
      });
    }
  }, [isOpen, drone, isEdit]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      showToast({
        title: "Lỗi",
        message: "Vui lòng nhập tên Drone",
        type: "warning",
      });
      return;
    }

    if (isEdit) {
      db.drones.update(droneId, formData);
      showToast({
        title: "Thành công",
        message: "Đã cập nhật",
        type: "success",
      });
    } else {
      // Logic create (nếu có)
    }

    if (onSaveSuccess) onSaveSuccess();
    onClose();
  };

  if (!drone && isEdit) return null; // Loading...

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `THÔNG TIN: ${droneId}` : "THÊM DRONE MỚI"}
      customWidth="700px"
    >
      <div className={styles.container}>
        {/* --- PHẦN 1: CÀI ĐẶT --- */}
        <div className={styles.settingsSection}>
          <h4 className={styles.sectionTitle}>⚙️ Cài đặt vận hành</h4>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Tên định danh</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                disabled={
                  drone?.status === "delivering" ||
                  drone?.status === "moving_to_store"
                } // Không sửa khi đang bay
              >
                <option value="ready">Sẵn sàng (Ready)</option>
                <option value="maintenance">Bảo trì (Maintenance)</option>
                <option value="charging">Đang sạc (Charging)</option>
                <option value="moving_to_store" disabled>
                  Đang đi lấy
                </option>
                <option value="delivering" disabled>
                  Đang giao
                </option>
              </select>
            </div>
          </div>
          {/* ... Các input khác giữ nguyên ... */}

          <button className={styles.btnSave} onClick={handleSave}>
            Lưu thay đổi
          </button>
        </div>

        {/* --- PHẦN 2: LỊCH SỬ (QUAN TRỌNG: SẼ TỰ CẬP NHẬT) --- */}
        {isEdit && (
          <div className={styles.historySection}>
            <h4 className={styles.sectionTitle}>
              📦 Lịch sử giao hàng ({drone?.history?.length || 0})
            </h4>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Thời gian</th>
                    <th>Điểm đến</th>
                    <th>Giá trị</th>
                  </tr>
                </thead>
                <tbody>
                  {drone?.history && drone.history.length > 0 ? (
                    drone.history.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <strong>#{item.id}</strong>
                        </td>
                        <td>{item.time}</td>
                        <td>{item.address}</td>
                        <td>{item.totalPrice?.toLocaleString()}đ</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        Chưa có lịch sử bay.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </CommonModal>
  );
};

export default DroneDetailModal;
