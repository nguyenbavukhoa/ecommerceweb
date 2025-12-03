// src/pages/ServerPage/components/Modals/DroneDetailModal.jsx
import React, { useMemo } from "react";
import CommonModal from "../../../AdminPage/components/Modals/CommonModal";
import styles from "./DroneDetailModal.module.scss";
import { DRONE_FLEET_MOCK } from "../../sections/Drones/droneServerMock";

const STATUS_OPTIONS = [
  { value: "ready", label: "Sẵn sàng (Ready)" },
  { value: "maintenance", label: "Bảo trì (Maintenance)" },
  { value: "charging", label: "Đang sạc (Charging)" },
  { value: "moving_to_store", label: "Đang đi lấy" },
  { value: "delivering", label: "Đang giao" },
  { value: "returning", label: "Đang quay về" },
];

const DroneDetailModal = ({ isOpen, onClose, droneId }) => {
  const drone = useMemo(() => {
    if (!isOpen || !droneId) return null;
    return DRONE_FLEET_MOCK.find((item) => item.id === droneId) || null;
  }, [isOpen, droneId]);

  const batteryLevel = Math.min(Math.max(drone?.battery ?? 0, 0), 100);
  const batteryColor =
    batteryLevel > 60 ? "#10b981" : batteryLevel > 30 ? "#f59e0b" : "#ef4444";

  const currentOrder =
    drone && drone.status?.toLowerCase() === "delivering"
      ? drone.currentOrder
      : null;

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={droneId ? `THÔNG TIN: ${droneId}` : "THÊM DRONE MỚI"}
      customWidth="700px"
    >
      <div className={styles.container}>
        {!drone ? (
          <div className={styles.emptyState}>Không tìm thấy dữ liệu drone.</div>
        ) : (
          <>
            {/* --- PHẦN 1: THÔNG TIN VẬN HÀNH --- */}
            <div className={styles.settingsSection}>
              <h4 className={styles.sectionTitle}>⚙️ Cài đặt vận hành</h4>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Tên định danh</label>
                  <input type="text" value={drone.name} readOnly />
                </div>
                <div className={styles.formGroup}>
                  <label>Trạng thái</label>
                  <select value={drone.status} disabled>
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Vị trí hiện tại</label>
                  <input
                    type="text"
                    value={drone.currentLocation || "Trạm Trung Tâm"}
                    readOnly
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Tổng lượt giao</label>
                  <input
                    type="text"
                    value={drone.totalDeliveries ?? 0}
                    readOnly
                  />
                </div>
              </div>
              <div className={styles.batteryInfo}>
                <span>Pin hiện tại:</span>
                <div className={styles.batteryBar}>
                  <div
                    style={{
                      width: `${batteryLevel}%`,
                      backgroundColor: batteryColor,
                    }}
                  />
                </div>
                <strong>{drone.battery}%</strong>
              </div>

              {/* --- ĐƠN HÀNG ĐANG GIAO --- */}
              {currentOrder && (
                <div className={styles.deliveringBlock}>
                  <h5 className={styles.sectionTitle}>Đơn hàng đang giao</h5>
                  <div className={styles.currentOrderGrid}>
                    <div>
                      <span className={styles.fieldLabel}>Mã đơn</span>
                      <p className={styles.fieldValue}>#{currentOrder.id}</p>
                    </div>
                    <div>
                      <span className={styles.fieldLabel}>Thời gian</span>
                      <p className={styles.fieldValue}>
                        {currentOrder.time || "-"}
                      </p>
                    </div>
                    <div>
                      <span className={styles.fieldLabel}>Khách hàng</span>
                      <p className={styles.fieldValue}>
                        {currentOrder.customerName || "-"}
                      </p>
                    </div>
                    <div>
                      <span className={styles.fieldLabel}>Điểm đến</span>
                      <p className={styles.fieldValue}>
                        {currentOrder.address || "-"}
                      </p>
                    </div>
                    <div>
                      <span className={styles.fieldLabel}>Giá trị đơn</span>
                      <p className={styles.fieldValue}>
                        {currentOrder.totalPrice
                          ? `${currentOrder.totalPrice.toLocaleString()}đ`
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <span className={styles.fieldLabel}>Ghi chú</span>
                      <p className={styles.fieldValue}>
                        {currentOrder.note || "Đang giao"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* --- PHẦN 2: LỊCH SỬ GIAO HÀNG --- */}
            <div className={styles.historySection}>
              <h4 className={styles.sectionTitle}>
                📦 Lịch sử giao hàng ({drone.history?.length || 0})
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
                    {drone.history && drone.history.length > 0 ? (
                      drone.history.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <strong>#{item.id}</strong>
                          </td>
                          <td>{item.time || "-"}</td>
                          <td>{item.address || "-"}</td>
                          <td>
                            {item.totalPrice
                              ? `${item.totalPrice.toLocaleString()}đ`
                              : "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className={styles.emptyCell}>
                          Chưa có lịch sử bay.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </CommonModal>
  );
};

export default DroneDetailModal;
