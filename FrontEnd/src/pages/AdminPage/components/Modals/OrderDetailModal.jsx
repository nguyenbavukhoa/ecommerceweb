// import React, { useMemo, useState, useEffect } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
//   useMap,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// import styles from "./OrderDetailModal.module.scss";
// import CommonModal from "./CommonModal";
// import ImageWithFallback from "../../../../components/ImageWithFallbackComponent/ImageWithFallback";

// // Services & Hooks
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import deliveryService from "../../../../services/deliveryService";
// import droneService from "../../../../services/droneService";
// import storeService from "../../../../services/storeService"; // [NEW] Lấy tọa độ kho
// import { useToast } from "../../../../context/ToastContext";

// // --- ICONS ---
// const storeIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
//   iconSize: [40, 40],
//   iconAnchor: [20, 40],
// });
// const droneIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
//   iconSize: [45, 45],
//   iconAnchor: [22, 22],
// });
// const customerIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//   iconSize: [35, 35],
//   iconAnchor: [17, 35],
// });

// // Helper
// const vnd = (amount) =>
//   new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
//     amount
//   );

// // --- COMPONENT: AUTO CENTER MAP ---
// const MapRecenter = ({ center }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (center) {
//       map.flyTo(center, map.getZoom());
//     }
//   }, [center, map]);
//   return null;
// };

// // --- TIMELINE ---
// const StatusTimeline = ({ order }) => {
//   const steps = [
//     { key: "PLACED", label: "Đã đặt hàng", icon: "fa-file-invoice" },
//     { key: "CONFIRMED", label: "Đã xác nhận", icon: "fa-check-circle" },
//     { key: "IN_PROGRESS", label: "Đang chế biến", icon: "fa-fire-burner" },
//     { key: "READY_FOR_DELIVERY", label: "Sẵn sàng giao", icon: "fa-box" },
//     { key: "OUT_FOR_DELIVERY", label: "Đang giao hàng", icon: "fa-drone" },
//     { key: "DELIVERED", label: "Giao thành công", icon: "fa-face-smile" },
//   ];

//   if (["CANCELLED", "REJECTED", "FAILED"].includes(order.orderStatus)) {
//     return (
//       <div
//         className={styles.timelineList}
//         style={{ color: "red", padding: "20px" }}
//       >
//         <i className="fa-solid fa-circle-xmark"></i> Đơn hàng đã bị hủy.
//       </div>
//     );
//   }

//   let currentKey = order.orderStatus;
//   if (currentKey === "SHIPPING") currentKey = "OUT_FOR_DELIVERY";
//   if (currentKey === "COMPLETED") currentKey = "DELIVERED";

//   const currentIndex = steps.findIndex((s) => s.key === currentKey);
//   const displayIndex = currentIndex === -1 ? 0 : currentIndex;

//   return (
//     <div className={styles.timelineList}>
//       {steps.map((step, idx) => {
//         const isActive = idx <= displayIndex;
//         const isCurrent = idx === displayIndex;
//         return (
//           <div
//             key={step.key}
//             className={`${styles.timelineItem} ${
//               isActive ? styles.active : ""
//             } ${isCurrent ? styles.current : ""}`}
//           >
//             {idx < steps.length - 1 && <div className={styles.tlLine}></div>}
//             <div className={styles.tlIcon}>
//               <i className={`fa-solid ${step.icon}`}></i>
//             </div>
//             <div className={styles.tlContent}>
//               <h4>{step.label}</h4>
//               {isCurrent && <span className={styles.timeLabel}>Hiện tại</span>}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// // --- VIEW 1: INFO VIEW ---
// const OrderInfoView = ({ order, customerInfo, onSwitchToTracking }) => {
//   const { showToast } = useToast();
//   const queryClient = useQueryClient();
//   const [isDispatching, setIsDispatching] = useState(false);

//   const totalItems =
//     order.orderItems?.reduce((sum, p) => sum + p.quantity, 0) || 0;

//   const isTrackingAvailable = [
//     "OUT_FOR_DELIVERY",
//     "SHIPPING",
//     "DELIVERED",
//     "COMPLETED",
//   ].includes(order.orderStatus);

//   // LOGIC GỌI DRONE TRỰC TIẾP
//   const handleDispatch = async () => {
//     setIsDispatching(true);
//     try {
//       // 1. Tìm Drone rảnh
//       const candidates = await droneService.getCandidateDrones(
//         15,
//         order.storeId || order.restaurantId || 1
//       );
//       if (!candidates || candidates.length === 0) {
//         throw new Error("Không có Drone nào rảnh lúc này.");
//       }
//       const drone = candidates[0];

//       // 2. Tạo Delivery (API sẽ tự handle trạng thái Order)
//       await deliveryService.createDelivery(order.id, drone.id);

//       // 3. Refresh Data
//       await queryClient.invalidateQueries({ queryKey: ["adminAllOrders"] });

//       showToast({
//         title: "Thành công",
//         message: `Đã gọi Drone ${drone.serial}!`,
//         type: "success",
//       });

//       // 4. Chuyển sang tab Tracking
//       onSwitchToTracking();
//     } catch (e) {
//       showToast({ title: "Lỗi", message: e.message, type: "error" });
//     } finally {
//       setIsDispatching(false);
//     }
//   };

//   return (
//     <div className={styles.infoViewContainer}>
//       <div className={styles.infoScrollContent}>
//         {/* HEADER */}
//         <div className={styles.orderHeaderBanner}>
//           <div className={styles.ohLeft}>
//             <span className={styles.ohLabel}>MÃ ĐƠN HÀNG</span>
//             <span className={styles.ohCode}>#{order.id}</span>
//             <span className={styles.ohTime}>
//               {order.orderTime
//                 ? new Date(order.orderTime).toLocaleString("vi-VN")
//                 : "---"}
//             </span>
//           </div>
//           <div className={styles.ohRight}>
//             {order.orderStatus === "READY_FOR_DELIVERY" ? (
//               <button
//                 className={styles.btnDispatch} // Class từ css của bạn
//                 style={{ padding: "10px 20px", fontSize: "14px" }}
//                 onClick={handleDispatch}
//                 disabled={isDispatching}
//               >
//                 {isDispatching ? (
//                   <i className="fa-solid fa-spinner fa-spin"></i>
//                 ) : (
//                   <i className="fa-solid fa-rocket"></i>
//                 )}
//                 {isDispatching ? " Đang xử lý..." : " GỌI DRONE NGAY"}
//               </button>
//             ) : (
//               <div
//                 className={`${styles.statusBadge} ${
//                   styles[order.orderStatus?.toLowerCase()]
//                 }`}
//                 style={{ fontSize: "14px", padding: "8px 16px" }}
//               >
//                 {order.orderStatus}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* LOGISTICS */}
//         <div className={styles.logisticsContainer}>
//           <div className={styles.shippingSection}>
//             <div className={styles.shipHeader}>
//               <div className={styles.carrierInfo}>
//                 <i className="fa-solid fa-drone"></i>
//                 <span>
//                   Đơn vị: <strong>KHK Drone Express</strong>
//                 </span>
//               </div>
//               {isTrackingAvailable && (
//                 <button
//                   className={styles.btnView}
//                   onClick={onSwitchToTracking}
//                   style={{ width: "auto", padding: "5px 10px", gap: "5px" }}
//                 >
//                   Xem bản đồ <i className="fa-solid fa-map-location-dot"></i>
//                 </button>
//               )}
//             </div>

//             <div className={styles.shipBody}>
//               <div className={styles.trackingRow}>
//                 <span className={styles.tkLabel}>Mã vận chuyển:</span>
//                 <span className={styles.tkCode} style={{ color: "#d32f2f" }}>
//                   {order.deliveryId || "---"}
//                 </span>
//               </div>
//               <div className={styles.trackingRow}>
//                 <span className={styles.tkLabel}>Drone ID:</span>
//                 <span className={styles.tkCode}>{order.droneId || "---"}</span>
//               </div>
//             </div>
//           </div>

//           <div className={styles.receiverSection}>
//             <div className={styles.secTitle}>
//               <i className="fa-solid fa-location-dot"></i> Địa chỉ nhận hàng
//             </div>
//             <div className={styles.receiverInfo}>
//               <p className={styles.rcName}>
//                 {customerInfo.fullName}{" "}
//                 <span>| {customerInfo.phoneNumber}</span>
//               </p>
//               <p className={styles.rcAddress}>{customerInfo.address}</p>
//             </div>
//           </div>
//         </div>

//         {/* DETAILS */}
//         <div className={styles.card}>
//           <div className={styles.cardHeader}>
//             Chi tiết sản phẩm ({totalItems})
//           </div>
//           <div className={styles.itemList}>
//             {order.orderItems?.map((p, idx) => (
//               <div key={idx} className={styles.itemRow}>
//                 <ImageWithFallback
//                   src={p.imgUrl || p.productImgUrl}
//                   className={styles.itemThumb}
//                   alt={p.productName}
//                 />
//                 <div className={styles.itemDetails}>
//                   <div className={styles.itemName}>{p.productName}</div>
//                   <div className={styles.itemOpts}>x{p.quantity}</div>
//                 </div>
//                 <div className={styles.itemPrice}>
//                   {vnd(p.price * p.quantity)}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className={styles.summarySection}>
//             <div className={styles.sumRow}>
//               <span>Tổng tiền hàng</span>
//               <span>{vnd(order.totalPrice)}</span>
//             </div>
//             <div className={styles.sumRow}>
//               <span>Phí vận chuyển</span>
//               <span style={{ color: "#27ae60", fontWeight: "bold" }}>
//                 Miễn phí
//               </span>
//             </div>
//             <div className={`${styles.sumRow} ${styles.total}`}>
//               <span>Tổng thanh toán</span>
//               <span>{vnd(order.totalPrice)}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- VIEW 2: TRACKING VIEW (ADMIN) ---
// const OrderTrackingView = ({ order, onBack }) => {
//   const [trackingData, setTrackingData] = useState(null);
//   const [storeLocation, setStoreLocation] = useState(null);

//   const defaultCenter = [10.776019, 106.702068];

//   // 1. LẤY TỌA ĐỘ STORE TỪ API (Start Point)
//   const currentStoreId = order.storeId || order.restaurantId || 1;
//   const { data: storeInfo } = useQuery({
//     queryKey: ["storeInfo", currentStoreId],
//     queryFn: async () => {
//       if (!currentStoreId) return null;
//       const stores = await storeService.getAll();
//       return stores.find((s) => s.id.toString() === currentStoreId.toString());
//     },
//   });

//   useEffect(() => {
//     if (storeInfo && storeInfo.lat)
//       setStoreLocation([storeInfo.lat, storeInfo.lng]);
//   }, [storeInfo]);

//   // 2. POLLING API DELIVERY (Để lấy Drone & Khách)
//   useEffect(() => {
//     let intervalId;
//     const isTracking = [
//       "OUT_FOR_DELIVERY",
//       "SHIPPING",
//       "DELIVERED",
//       "COMPLETED",
//     ].includes(order?.orderStatus);

//     if (isTracking) {
//       const poll = async () => {
//         // [QUAN TRỌNG] Gọi API Delivery theo OrderId
//         const data = await deliveryService.getDeliveryByOrderId(order.id);
//         if (data) {
//           setTrackingData(data);
//         }
//       };
//       poll();
//       intervalId = setInterval(poll, 2000);
//     }
//     return () => clearInterval(intervalId);
//   }, [order]);

//   // --- TỌA ĐỘ ---
//   const startPoint = storeLocation || defaultCenter;

//   // End Point: Lấy từ API Delivery (chính xác nhất)
//   const endPoint = trackingData
//     ? [trackingData.endLat, trackingData.endLng]
//     : [10.776, 106.71]; // Fallback

//   // Drone Point
//   const dronePoint = trackingData
//     ? [trackingData.currentLat, trackingData.currentLng]
//     : startPoint;

//   // Center Map
//   const mapCenter =
//     trackingData?.status === "IN_PROGRESS" ? dronePoint : startPoint;

//   return (
//     <div className={styles.trackingViewContainer}>
//       <div className={styles.trackingMapCol}>
//         <MapContainer
//           center={startPoint}
//           zoom={14}
//           style={{ height: "100%", width: "100%" }}
//         >
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//           <MapRecenter center={mapCenter} />

//           {/* STORE */}
//           {storeLocation && (
//             <Marker position={storeLocation} icon={storeIcon}>
//               <Popup>
//                 <b>{storeInfo?.name || "Cửa hàng"}</b>
//               </Popup>
//             </Marker>
//           )}

//           {/* CUSTOMER */}
//           <Marker position={endPoint} icon={customerIcon}>
//             <Popup>
//               <b>Khách hàng</b>
//             </Popup>
//           </Marker>

//           {/* DRONE */}
//           {trackingData && trackingData.status === "IN_PROGRESS" && (
//             <Marker position={dronePoint} icon={droneIcon} zIndexOffset={1000}>
//               <Popup>
//                 <b>Drone đang bay...</b>
//                 <br />
//                 Hoàn thành:{" "}
//                 <span style={{ color: "#b5292f", fontWeight: "bold" }}>
//                   {trackingData.progressPct?.toFixed(1)}%
//                 </span>
//               </Popup>
//             </Marker>
//           )}

//           <Polyline
//             positions={[startPoint, endPoint]}
//             color="#b5292f"
//             dashArray="10, 10"
//             opacity={0.5}
//           />

//           {trackingData && trackingData.status === "IN_PROGRESS" && (
//             <Polyline
//               positions={[startPoint, dronePoint]}
//               color="#b5292f"
//               weight={4}
//             />
//           )}
//         </MapContainer>

//         {/* OVERLAY STATUS */}
//         <div className={styles.mapOverlayInfo}>
//           {trackingData?.status === "IN_PROGRESS" ? (
//             <span style={{ color: "#e65100", fontWeight: "bold" }}>
//               <i className="fa-solid fa-plane"></i> Đang giao hàng &bull;{" "}
//               {trackingData.progressPct?.toFixed(1)}%
//             </span>
//           ) : trackingData?.status === "COMPLETED" ||
//             order.orderStatus === "DELIVERED" ? (
//             <span style={{ color: "green", fontWeight: "bold" }}>
//               <i className="fa-solid fa-check-circle"></i> Đã giao thành công
//             </span>
//           ) : (
//             <span>Đang tải dữ liệu...</span>
//           )}
//         </div>
//       </div>

//       <div className={styles.trackingInfoCol}>
//         <div className={styles.trackingHeader}>
//           <button onClick={onBack} className={styles.backLink}>
//             <i className="fa-solid fa-arrow-left"></i> Quay lại
//           </button>
//           <h4>Giám sát hành trình</h4>
//         </div>

//         <div className={styles.trackingMetaBox}>
//           <div className={styles.trackMetaRow}>
//             <span className={styles.tmLabel}>Delivery ID:</span>
//             <span className={styles.tmValue} style={{ color: "#d32f2f" }}>
//               {trackingData ? `#${trackingData.id}` : "..."}
//             </span>
//           </div>
//           <div className={styles.trackMetaRow}>
//             <span className={styles.tmLabel}>Drone ID:</span>
//             <span className={styles.tmValue}>
//               {order.droneId || trackingData?.droneId || "..."}
//             </span>
//           </div>
//           {trackingData && (
//             <div className={styles.trackMetaRow}>
//               <span className={styles.tmLabel}>Trạng thái:</span>
//               <span
//                 className={styles.tmValue}
//                 style={{
//                   color:
//                     trackingData.status === "IN_PROGRESS" ? "#e67e22" : "green",
//                 }}
//               >
//                 {trackingData.status}
//               </span>
//             </div>
//           )}
//         </div>

//         <div className={styles.timelineWrapper}>
//           <StatusTimeline order={order} />
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- MAIN MODAL ---
// const OrderDetailModal = ({ isOpen, onClose, order }) => {
//   const [viewMode, setViewMode] = useState("INFO");

//   useEffect(() => {
//     if (isOpen) setViewMode("INFO");
//   }, [isOpen, order]);

//   const customerInfo = useMemo(() => {
//     if (!order) return {};
//     const info = order.userInfo || order.deliveryInfo || {};
//     return {
//       fullName: info.fullName || info.name || "Khách vãng lai",
//       phoneNumber: info.phoneNumber || info.phone || "---",
//       address: info.address || "---",
//     };
//   }, [order]);

//   if (!isOpen || !order) return null;

//   return (
//     <CommonModal isOpen={isOpen} onClose={onClose} customWidth="1100px">
//       <div className={styles.adminModalContainer}>
//         <div className={styles.adminModalHeader}>
//           <div className={styles.headerLeft}>
//             <button onClick={onClose} className={styles.btnClose}>
//               <i className="fa-solid fa-xmark"></i>
//             </button>
//             <h3>Chi tiết đơn hàng #{order.id}</h3>
//           </div>
//           <div className={styles.headerRight}>
//             <button className={styles.btnPrint}>
//               <i className="fa-solid fa-print"></i> In phiếu
//             </button>
//           </div>
//         </div>

//         <div className={styles.adminModalBody}>
//           {viewMode === "INFO" ? (
//             <OrderInfoView
//               order={order}
//               customerInfo={customerInfo}
//               onSwitchToTracking={() => setViewMode("TRACKING")}
//             />
//           ) : (
//             <OrderTrackingView
//               order={order}
//               onBack={() => setViewMode("INFO")}
//             />
//           )}
//         </div>
//       </div>
//     </CommonModal>
//   );
// };

// export default OrderDetailModal;
import React, { useMemo } from "react";
import styles from "./OrderDetailModal.module.scss";
import CommonModal from "./CommonModal";
import ImageWithFallback from "../../../../components/ImageWithFallbackComponent/ImageWithFallback";

const vnd = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

// --- COMPONENT: STATUS TIMELINE (Cập nhật MỚI) ---
const StatusTimeline = ({ order }) => {
  const steps = [
    { key: "PLACED", label: "Đặt hàng", icon: "fa-file-invoice" },
    { key: "CONFIRMED", label: "Đã thanh toán", icon: "fa-check-circle" },
    { key: "IN_PROGRESS", label: "Đang tiến hành", icon: "fa-fire-burner" },
    { key: "DELIVERED", label: "Đã giao hàng", icon: "fa-flag-checkered" },
  ];

  if (["CANCELLED"].includes(order.orderStatus)) {
    return (
      <div
        className={styles.timelineList}
        style={{
          color: "#d32f2f",
          padding: "20px",
          fontWeight: "600",
          textAlign: "center",
          border: "1px dashed #d32f2f",
          borderRadius: "8px",
          background: "#ffebee",
        }}
      >
        <i className="fa-solid fa-circle-xmark"></i> Đơn hàng này đã bị hủy.
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.key === order.orderStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className={styles.timelineList} style={{ marginTop: "20px" }}>
      {steps.map((step, idx) => {
        const isActive = idx <= activeIndex;
        const isCurrent = idx === activeIndex;
        return (
          <div
            key={step.key}
            className={`${styles.timelineItem} ${
              isActive ? styles.active : ""
            } ${isCurrent ? styles.current : ""}`}
          >
            {idx < steps.length - 1 && <div className={styles.tlLine}></div>}
            <div className={styles.tlIcon}>
              <i className={`fa-solid ${step.icon}`}></i>
            </div>
            <div className={styles.tlContent}>
              <h4>{step.label}</h4>
              {isCurrent && <span className={styles.timeLabel}>Hiện tại</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ... (Phần OrderInfoView và OrderDetailModal giữ nguyên, chỉ đảm bảo map lại label hiển thị)
// Trong OrderInfoView, sửa phần hiển thị text badge:

const OrderInfoView = ({ order, customerInfo }) => {
  // Map label tiếng Việt
  const getStatusLabel = (s) => {
    const map = {
      PLACED: "Đặt hàng",
      CONFIRMED: "Đã thanh toán",
      IN_PROGRESS: "Đang tiến hành",
      DELIVERED: "Đã giao hàng",
      CANCELLED: "Hủy",
    };
    return map[s] || s;
  };

  // ... (Code cũ giữ nguyên) ...
  // Tại chỗ render Badge:
  // <div className={`${styles.statusBadgeBig} ...`}>{getStatusLabel(order.orderStatus)}</div>

  // Bạn copy lại code OrderInfoView cũ và thay hàm getStatusLabel vào là được.
  // Nếu lười sửa chi tiết thì dùng file Modal cũ nhưng đổi StatusTimeline là OK.

  const totalItems =
    order.orderItems?.reduce((sum, p) => sum + p.quantity, 0) || 0;

  return (
    <div className={styles.infoViewContainer}>
      <div className={styles.infoScrollContent}>
        {/* HEADER */}
        <div className={styles.orderHeaderBanner}>
          <div className={styles.ohLeft}>
            <span className={styles.ohLabel}>MÃ ĐƠN HÀNG</span>
            <span className={styles.ohCode}>#{order.id}</span>
            <span className={styles.ohTime}>
              {order.orderTime
                ? new Date(order.orderTime).toLocaleString("vi-VN")
                : "---"}
            </span>
          </div>
          <div className={styles.ohRight}>
            <div
              className={`${styles.statusBadgeBig} ${
                styles[order.orderStatus?.toLowerCase()] || ""
              }`}
            >
              {getStatusLabel(order.orderStatus)}
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #e1f5fe",
            marginBottom: "20px",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", fontSize: "15px", color: "#333" }}>
            Tiến độ xử lý
          </h4>
          <StatusTimeline order={order} />
        </div>

        {/* LOGISTICS & INFO (Giữ nguyên) */}
        <div className={styles.logisticsContainer}>
          <div className={styles.receiverSection}>
            <div className={styles.secTitle}>
              <i className="fa-solid fa-location-dot"></i> Địa chỉ nhận hàng
            </div>
            <div className={styles.receiverInfo}>
              <p className={styles.rcName}>
                {customerInfo.fullName}{" "}
                <span>| {customerInfo.phoneNumber}</span>
              </p>
              <p className={styles.rcAddress}>{customerInfo.address}</p>
            </div>
          </div>
          <div
            className={styles.receiverSection}
            style={{ borderTop: "1px dashed #eee" }}
          >
            <div className={styles.secTitle}>
              <i className="fa-regular fa-credit-card"></i> Thanh toán
            </div>
            <div
              className={styles.receiverInfo}
              style={{ borderLeft: "none", paddingLeft: 0 }}
            >
              <p style={{ fontSize: "14px", margin: 0 }}>
                Phương thức:{" "}
                <strong>
                  {order.paymentMethod === "VNPAY" ? "VNPAY" : "Tiền mặt"}
                </strong>
              </p>
            </div>
          </div>
        </div>

        {/* PRODUCT LIST (Giữ nguyên) */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            Chi tiết sản phẩm ({totalItems})
          </div>
          <div className={styles.itemList}>
            {order.orderItems?.map((p, idx) => (
              <div key={idx} className={styles.itemRow}>
                <ImageWithFallback
                  src={p.imgUrl || p.productImgUrl}
                  className={styles.itemThumb}
                  alt={p.productName}
                />
                <div className={styles.itemDetails}>
                  <div className={styles.itemName}>{p.productName}</div>
                  <div className={styles.itemOpts}>x{p.quantity}</div>
                  {(p.optionValues || p.optionValuesDTO) && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#999",
                        fontStyle: "italic",
                      }}
                    >
                      {(p.optionValues || p.optionValuesDTO)
                        .map((o) => o.value)
                        .join(", ")}
                    </div>
                  )}
                </div>
                <div className={styles.itemPrice}>
                  {vnd(p.price * p.quantity)}
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

const OrderDetailModal = ({ isOpen, onClose, order }) => {
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
    <CommonModal isOpen={isOpen} onClose={onClose} customWidth="900px">
      <div className={styles.adminModalContainer}>
        <div className={styles.adminModalHeader}>
          <div className={styles.headerLeft}>
            <button onClick={onClose} className={styles.btnClose}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h3>Chi tiết đơn hàng #{order.id}</h3>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.btnPrint}>
              <i className="fa-solid fa-print"></i> In phiếu
            </button>
          </div>
        </div>
        <div className={styles.adminModalBody}>
          <OrderInfoView order={order} customerInfo={customerInfo} />
        </div>
      </div>
    </CommonModal>
  );
};

export default OrderDetailModal;
