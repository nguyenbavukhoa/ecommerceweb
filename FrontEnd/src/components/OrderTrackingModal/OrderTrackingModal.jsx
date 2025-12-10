// src/components/Modals/OrderTrackingModal.jsx
import React, { useEffect, useState, useRef } from "react";
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
import { db } from "../../services/dbService";
import styles from "./OrderTrackingModal.module.scss";

// --- ICONS ---
const droneIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
  iconSize: [45, 45],
  iconAnchor: [22, 22],
  className: "pulsing-icon",
});
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});
const storeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// Component con để auto-zoom bản đồ chứa đủ các điểm
const MapUpdater = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
      if (bounds && bounds.length > 0) {
        // Padding để các điểm không bị sát mép bản đồ
        map.fitBounds(bounds, { padding: [60, 60] });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [map, bounds]);
  return null;
};

const OrderTrackingModal = ({ isOpen, onClose, order }) => {
  const [dronePos, setDronePos] = useState(null);
  const [storePos, setStorePos] = useState(null);
  const [logs, setLogs] = useState([]);
  const modalRef = useRef(null);

  const customerPos = order?.customerLocation;
  const status = order?.orderStatus;

  // Kiểm tra xem đơn có đang được Drone xử lý không
  const isOrderActive = ["PICKING", "SHIPPING"].includes(status);

  // 1. Lấy vị trí Cửa hàng khi mở modal
  useEffect(() => {
    if (isOpen && order?.restaurantId) {
      const fetchStoreLoc = async () => {
        const store = await db.stores.getOne(order.restaurantId);
        if (store && store.location) {
          setStorePos(store.location);
        }
      };
      fetchStoreLoc();
    }
  }, [isOpen, order]);

  // Đóng modal khi click overlay
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // 2. Polling: Cập nhật vị trí Drone & Logs realtime
  useEffect(() => {
    if (!isOpen || !order || !order.droneId) return;

    // Set log ban đầu
    if (order.trackingLogs) setLogs(order.trackingLogs);

    // Nếu đơn đã xong hoặc hủy, không cần polling vị trí nữa
    if (!isOrderActive) return;

    const interval = setInterval(async () => {
      try {
        // Cập nhật vị trí Drone
        const drones = await db.drones.getAll();
        const myDrone = drones.find((d) => d.id === order.droneId);
        if (myDrone) {
          setDronePos([myDrone.currentLat, myDrone.currentLng]);
        }

        // Cập nhật Logs
        const allOrders = await db.orders.getAll();
        const updatedOrder = allOrders.find((o) => o.id === order.id);
        if (updatedOrder && updatedOrder.trackingLogs) {
          setLogs(updatedOrder.trackingLogs);
        }
      } catch (error) {
        console.error("Tracking Error:", error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, order, isOrderActive]);

  if (!isOpen || !order) return null;

  // --- TÍNH TOÁN BOUNDS (VÙNG HIỂN THỊ) ---
  // Gom tất cả các điểm cần hiển thị để zoom bản đồ vừa khít
  const mapBounds = [storePos, customerPos].filter(Boolean);
  if (isOrderActive && dronePos) {
    mapBounds.push(dronePos);
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer} ref={modalRef}>
        {/* Header */}
        <div className={styles.header}>
          <h3>
            VẬN ĐƠN: <span>{order.trackingCode || "---"}</span>
            {status === "COMPLETED" && (
              <span
                style={{
                  color: "#27ae60",
                  marginLeft: "10px",
                  fontSize: "14px",
                }}
              >
                <i className="fa-solid fa-circle-check"></i> Đã giao thành công
              </span>
            )}
          </h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className={styles.body}>
          {/* MAP */}
          <div className={styles.mapSection}>
            {storePos && customerPos ? (
              <MapContainer
                center={storePos}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <MapUpdater bounds={mapBounds} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* --- CÁC ĐIỂM CỐ ĐỊNH --- */}
                <Marker position={storePos} icon={storeIcon}>
                  <Popup>
                    <b>Cửa hàng</b>
                    <br />
                    Điểm lấy món
                  </Popup>
                </Marker>

                <Marker position={customerPos} icon={userIcon}>
                  <Popup>
                    <b>Khách hàng</b>
                    <br />
                    {order.deliveryInfo?.address}
                  </Popup>
                </Marker>

                {/* --- DRONE (CHỈ HIỆN KHI ĐANG BAY) --- */}
                {isOrderActive && dronePos && (
                  <Marker
                    position={dronePos}
                    icon={droneIcon}
                    zIndexOffset={1000}
                  >
                    <Popup>
                      <b>Shipper Drone ({order.droneId})</b>
                      <br />
                      Đang di chuyển...
                    </Popup>
                  </Marker>
                )}

                {/* --- VẼ ĐƯỜNG ĐI (LOGIC MỚI) --- */}

                {/* TRƯỜNG HỢP 1: ĐANG ĐI LẤY HÀNG (PICKING) */}
                {/* Vẽ từ Drone -> Cửa hàng */}
                {status === "PICKING" && dronePos && (
                  <>
                    <Polyline
                      positions={[dronePos, storePos]}
                      color="#e67e22" // Màu cam: Đang đi lấy
                      weight={4}
                      dashArray="10, 10"
                    />
                    {/* Vẫn hiện mờ đường từ Store -> Khách để user biết đích đến tiếp theo */}
                    <Polyline
                      positions={[storePos, customerPos]}
                      color="#ccc"
                      weight={2}
                      dashArray="5, 5"
                    />
                  </>
                )}

                {/* TRƯỜNG HỢP 2: ĐANG GIAO HÀNG (SHIPPING) */}
                {/* Vẽ từ Cửa hàng -> Khách hàng (Drone đang nằm trên đường này) */}
                {status === "SHIPPING" && (
                  <Polyline
                    positions={[storePos, customerPos]}
                    color="#b5292f" // Màu đỏ: Đang giao
                    weight={4}
                  />
                )}

                {/* TRƯỜNG HỢP 3: HOÀN THÀNH (COMPLETED) */}
                {/* Chỉ hiện đường Cửa hàng -> Khách hàng (Lịch sử) */}
                {status === "COMPLETED" && (
                  <Polyline
                    positions={[storePos, customerPos]}
                    color="#27ae60" // Màu xanh: Đã xong
                    weight={4}
                  />
                )}
              </MapContainer>
            ) : (
              <div className={styles.loadingMap}>
                <i className="fa-solid fa-satellite-dish fa-spin fa-2x"></i>
                <p>Đang tải bản đồ...</p>
              </div>
            )}
          </div>

          {/* LOGS */}
          <div className={styles.logSection}>
            <h4>Tiến độ đơn hàng</h4>
            <ul className={styles.timelineList}>
              {logs && logs.length > 0 ? (
                [...logs].reverse().map((log, index) => (
                  <li key={index} className={styles.timelineItem}>
                    <div className={styles.line}></div>
                    <div
                      className={`${styles.dot} ${
                        index === 0 ? styles.active : ""
                      }`}
                    ></div>
                    <span className={styles.time}>{log.time}</span>
                    <span
                      className={`${styles.message} ${
                        index === 0 ? styles.highlight : ""
                      }`}
                    >
                      {log.message}
                    </span>
                  </li>
                ))
              ) : (
                <li className={styles.emptyState}>Đang chờ cập nhật...</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;
