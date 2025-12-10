import React, { useState, useEffect, useMemo } from "react";
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
import styles from "./DroneMap.module.scss";

// Services
import { useAuth } from "../../../../context/AuthContext";
import { useToast } from "../../../../context/ToastContext";
import { useQuery } from "@tanstack/react-query";
import droneService from "../../../../services/droneService";
import deliveryService from "../../../../services/deliveryService";
import orderService from "../../../../services/orderService";
import storeService from "../../../../services/storeService";
import { vnd } from "../../utils";

// ICONS
const droneIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});
const storeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});
const customerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// Component: Tự động di chuyển map đến trung tâm
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 14);
    const timer = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(timer);
  }, [map, center]);
  return null;
};

const DroneMap = ({
  isEmbedded = false,
  storeId: propStoreId,
  onOrderSelect,
}) => {
  const { auth: currentUser } = useAuth();
  const { showToast } = useToast();

  const storeId =
    propStoreId ||
    localStorage.getItem("currentStoreId") ||
    currentUser?.storeId ||
    1;

  const [activeTab, setActiveTab] = useState("pending");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. LẤY THÔNG TIN STORE (Start Point)
  const { data: store } = useQuery({
    queryKey: ["storeInfo", storeId],
    queryFn: async () => {
      const stores = await storeService.getAll();
      return (
        stores.find((s) => s.id.toString() === storeId.toString()) || stores[0]
      );
    },
    staleTime: Infinity,
  });

  // 2. LẤY DANH SÁCH DRONE
  const { data: drones = [], refetch: refetchDrones } = useQuery({
    queryKey: ["drones"],
    queryFn: async () => await droneService.getAllDrones(),
    refetchInterval: 2000, // Refresh nhanh để thấy drone di chuyển
  });

  // 3. LẤY DANH SÁCH ĐƠN HÀNG
  const { data: orders = [], refetch: refetchOrders } = useQuery({
    queryKey: ["droneMapOrders", storeId],
    queryFn: async () => await orderService.getAllStoreOrders(storeId),
    refetchInterval: 3000,
  });

  // [UPDATED] TRACKING LOGIC - DÙNG API MỚI
  useEffect(() => {
    let intervalId;

    // Chỉ tracking khi ở tab "Đang bay" và đã chọn đơn hàng
    if (activeTab === "flying" && selectedOrder) {
      const pollTracking = async () => {
        try {
          // Gọi API lấy thông tin vận chuyển theo OrderID
          const data = await deliveryService.getDeliveryByOrderId(
            selectedOrder.id
          );
          if (data) {
            setTrackingData(data);
          }
        } catch (e) {
          console.error("Tracking error:", e);
        }
      };

      pollTracking(); // Gọi ngay lập tức
      intervalId = setInterval(pollTracking, 2000); // Lặp lại mỗi 2s
    } else {
      setTrackingData(null);
    }
    return () => clearInterval(intervalId);
  }, [selectedOrder, activeTab]);

  // [UPDATED] HANDLER GỌI DRONE - BỎ LOCALSTORAGE
  const handleCallDrone = async (e, order) => {
    e.stopPropagation();
    try {
      // B1: Tìm Drone rảnh
      const candidates = await droneService.getCandidateDrones(15, storeId);
      if (!candidates || candidates.length === 0) {
        showToast({
          title: "Lỗi",
          message: "Không có Drone rảnh!",
          type: "error",
        });
        return;
      }
      const selectedDrone = candidates[0];

      // B2: Tạo Delivery
      await deliveryService.createDelivery(order.id, selectedDrone.id);

      // B3: Thông báo & Refresh
      showToast({
        title: "Thành công",
        message: `Drone ${selectedDrone.serial} bắt đầu giao!`,
        type: "success",
      });

      await refetchOrders();
      await refetchDrones();

      // B4: Chuyển tab & Chọn đơn để tracking ngay
      setActiveTab("flying");
      handleOrderClick(order);
    } catch (err) {
      showToast({
        title: "Lỗi",
        message: "Điều phối thất bại.",
        type: "error",
      });
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    // Nếu props onOrderSelect được truyền (từ Orders.jsx), gọi nó để mở Modal Admin
    // if (onOrderSelect) onOrderSelect(order);
    // -> NOTE: Tạm tắt dòng trên để click vào card chỉ vẽ map nhỏ,
    // muốn xem chi tiết thì bấm nút "Xem chi tiết" riêng.
  };

  const handleViewDetail = (e, order) => {
    e.stopPropagation();
    if (onOrderSelect) onOrderSelect(order);
  };

  // FILTER ORDERS THEO TAB
  const filteredOrders = useMemo(() => {
    let list = orders;
    if (activeTab === "pending")
      list = list.filter((o) =>
        ["PLACED", "CONFIRMED", "READY_FOR_DELIVERY"].includes(o.orderStatus)
      );
    else if (activeTab === "flying")
      list = list.filter((o) =>
        ["IN_PROGRESS", "SHIPPING", "OUT_FOR_DELIVERY"].includes(o.orderStatus)
      );
    else
      list = list.filter((o) =>
        ["COMPLETED", "DELIVERED", "CANCELLED", "FAILED"].includes(
          o.orderStatus
        )
      );

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter((o) => o.id.toString().includes(lower));
    }
    return list.sort((a, b) => b.id - a.id);
  }, [orders, activeTab, searchTerm]);

  if (!store) return <div>Đang tải bản đồ...</div>;

  // --- TỌA ĐỘ VẼ MAP ---
  const storeLocation = [store.lat || 10.776019, store.lng || 106.702068];

  // Center Map: Ưu tiên Drone > Khách > Kho
  let mapCenter = storeLocation;
  if (trackingData) {
    mapCenter = [trackingData.currentLat, trackingData.currentLng];
  } else if (selectedOrder && selectedOrder.customerLocation) {
    // Fallback nếu chưa có tracking data nhưng có info khách (ít khi xảy ra với logic mới)
    // selectedOrder.customerLocation có thể là object hoặc array tùy API trả về của order
    const lat =
      selectedOrder.customerLocation.lat || selectedOrder.customerLocation[0];
    const lng =
      selectedOrder.customerLocation.lng || selectedOrder.customerLocation[1];
    if (lat) mapCenter = [lat, lng];
  }

  return (
    <div
      className={styles.container}
      style={isEmbedded ? { padding: 0, height: "100%", gap: 0 } : {}}
    >
      {/* SIDEBAR */}
      <div
        className={styles.sidebar}
        style={
          isEmbedded
            ? {
                height: "100%",
                borderRadius: 0,
                border: "none",
                borderRight: "1px solid #e5e7eb",
              }
            : {}
        }
      >
        {!isEmbedded && (
          <div className={styles.header}>
            <h2 className={styles.title}>Điều phối Drone</h2>
          </div>
        )}

        {isEmbedded && (
          <div
            className={styles.header}
            style={{ paddingTop: 10, paddingBottom: 10 }}
          >
            <div className={styles.searchBox}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Tìm đơn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}

        <div
          className={styles.tabs}
          style={isEmbedded ? { margin: "0 10px" } : {}}
        >
          <button
            className={`${styles.tab} ${
              activeTab === "pending" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveTab("pending");
              setSelectedOrder(null);
              setTrackingData(null);
            }}
          >
            Chuẩn bị
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "flying" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveTab("flying");
              setSelectedOrder(null);
              setTrackingData(null);
            }}
          >
            Đang bay
          </button>
        </div>

        <div className={styles.list}>
          {filteredOrders.length === 0 ? (
            <div className={styles.empty}>Không có đơn hàng</div>
          ) : (
            filteredOrders.map((order) => {
              const isSelected = selectedOrder?.id === order.id;
              // Tìm drone đang phụ trách đơn này (để hiển thị tag)
              const linkedDrone = drones.find(
                (d) => d.currentOrderId === order.id || d.id === order.droneId
              );

              return (
                <div
                  key={order.id}
                  className={`${styles.card} ${
                    isSelected ? styles.selected : ""
                  }`}
                  onClick={() => handleOrderClick(order)}
                >
                  <div className={styles.cardTop}>
                    <span className={styles.oid}>#{order.id}</span>
                    <span className={styles.price}>
                      {vnd(order.totalPrice)}
                    </span>
                  </div>
                  <div className={styles.cardInfo}>
                    {/* Hiển thị địa chỉ ngắn gọn */}
                    <i className="fa-solid fa-location-dot"></i>
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {order.deliveryInfo?.address || "---"}
                    </span>
                  </div>

                  {activeTab === "flying" && linkedDrone && (
                    <div className={styles.droneTag}>
                      🚁 {linkedDrone.serial}
                    </div>
                  )}

                  {/* Nút Xem Chi Tiết */}
                  {onOrderSelect && (
                    <button
                      className={styles.btnDetailSmall}
                      onClick={(e) => handleViewDetail(e, order)}
                    >
                      Xem chi tiết
                    </button>
                  )}

                  {/* Nút Gọi Drone (Chỉ hiện khi Ready) */}
                  {activeTab === "pending" &&
                    order.orderStatus === "READY_FOR_DELIVERY" && (
                      <button
                        className={styles.btnCall}
                        onClick={(e) => handleCallDrone(e, order)}
                      >
                        🚀 Gọi Drone
                      </button>
                    )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MAP AREA */}
      <div
        className={styles.mapWrapper}
        style={isEmbedded ? { border: "none", borderRadius: 0 } : {}}
      >
        <MapContainer
          center={storeLocation}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
        >
          <MapUpdater center={mapCenter} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* 1. MARKER KHO/CỬA HÀNG */}
          <Marker position={storeLocation} icon={storeIcon}>
            <Popup>
              <b>{store.name}</b>
              <br />
              Kho xuất phát
            </Popup>
          </Marker>

          {/* 2. VẼ TẤT CẢ DRONES (Realtime Position) */}
          {drones.map((d) => {
            // Nếu drone này đang được track trong order được chọn -> Không vẽ ở đây để tránh trùng lặp marker
            // Hoặc cứ vẽ đè lên cũng được, nhưng tốt nhất là vẽ mờ đi hoặc icon khác
            const lat = d.currentLat || storeLocation[0];
            const lng = d.currentLng || storeLocation[1];
            return (
              <Marker
                key={d.id}
                position={[lat, lng]}
                icon={droneIcon}
                opacity={0.7}
              >
                <Popup>
                  <b>{d.serial}</b>
                  <br />
                  Trạng thái: {d.status}
                </Popup>
              </Marker>
            );
          })}

          {/* 3. VẼ TRACKING CHI TIẾT CHO ĐƠN ĐANG CHỌN */}
          {activeTab === "flying" && selectedOrder && trackingData && (
            <>
              {/* Drone Marker (Active) - Đè lên drone marker thường */}
              <Marker
                position={[trackingData.currentLat, trackingData.currentLng]}
                icon={droneIcon}
                zIndexOffset={1000} // Luôn hiện trên cùng
              >
                <Popup>
                  <b>Đang giao đơn #{selectedOrder.id}</b>
                  <br />
                  Tiến độ: {trackingData.progressPct?.toFixed(1)}%
                </Popup>
              </Marker>

              {/* Customer Marker */}
              <Marker
                position={[trackingData.endLat, trackingData.endLng]}
                icon={customerIcon}
              >
                <Popup>Khách hàng</Popup>
              </Marker>

              {/* Đường bay: Store -> Drone */}
              <Polyline
                positions={[
                  storeLocation,
                  [trackingData.currentLat, trackingData.currentLng],
                ]}
                color="#b5292f"
                weight={4}
              />

              {/* Đường dự kiến: Drone -> Khách */}
              <Polyline
                positions={[
                  [trackingData.currentLat, trackingData.currentLng],
                  [trackingData.endLat, trackingData.endLng],
                ]}
                color="#b5292f"
                weight={2}
                dashArray="5, 10"
                opacity={0.6}
              />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default DroneMap;
