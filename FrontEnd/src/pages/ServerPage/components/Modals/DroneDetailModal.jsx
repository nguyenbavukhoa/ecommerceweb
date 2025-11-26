import React, { useState, useEffect } from "react";
import CommonModal from "../../../AdminPage/components/Modals/CommonModal";
import styles from "./DroneDetailModal.module.scss";
import { useToast } from "../../../../context/ToastContext";

const DroneDetailModal = ({ isOpen, onClose, drone, onSaveSuccess }) => {
  const { showToast } = useToast();
  const isEdit = !!drone; // Có drone -> Edit, Không có -> Add

  // State form
  const [formData, setFormData] = useState({
    name: "",
    status: "ready",
    battery: 100,
    currentLocation: "Trạm Trung Tâm",
  });

  // Load dữ liệu khi mở modal
  useEffect(() => {
    if (isOpen) {
      if (isEdit) {
        setFormData({
          name: drone.name,
          status: drone.status,
          battery: drone.battery,
          currentLocation: drone.currentLocation,
        });
      } else {
        // Reset form khi thêm mới
        setFormData({
          name: "",
          status: "ready",
          battery: 100,
          currentLocation: "Trạm Trung Tâm",
        });
      }
    }
  }, [isOpen, isEdit, drone]);

  const handleSave = () => {
    // Validate
    if (!formData.name.trim()) {
      showToast({
        title: "Lỗi",
        message: "Vui lòng nhập tên Drone",
        type: "warning",
      });
      return;
    }

    // Gửi dữ liệu ra ngoài
    if (isEdit) {
      showToast({
        title: "Thành công",
        message: `Cập nhật ${drone.id} thành công`,
        type: "success",
      });
      onSaveSuccess(drone.id, formData);
    } else {
      showToast({
        title: "Thành công",
        message: "Thêm Drone mới thành công",
        type: "success",
      });
      onSaveSuccess(null, formData); // ID null báo hiệu là thêm mới
    }

    onClose();
  };

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `CÀI ĐẶT: ${drone.id}` : "THÊM DRONE MỚI"}
      customWidth="700px"
    >
      <div className={styles.container}>
        {/* --- PHẦN 1: CÀI ĐẶT TRẠNG THÁI --- */}
        <div className={styles.settingsSection}>
          <h4 className={styles.sectionTitle}>
            {isEdit ? "⚙️ Cài đặt vận hành" : "📝 Thông tin Drone"}
          </h4>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Tên định danh</label>
              <input
                type="text"
                placeholder="VD: KHK Drone Zeta"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>Trạng thái ban đầu</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                disabled={isEdit && drone.status === "delivering"} // Không sửa khi đang bay
              >
                <option value="ready">Sẵn sàng (Ready)</option>
                <option value="maintenance">Bảo trì (Maintenance)</option>
                <option value="charging">Đang sạc (Charging)</option>
                {isEdit && (
                  <option value="delivering" disabled>
                    Đang bay
                  </option>
                )}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Vị trí trạm</label>
              <input
                type="text"
                value={formData.currentLocation}
                onChange={(e) =>
                  setFormData({ ...formData, currentLocation: e.target.value })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Pin khởi tạo (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.battery}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    battery: parseInt(e.target.value) || 0,
                  })
                }
                disabled={isEdit} // Chỉ cho chỉnh pin khi tạo mới (giả lập)
              />
            </div>
          </div>

          <button className={styles.btnSave} onClick={handleSave}>
            <i className="fa-regular fa-floppy-disk"></i>{" "}
            {isEdit ? "Lưu thay đổi" : "Tạo mới"}
          </button>
        </div>

        {/* --- PHẦN 2: LỊCH SỬ (CHỈ HIỆN KHI EDIT) --- */}
        {isEdit && (
          <div className={styles.historySection}>
            <h4 className={styles.sectionTitle}>📦 Lịch sử giao hàng</h4>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Thời gian</th>
                    <th>Điểm đến</th>
                    <th>Khoảng cách</th>
                  </tr>
                </thead>
                <tbody>
                  {drone.history && drone.history.length > 0 ? (
                    drone.history.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <strong>{item.id}</strong>
                        </td>
                        <td>{item.time}</td>
                        <td>{item.address}</td>
                        <td>{item.distance}</td>
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
