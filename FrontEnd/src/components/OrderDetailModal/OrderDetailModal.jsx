import React, { useMemo, useState, useEffect } from "react";
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

import styles from "./OrderDetailModal.module.css";
import CommonModal from "../common/Modal";
import ImageWithFallback from "../ImageWithFallbackComponent/ImageWithFallback";

// Services & Hooks
import { useQuery, useQueryClient } from "@tanstack/react-query";
import deliveryService from "../../services/deliveryService";
import droneService from "../../services/droneService";
import storeService from "../../services/storeService";
import { useToast } from "../../context/ToastContext";

// Helper định dạng tiền
const vnd = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

// --- ICONS ---
const storeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
const droneIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
  iconSize: [45, 45],
  iconAnchor: [22, 22],
});
const customerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// --- COMPONENT: AUTO CENTER MAP ---
// Giúp bản đồ tự động focus vào Drone khi Drone di chuyển
const MapRecenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

// --- TIMELINE ---
const StatusTimeline = ({ order }) => {
  const steps = [
    { key: "PLACED", label: "Đã đặt hàng", icon: "fa-file-invoice" },
    { key: "CONFIRMED", label: "Đã xác nhận", icon: "fa-check-circle" },
    { key: "IN_PROGRESS", label: "Đang chế biến", icon: "fa-fire-burner" },
    { key: "READY_FOR_DELIVERY", label: "Sẵn sàng giao", icon: "fa-box" },
    { key: "OUT_FOR_DELIVERY", label: "Đang giao hàng", icon: "fa-drone" },
    { key: "DELIVERED", label: "Giao thành công", icon: "fa-face-smile" },
  ];

  if (["CANCELLED", "REJECTED", "FAILED"].includes(order.orderStatus)) {
    return <div className={styles.timelineList}>Đơn hàng đã bị hủy.</div>;
  }

  let currentKey = order.orderStatus;
  if (currentKey === "SHIPPING") currentKey = "OUT_FOR_DELIVERY";
  if (currentKey === "COMPLETED") currentKey = "DELIVERED";
  const currentIndex = steps.findIndex((s) => s.key === currentKey);

  return (
    <div className={styles.timelineList}>
      {steps.map((step, idx) => (
        <div
          key={step.key}
          className={`${styles.timelineItem} ${
            idx <= currentIndex ? styles.active : ""
          } ${idx === currentIndex ? styles.current : ""}`}
        >
          <div className={styles.tlIcon}>
            <i className={`fa-solid ${step.icon}`}></i>
          </div>
          <div className={styles.tlContent}>
            <h4>{step.label}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- VIEW 1: INFO VIEW (GIỮ NGUYÊN CODE CỦA BẠN) ---
const OrderInfoView = ({ order, customerInfo, onSwitchToTracking }) => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [isDispatching, setIsDispatching] = useState(false);

  // Tính tổng số lượng món
  const totalItems =
    order.orderItems?.reduce((sum, p) => sum + p.quantity, 0) || 0;

  const isReady = order.orderStatus === "READY_FOR_DELIVERY";
  const isTrackingAvailable = [
    "OUT_FOR_DELIVERY",
    "SHIPPING",
    "DELIVERED",
    "COMPLETED",
  ].includes(order.orderStatus);

  const getStatusLabel = (status) => {
    const map = {
      PLACED: "Mới đặt",
      CONFIRMED: "Đã xác nhận",
      IN_PROGRESS: "Đang chế biến",
      READY_FOR_DELIVERY: "Sẵn sàng giao",
      OUT_FOR_DELIVERY: "Đang giao hàng",
      DELIVERED: "Hoàn tất",
      CANCELLED: "Đã hủy",
    };
    return map[status] || status;
  };

  const handleDispatch = async () => {
    setIsDispatching(true);
    try {
      const allDrones = await droneService.getAllDrones();
      const availableDrone = allDrones.find(
        (d) => d.status === "IDLE" && d.batteryPct > 20
      );
      if (!availableDrone) throw new Error("Không có Drone rảnh!");

      await deliveryService.createDelivery(order.id, availableDrone.id);
      await queryClient.invalidateQueries({ queryKey: ["adminAllOrders"] });
      await queryClient.invalidateQueries({ queryKey: ["droneMapOrders"] });

      showToast({
        title: "Thành công",
        message: `Drone ${availableDrone.serial} đã nhận đơn!`,
        type: "success",
      });
      onSwitchToTracking();
    } catch (e) {
      showToast({ title: "Lỗi", message: e.message, type: "error" });
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className={styles.infoViewContainer}>
      <div className={styles.infoScrollContent}>
        {/* 1. HEADER BANNER */}
        <div className={styles.orderHeaderBanner}>
          <div className={styles.ohLeft}>
            <span className={styles.ohCode}>#{order.id}</span>
            {/* Thêm thời gian nếu có */}
            {order.orderTime && (
              <span
                style={{ fontSize: "13px", marginLeft: "10px", color: "#666" }}
              >
                {new Date(order.orderTime).toLocaleString("vi-VN")}
              </span>
            )}
          </div>
          <div className={styles.ohRight}>
            {isReady ? (
              <button
                className={styles.btnTrackLink}
                style={{
                  background: "#b5292f",
                  border: "none",
                  color: "white",
                }}
                onClick={handleDispatch}
                disabled={isDispatching}
              >
                {isDispatching ? "Đang xử lý..." : "🚀 Gọi Drone Ngay"}
              </button>
            ) : (
              <span
                className={`${styles.statusBadgeBig} ${
                  styles[order.orderStatus]
                }`}
              >
                {getStatusLabel(order.orderStatus)}
              </span>
            )}
          </div>
        </div>

        {/* 2. KHỐI LOGISTICS & THÔNG TIN KHÁCH */}
        <div className={styles.logisticsContainer}>
          {/* TRÊN: VẬN CHUYỂN */}
          <div className={styles.shippingSection}>
            <div className={styles.shipHeader}>
              <div className={styles.carrierInfo}>
                <i className="fa-solid fa-drone"></i> KHK Drone Express
              </div>
              {isTrackingAvailable && (
                <button
                  className={styles.btnTrackLink}
                  onClick={onSwitchToTracking}
                >
                  Theo dõi <i className="fa-solid fa-arrow-right"></i>
                </button>
              )}
            </div>
            <div className={styles.shipBody}>
              <div className={styles.trackingRow}>
                <span className={styles.tkLabel}>
                  Mã vận chuyển (Delivery ID):
                </span>
                <span className={styles.tkCode} style={{ color: "#005eb8" }}>
                  {order.deliveryId || order.id || "---"}
                </span>
              </div>
              <div className={styles.trackingRow}>
                <span className={styles.tkLabel}>Mã vận đơn (Drone):</span>
                <span className={styles.tkCode}>{order.droneId || "---"}</span>
              </div>
            </div>
          </div>

          {/* DƯỚI: ĐỊA CHỈ */}
          <div className={styles.receiverSection}>
            <div className={styles.secTitle}>
              <i className="fa-solid fa-location-dot"></i> Địa chỉ nhận hàng
            </div>
            <div className={styles.receiverInfo}>
              <p className={styles.rcName}>
                {customerInfo.fullName}{" "}
                <span className={styles.rcPhone}>
                  | {customerInfo.phoneNumber}
                </span>
              </p>
              <p className={styles.rcAddress}>{customerInfo.address}</p>
            </div>
          </div>
        </div>

        {/* 3. PHƯƠNG THỨC THANH TOÁN */}
        <div
          className={styles.paymentCard}
          style={{
            marginTop: "15px",
            background: "white",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <div
            className={styles.payRow}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              className={styles.payLabel}
              style={{ fontWeight: "600", color: "#555" }}
            >
              Phương thức thanh toán
            </span>
            <span className={styles.payValue} style={{ fontWeight: "bold" }}>
              {order.paymentMethod === "VNPAY" ? (
                <>
                  <i
                    className="fa-solid fa-credit-card"
                    style={{ color: "#005eb8", marginRight: "5px" }}
                  ></i>{" "}
                  VNPAY
                </>
              ) : (
                <>
                  <i
                    className="fa-solid fa-money-bill-wave"
                    style={{ color: "#27ae60", marginRight: "5px" }}
                  ></i>{" "}
                  Tiền mặt
                </>
              )}
            </span>
          </div>
        </div>

        {/* 4. DANH SÁCH SẢN PHẨM & TỔNG TIỀN */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            Chi tiết món ăn ({totalItems})
          </div>
          <div className={styles.itemList}>
            {order.orderItems?.map((p, idx) => (
              <div key={idx} className={styles.itemRow}>
                <ImageWithFallback
                  src={p.imgUrl || p.productImgUrl}
                  alt={p.productName}
                  className={styles.itemThumb}
                />
                <div className={styles.itemDetails}>
                  <div className={styles.itemName}>{p.productName}</div>
                  {(p.optionValues || p.optionValuesDTO) && (
                    <div
                      className={styles.itemOpts}
                      style={{
                        fontSize: "12px",
                        color: "#888",
                        marginTop: "2px",
                      }}
                    >
                      {(p.optionValues || p.optionValuesDTO)
                        .map((o) => o.value)
                        .join(", ")}
                    </div>
                  )}
                </div>
                <div className={styles.itemMetaRight}>
                  <span
                    className={styles.itemQty}
                    style={{ marginRight: "10px", fontWeight: "bold" }}
                  >
                    x{p.quantity}
                  </span>
                  <span className={styles.itemPrice}>
                    {vnd(p.price * p.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summarySection}>
            <div className={styles.sumRow}>
              <span>Tổng tiền hàng</span>
              <span>{vnd(order.totalPrice)}</span>
            </div>

            <div className={styles.sumRow}>
              <span>Phí vận chuyển</span>
              <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                Miễn phí
              </span>
            </div>

            <div className={`${styles.sumRow} ${styles.total}`}>
              <span>Tổng thanh toán</span>
              <span>{vnd(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- VIEW 2: TRACKING VIEW (ĐÃ CẬP NHẬT LOGIC MAP & PROGRESS) ---
const OrderTrackingView = ({ order, onBack }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [storeLocation, setStoreLocation] = useState(null);

  // Default Center (HCM) nếu chưa load xong
  const defaultCenter = [10.776019, 106.702068];

  // 1. LẤY VỊ TRÍ STORE (Từ API Restaurants)
  const currentStoreId = order.storeId || order.restaurantId || 1;
  const { data: storeInfo } = useQuery({
    queryKey: ["storeInfo", currentStoreId],
    queryFn: async () => {
      // Tìm đúng cửa hàng để lấy lat/lng
      if (!currentStoreId) return null;
      const stores = await storeService.getAll();
      return stores.find((s) => s.id.toString() === currentStoreId.toString());
    },
  });

  useEffect(() => {
    if (storeInfo && storeInfo.lat)
      setStoreLocation([storeInfo.lat, storeInfo.lng]);
  }, [storeInfo]);

  // 2. POLLING API DELIVERY (Để lấy Drone & Khách Hàng)
  useEffect(() => {
    let intervalId;
    const isTracking = [
      "OUT_FOR_DELIVERY",
      "SHIPPING",
      "DELIVERED",
      "COMPLETED",
    ].includes(order?.orderStatus);

    if (isTracking) {
      const poll = async () => {
        // Gọi API deliveryService (trả về currentLat, endLat, progressPct...)
        const data = await deliveryService.getDeliveryByOrderId(order.id);

        if (data) {
          setTrackingData(data);

          // LOG DEBUG
          if (data.status === "IN_PROGRESS") {
            console.log("📍 [TRACKING API]");
            console.log("   Tiến độ:", data.progressPct, "%");
            console.log("   Drone:", [data.currentLat, data.currentLng]);
            console.log("   Khách:", [data.endLat, data.endLng]);
          }
        }
      };

      poll();
      intervalId = setInterval(poll, 2000);
    }
    return () => clearInterval(intervalId);
  }, [order]);

  // --- LOGIC XÁC ĐỊNH TỌA ĐỘ MARKER ---

  // A. STORE: Lấy từ storeService
  const startPoint = storeLocation || defaultCenter;

  // B. KHÁCH: Lấy từ trackingData.endLat/Lng (API Delivery trả về chính xác vị trí giao)
  // Nếu chưa có tracking data thì tạm thời fallback về default
  const endPoint = trackingData
    ? [trackingData.endLat, trackingData.endLng]
    : [10.776, 106.71];

  // C. DRONE: Lấy từ trackingData.currentLat/Lng
  const dronePoint = trackingData
    ? [trackingData.currentLat, trackingData.currentLng]
    : startPoint;

  // MAP CENTER: Ưu tiên Drone nếu đang bay, nếu không thì hiện Store
  const mapCenter =
    trackingData?.status === "IN_PROGRESS" ? dronePoint : startPoint;

  return (
    <div className={styles.trackingViewContainer}>
      <div className={styles.trackingMapCol}>
        <MapContainer
          center={startPoint}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Tự động di chuyển map theo Drone */}
          <MapRecenter center={mapCenter} />

          {/* Marker 1: Cửa hàng (Lấy từ API Store) */}
          {storeLocation && (
            <Marker position={storeLocation} icon={storeIcon}>
              <Popup>
                <b>{storeInfo?.name || "Cửa hàng"}</b>
                <br />
                Điểm xuất phát
              </Popup>
            </Marker>
          )}

          {/* Marker 2: Khách hàng (Lấy từ API Delivery - endLat/Lng) */}
          <Marker position={endPoint} icon={customerIcon}>
            <Popup>Khách hàng (Điểm đến)</Popup>
          </Marker>

          {/* Marker 3: Drone (Lấy từ API Delivery - currentLat/Lng) */}
          {trackingData && trackingData.status === "IN_PROGRESS" && (
            <Marker
              position={dronePoint}
              icon={droneIcon}
              zIndexOffset={1000} // Luôn hiện trên cùng
            >
              <Popup>
                <b>Drone đang bay...</b>
                <br />
                {/* HIỂN THỊ PHẦN TRĂM HOÀN THÀNH TỪ API */}
                Hoàn thành:{" "}
                <span style={{ color: "#b5292f", fontWeight: "bold" }}>
                  {trackingData.progressPct?.toFixed(1)}%
                </span>
              </Popup>
            </Marker>
          )}

          {/* Đường dự kiến: Store -> Khách */}
          <Polyline
            positions={[startPoint, endPoint]}
            color="#b5292f"
            dashArray="5, 10"
            opacity={0.5}
          />

          {/* Đường bay thực tế: Store -> Drone */}
          {trackingData && trackingData.status === "IN_PROGRESS" && (
            <Polyline
              positions={[startPoint, dronePoint]}
              color="#b5292f"
              weight={4}
            />
          )}
        </MapContainer>

        {/* OVERLAY HIỂN THỊ TRẠNG THÁI */}
        <div className={styles.mapOverlayInfo}>
          <span className={styles.overlayTitle}>
            {trackingData?.status === "COMPLETED" ||
            order.orderStatus === "DELIVERED" ? (
              "Giao hàng thành công"
            ) : trackingData?.status === "IN_PROGRESS" ? (
              // Sử dụng progressPct thay vì rangeKm
              <>
                Đang vận chuyển &bull; {trackingData.progressPct?.toFixed(1)}%
              </>
            ) : (
              "Đang xử lý..."
            )}
          </span>
        </div>
      </div>

      <div className={styles.trackingInfoCol}>
        <div className={styles.trackingHeader}>
          <button onClick={onBack} className={styles.backLink}>
            <i className="fa-solid fa-arrow-left"></i> Quay lại
          </button>
          <h4>Tiến độ đơn hàng</h4>
        </div>

        <div className={styles.trackingMetaBox}>
          <div className={styles.trackMetaRow}>
            <span className={styles.tmLabel}>Mã vận chuyển:</span>
            <span className={styles.tmValue} style={{ color: "#005eb8" }}>
              {trackingData ? `#${trackingData.id}` : "Đang lấy..."}
            </span>
          </div>
          <div className={styles.trackMetaRow}>
            <span className={styles.tmLabel}>Mã Drone:</span>
            <span className={styles.tmValue}>
              {order.droneId || trackingData?.droneId || "..."}
            </span>
          </div>
          {trackingData && (
            <div className={styles.trackMetaRow}>
              <span className={styles.tmLabel}>Trạng thái:</span>
              <span
                className={styles.tmValue}
                style={{
                  color:
                    trackingData.status === "IN_PROGRESS"
                      ? "#e67e22"
                      : "#27ae60",
                  fontWeight: "bold",
                }}
              >
                {/* Logic hiển thị text trạng thái kèm % */}
                {trackingData.status === "IN_PROGRESS"
                  ? `Đang bay (${trackingData.progressPct?.toFixed(0)}%)`
                  : trackingData.status}
              </span>
            </div>
          )}
        </div>

        <div className={styles.timelineWrapper}>
          <StatusTimeline order={order} />
        </div>
      </div>
    </div>
  );
};

// --- MAIN MODAL ---
const OrderDetailModal = ({ isOpen, onClose, order }) => {
  const [viewMode, setViewMode] = useState("INFO");

  useEffect(() => {
    if (isOpen) setViewMode("INFO");
  }, [isOpen, order]);

  const customerInfo = useMemo(() => {
    if (!order) return {};
    const info = order.userInfo || order.deliveryInfo || {};
    return {
      fullName: info.fullName || info.name || "Khách vãng lai",
      phoneNumber: info.phoneNumber || info.phone || "---",
      address: info.address || "---",
    };
  }, [order]);

  if (!isOpen || !order) return null;

  return (
    <CommonModal isOpen={isOpen} onClose={onClose} customWidth="1000px">
      <div className={styles.adminModalContainer}>
        <div className={styles.adminModalHeader}>
          <div className={styles.headerLeft}>
            <button onClick={onClose} className={styles.btnClose}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h3>
              {viewMode === "INFO" ? "Quản lý đơn hàng" : "Giám sát vận chuyển"}
            </h3>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.btnPrint}>
              <i className="fa-solid fa-print"></i> In phiếu
            </button>
          </div>
        </div>

        <div className={styles.adminModalBody}>
          {viewMode === "INFO" ? (
            <OrderInfoView
              order={order}
              customerInfo={customerInfo}
              onSwitchToTracking={() => setViewMode("TRACKING")}
            />
          ) : (
            <OrderTrackingView
              order={order}
              onBack={() => setViewMode("INFO")}
            />
          )}
        </div>
      </div>
    </CommonModal>
  );
};

export default OrderDetailModal;
