// src/pages/ServerPage/components/Modals/DroneDetailModal.jsx
import React, { useState, useEffect } from "react";
import CommonModal from "../../../AdminPage/components/Modals/CommonModal";
import styles from "./DroneDetailModal.module.scss";
import { useToast } from "../../../../context/ToastContext";
import { db } from "../../../../services/dbService";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const DroneDetailModal = ({ isOpen, onClose, droneId, onSaveSuccess }) => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const isEdit = !!droneId;

  // 1. Lấy dữ liệu Drone hiện tại (Chỉ khi Edit)
  const { data: drone } = useQuery({
    queryKey: ["droneDetail", droneId],
    queryFn: async () => {
      const allDrones = await db.drones.getAll();

      // FIX: Ép cả 2 về chuỗi để so sánh (tránh lỗi 1 bên là số, 1 bên là chữ)
      return allDrones.find((d) => String(d.id) === String(droneId));
    },
    enabled: !!droneId && isOpen,
    refetchInterval: 2000,
  });

  // 2. Lấy danh sách Hubs (Ở đây mình giả sử Stores đóng vai trò là Hub trạm sạc)
  const { data: hubs } = useQuery({
    queryKey: ["allHubs"],
    queryFn: async () => {
      // Nếu bạn có bảng 'hubs' riêng thì sửa thành db.hubs.getAll()
      // Ở đây mình lấy danh sách cửa hàng để làm trạm
      return await db.stores.getAll();
    },
    enabled: isOpen,
  });

  // 3. Lấy Lịch sử đơn hàng thực tế từ bảng Orders
  const { data: droneHistory } = useQuery({
    queryKey: ["droneHistoryOrders", droneId],
    queryFn: async () => {
      const allOrders = await db.orders.getAll();

      // FIX: Ép kiểu String(order.droneId) === String(droneId)
      return (
        allOrders
          .filter((order) => {
            // 1. So sánh droneId
            const isMyOrder = String(order.droneId) === String(droneId);

            // 2. Lấy trạng thái từ orderStatus (chứ không phải order.status)
            // Dùng ?. để tránh lỗi null, và toLowerCase() để so sánh không phân biệt hoa thường
            const currentStatus = (order.orderStatus || "").toLowerCase();

            // 3. Kiểm tra đã giao hoặc hoàn thành
            const isCompleted =
              currentStatus === "delivered" || currentStatus === "completed";

            return isMyOrder && isCompleted;
          })
          // Sắp xếp mới nhất lên đầu
          .sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          )
      );
    },
    enabled: !!droneId && isOpen,
  });

  const [formData, setFormData] = useState({
    name: "",
    status: "ready",
    battery: 100,
    currentLocation: "", // Sẽ lưu ID hoặc Tên của Hub
  });

  useEffect(() => {
    if (isOpen) {
      if (isEdit && drone) {
        setFormData({
          name: drone.name,
          status: drone.status,
          battery: drone.battery,
          // Nếu drone chưa có location thì default về hub đầu tiên hoặc rỗng
          currentLocation: drone.currentLocation || "",
        });
      } else if (!isEdit) {
        // Reset form khi thêm mới
        setFormData({
          name: "",
          status: "ready",
          battery: 100,
          // Mặc định chọn Hub đầu tiên nếu có
          currentLocation: hubs && hubs.length > 0 ? hubs[0].name : "",
        });
      }
    }
  }, [isOpen, drone, isEdit, hubs]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showToast({
        title: "Lỗi",
        message: "Vui lòng nhập tên Drone",
        type: "warning",
      });
      return;
    }

    if (!formData.currentLocation) {
      showToast({
        title: "Lỗi",
        message: "Vui lòng chọn Trạm (Hub) quản lý",
        type: "warning",
      });
      return;
    }

    try {
      if (isEdit) {
        await db.drones.update(droneId, formData);
        showToast({
          title: "Thành công",
          message: "Đã cập nhật Drone",
          type: "success",
        });
      } else {
        await db.drones.create(formData);
        showToast({
          title: "Thành công",
          message: "Đã thêm Drone mới!",
          type: "success",
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["allDrones"] });
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      showToast({ title: "Lỗi", message: "Có lỗi xảy ra", type: "error" });
    }
  };

  if (isEdit && !drone && isOpen) return null;

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `THÔNG TIN: ${droneId}` : "THÊM DRONE MỚI"}
      customWidth="800px" // Tăng độ rộng một chút để hiển thị bảng lịch sử đẹp hơn
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
                placeholder="VD: Drone Alpha-01"
              />
            </div>

            {/* Chọn HUB (Location) */}
            <div className={styles.formGroup}>
              <label>Trạm Quản Lý (Hub)</label>
              <select
                value={formData.currentLocation}
                onChange={(e) =>
                  setFormData({ ...formData, currentLocation: e.target.value })
                }
                // Chỉ cho phép đổi trạm khi drone đang rảnh
                disabled={
                  isEdit &&
                  formData.status !== "ready" &&
                  formData.status !== "maintenance"
                }
              >
                <option value="">-- Chọn trạm --</option>
                {hubs?.map((hub) => (
                  <option key={hub.id} value={hub.name}>
                    {hub.name} (Store #{hub.id})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                disabled={
                  // Không cho sửa trạng thái bằng tay nếu đang bay
                  drone?.status === "delivering" ||
                  drone?.status === "moving_to_store" ||
                  drone?.status === "returning"
                }
              >
                <option value="ready">Sẵn sàng (Ready)</option>
                <option value="maintenance">Bảo trì (Maintenance)</option>
                <option value="charging">Đang sạc (Charging)</option>
                <option value="moving_to_store" disabled>
                  Đang đi lấy hàng
                </option>
                <option value="delivering" disabled>
                  Đang giao hàng
                </option>
                <option value="returning" disabled>
                  Đang về trạm
                </option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            {/* Hiển thị Pin dạng thanh progress cho đẹp nếu muốn, ở đây giữ nguyên input */}
            {isEdit && (
              <div className={styles.formGroup}>
                <label>Pin hiện tại: {formData.battery}%</label>
                <div
                  style={{
                    width: "100%",
                    height: "10px",
                    background: "#eee",
                    borderRadius: "5px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${formData.battery}%`,
                      height: "100%",
                      background: formData.battery > 20 ? "#4caf50" : "#f44336",
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <button className={styles.btnSave} onClick={handleSave}>
            {isEdit ? "Lưu thay đổi" : "Tạo mới"}
          </button>
        </div>

        {/* --- PHẦN 2: LỊCH SỬ THỰC TẾ --- */}
        {isEdit && (
          <div className={styles.historySection}>
            <h4 className={styles.sectionTitle}>
              📦 Lịch sử giao hàng ({droneHistory?.length || 0})
            </h4>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Ngày giờ</th>
                    <th>Khách hàng</th>
                    <th>Điểm giao</th>
                    <th>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {droneHistory && droneHistory.length > 0 ? (
                    droneHistory.map((order, idx) => (
                      <tr key={idx}>
                        <td>
                          <strong>#{order.id}</strong>
                        </td>
                        <td>
                          {/* Format ngày giờ */}
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString("vi-VN")
                            : "N/A"}
                        </td>
                        <td>{order.customerName || "Khách vãng lai"}</td>
                        <td
                          style={{
                            maxWidth: "200px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {order.deliveryAddress || order.address}
                        </td>
                        <td>
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(order.totalPrice || 0)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center"
                        style={{ padding: "20px", color: "#888" }}
                      >
                        Drone này chưa hoàn thành đơn hàng nào.
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
