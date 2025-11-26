import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  useMap,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./DroneMap.scss";

import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../../context/AuthContext";
import { useToast } from "../../../../context/ToastContext";
import { db } from "../../../../data/mockData";
import { vnd } from "../../utils";

// --- ICONS ---
const droneIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2010/2010887.png",
  iconSize: [45, 45],
  iconAnchor: [22, 22],
});
const storeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
const destIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// --- HELPER: Kiểm tra tọa độ hợp lệ (QUAN TRỌNG) ---
const isValidLatLng = (pos) => {
  return (
    Array.isArray(pos) && pos.length === 2 && !isNaN(pos[0]) && !isNaN(pos[1])
  );
};

// Component chọn vị trí
const LocationPicker = ({ setDeliveryPos, disabled }) => {
  useMapEvents({
    click(e) {
      if (disabled) return;
      const { lat, lng } = e.latlng;
      setDeliveryPos([lat, lng]);
    },
  });
  return null;
};

// Component camera bay
const FlyToLocation = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (isValidLatLng(position)) {
      map.flyTo(position, 15, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
};

const DroneMap = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const currentStoreId = user?.storeId;

  const [storeInfo, setStoreInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [dronePos, setDronePos] = useState(null);
  const [deliveryPos, setDeliveryPos] = useState(null);

  const [status, setStatus] = useState("🚁 Drone đang chờ tại trạm.");
  const [direction, setDirection] = useState("idle");
  const [addressInput, setAddressInput] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const isBusy = direction !== "idle";
  const dronePosRef = useRef(dronePos);

  // --- LOAD DATA ---
  const refreshData = () => {
    if (!currentStoreId) return;

    const store = db.stores.getOne(currentStoreId);
    if (store) {
      // Fallback: Nếu store chưa có location (dữ liệu cũ), gán tạm Quận 1
      if (!isValidLatLng(store.location)) {
        store.location = [10.776019, 106.702068];
      }
      setStoreInfo(store);

      if (direction === "idle") {
        setDronePos(store.location);
      }
    }

    const allOrders = db.orders
      .getAll()
      .filter((o) => o.restaurantId === currentStoreId);
    setOrders(allOrders);
  };

  useEffect(() => {
    refreshData();
  }, [currentStoreId]);

  const readyOrders = useMemo(
    () => orders.filter((o) => o.orderStatus === "CONFIRMED"),
    [orders]
  );
  const shippingOrders = useMemo(
    () => orders.filter((o) => o.orderStatus === "SHIPPING"),
    [orders]
  );
  const completedOrders = useMemo(
    () => orders.filter((o) => o.orderStatus === "COMPLETED").slice(0, 5),
    [orders]
  );

  useEffect(() => {
    dronePosRef.current = dronePos;
  }, [dronePos]);

  // --- LOGIC ANIMATION ---
  useEffect(() => {
    if (direction !== "toCustomer" || !deliveryPos) return;

    let cancelled = false;
    const stepFactor = 0.008;
    const tickMs = 50;

    const id = setInterval(() => {
      if (cancelled) return;

      // Lấy vị trí hiện tại, fallback về store location HOẶC tọa độ cứng nếu store lỗi
      const cur = dronePosRef.current ||
        storeInfo?.location || [10.776019, 106.702068];

      // [SỬA LỖI] Kiểm tra tính hợp lệ trước khi tính toán
      if (!isValidLatLng(cur) || !isValidLatLng(deliveryPos)) {
        console.warn(
          "Invalid LatLng detected, stopping animation:",
          cur,
          deliveryPos
        );
        clearInterval(id);
        return;
      }

      const [lat, lng] = cur;
      const [targetLat, targetLng] = deliveryPos;

      const latDiff = targetLat - lat;
      const lngDiff = targetLng - lng;
      const dist = Math.sqrt(latDiff ** 2 + lngDiff ** 2);

      if (dist < 0.0005) {
        // ĐẾN NƠI
        if (selectedOrder) {
          db.orders.updateStatus(selectedOrder.id, "COMPLETED");

          queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
          queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });

          showToast(
            "success",
            `Đơn hàng #${selectedOrder.id} đã giao thành công!`
          );
        }

        setStatus("✅ Đã giao hàng thành công! Drone đang quay về.");
        setSelectedOrder(null);
        setDirection("idle");
        setDronePos(storeInfo?.location);
        refreshData();
        clearInterval(id);
        return;
      }

      // Bay tiếp
      setDronePos([lat + latDiff * stepFactor, lng + lngDiff * stepFactor]);
    }, tickMs);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [
    direction,
    deliveryPos,
    selectedOrder,
    storeInfo,
    queryClient,
    showToast,
  ]);

  // --- HANDLERS ---
  const handleSelectOrder = (order) => {
    if (isBusy) return showToast("warning", "Drone đang bận giao đơn khác!");
    setSelectedOrder(order);

    if (isValidLatLng(order.customerLocation)) {
      setDeliveryPos(order.customerLocation);
      setStatus(`📦 Đơn #${order.id} - ${order.customerAddress}`);
    } else {
      setDeliveryPos(null);
      setStatus(
        `📦 Đơn #${order.id}. Chưa có tọa độ, vui lòng chọn trên bản đồ.`
      );
    }
  };

  const handleStartDelivery = () => {
    if (!selectedOrder)
      return showToast("warning", "Vui lòng chọn đơn hàng trước.");
    if (!deliveryPos) return showToast("warning", "Chưa có tọa độ giao hàng.");

    try {
      db.orders.assignDrone(selectedOrder.id);
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });

      showToast("info", `🚀 Drone bắt đầu giao đơn #${selectedOrder.id}`);
      setStatus(`🚁 Đang bay đến: ${selectedOrder.customerAddress}`);
      setDirection("toCustomer");
      refreshData();
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const handleSearchAddress = async () => {
    if (!addressInput.trim()) return;
    if (isBusy) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          addressInput
        )}`
      );
      const data = await res.json();
      if (data.length > 0) {
        setDeliveryPos([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        setStatus("📍 Đã tìm thấy địa chỉ.");
      } else showToast("error", "Không tìm thấy địa chỉ.");
    } catch {
      showToast("error", "Lỗi kết nối bản đồ.");
    }
  };

  const calcDistanceKm = (pos1, pos2) => {
    if (!isValidLatLng(pos1) || !isValidLatLng(pos2)) return 0;
    const R = 6371;
    const dLat = ((pos2[0] - pos1[0]) * Math.PI) / 180;
    const dLon = ((pos2[1] - pos1[1]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((pos1[0] * Math.PI) / 180) *
        Math.cos((pos2[0] * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const calcETA = (distanceKm) => {
    const minutes = Math.max(1, Math.round((distanceKm / 60) * 60));
    return `${minutes} phút`;
  };

  if (!storeInfo)
    return <div className="loading">Đang tải dữ liệu bản đồ...</div>;

  // [SỬA LỖI] Center mặc định an toàn
  const mapCenter = isValidLatLng(storeInfo.location)
    ? storeInfo.location
    : [10.776019, 106.702068];

  return (
    <div className="drone-map-container">
      <h2 className="page-title">🚁 Quản lý Drone - {storeInfo.name}</h2>

      <div className="layout-grid">
        <div className="sidebar-panel">
          {/* Control Box */}
          <div className="control-box">
            <div className="address-input">
              <input
                type="text"
                placeholder="Tìm địa chỉ thủ công..."
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                disabled={isBusy}
              />
              <button
                onClick={handleSearchAddress}
                disabled={isBusy || !addressInput}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>

            <div
              className={`status-box ${
                direction === "toCustomer" ? "active" : ""
              }`}
            >
              <p>
                <b>Trạng thái:</b> {status}
              </p>
              {direction === "toCustomer" && deliveryPos && dronePos && (
                <div className="flight-stats">
                  <span>
                    ⏱️ {calcETA(calcDistanceKm(dronePos, deliveryPos))}
                  </span>
                  <span>
                    📏 {calcDistanceKm(dronePos, deliveryPos).toFixed(2)} km
                  </span>
                </div>
              )}
            </div>

            <button
              className={`start-button ${
                direction === "idle" ? "ready" : "flying"
              }`}
              onClick={handleStartDelivery}
              disabled={direction !== "idle" || !selectedOrder}
            >
              {direction === "idle" ? "🚀 BẮT ĐẦU GIAO" : "📡 ĐANG BAY..."}
            </button>
          </div>

          {/* List Đơn hàng */}
          <div className="orders-panel">
            <div className="order-section">
              <h3>📦 Chờ điều phối ({readyOrders.length})</h3>
              <div className="order-list">
                {readyOrders.length === 0 && (
                  <p className="empty-text">Không có đơn chờ.</p>
                )}
                {readyOrders.map((order) => {
                  const customerName =
                    db.users.getOne(order.userId)?.fullName || "Khách vãng lai";
                  return (
                    <div
                      key={order.id}
                      className={`order-card ${
                        selectedOrder?.id === order.id ? "active" : ""
                      }`}
                      onClick={() => handleSelectOrder(order)}
                    >
                      <div className="order-header">
                        <span className="order-id">#{order.id}</span>
                        <span className="order-price">
                          {vnd(order.totalPrice)}
                        </span>
                      </div>
                      <div className="order-detail">
                        📍 {order.customerAddress || "Chưa có địa chỉ"}
                      </div>
                      <div className="order-meta">
                        <i className="fa-regular fa-user"></i> {customerName}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="order-section">
              <h3>📡 Đang bay ({shippingOrders.length})</h3>
              <div className="order-list">
                {shippingOrders.map((order) => (
                  <div key={order.id} className="order-card flying">
                    <div className="order-header">
                      <span className="order-id">#{order.id}</span>
                      <span className="droneId">🤖 {order.droneId}</span>
                    </div>
                    <div className="order-detail">Đang giao...</div>
                    <div className="progressBar">
                      <div className="progressInner"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-section">
              <h3>✅ Lịch sử gần đây</h3>
              <div className="order-list completed-list">
                {completedOrders.map((order) => (
                  <div key={order.id} className="order-card completed">
                    <div className="order-header">
                      <span className="order-id">#{order.id}</span>
                      <span className="delivered-time">Hoàn thành</span>
                    </div>
                    <div className="order-detail">{order.customerAddress}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="map-wrapper">
          <MapContainer center={mapCenter} zoom={14} className="drone-map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap"
            />

            <LocationPicker setDeliveryPos={setDeliveryPos} disabled={isBusy} />
            {deliveryPos && <FlyToLocation position={deliveryPos} />}

            {/* Store */}
            {isValidLatLng(storeInfo.location) && (
              <Marker position={storeInfo.location} icon={storeIcon}>
                <Popup>
                  <b>{storeInfo.name}</b>
                  <br />
                  Trạm điều hành
                </Popup>
              </Marker>
            )}

            {/* Destination */}
            {isValidLatLng(deliveryPos) && (
              <Marker position={deliveryPos} icon={destIcon} />
            )}

            {/* Drone */}
            {isValidLatLng(dronePos) && (
              <Marker position={dronePos} icon={droneIcon} zIndexOffset={1000}>
                <Popup>Drone đang hoạt động</Popup>
              </Marker>
            )}

            {/* Route */}
            {direction === "toCustomer" &&
              isValidLatLng(deliveryPos) &&
              isValidLatLng(dronePos) && (
                <Polyline
                  positions={[dronePos, deliveryPos]}
                  color="#b5292f"
                  dashArray="10, 10"
                />
              )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default DroneMap;
