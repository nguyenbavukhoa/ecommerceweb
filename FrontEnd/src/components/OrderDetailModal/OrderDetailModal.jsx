// src/components/OrderDetailModal/OrderDetailModal.jsx
import { useState } from "react";
import styles from "./OrderDetailModal.module.css";
import ImageWithFallback from "../ImageWithFallbackComponent/ImageWithFallback";
import OrderTrackingModal from "../OrderTrackingModal/OrderTrackingModal";

const vnd = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

const TimelineTracker = ({ order }) => {
  // [CẬP NHẬT] Map trạng thái vào các bước
  // Bước 1: PLACED
  // Bước 2: CONFIRMED hoặc PICKING (Xử lý/Lấy hàng)
  // Bước 3: SHIPPING
  // Bước 4: COMPLETED

  const timelineSteps = [
    { label: "Đã đặt hàng" },
    { label: "Đã xác nhận" },
    { label: "Đang giao" },
    { label: "Hoàn thành" },
  ];

  // Hàm xác định index hiện tại dựa trên trạng thái
  const getCurrentStepIndex = (status) => {
    switch (status) {
      case "PLACED":
        return 0;
      case "CONFIRMED":
        return 1;
      case "PICKING":
        return 1; // PICKING vẫn nằm ở bước 2 (đã xác nhận/đang xử lý) nhưng có thể hiện màu khác
      case "SHIPPING":
        return 2;
      case "COMPLETED":
        return 3;
      default:
        return -1;
    }
  };

  if (order.orderStatus === "CANCELLED") {
    return (
      <div className={styles.timelineWrapper}>
        <div className={styles.timelineContainer}>
          <div
            className={`${styles.timelineSegment} ${styles.cancelled}`}
            style={{ width: "100%" }}
          ></div>
        </div>
        <div className={styles.timelineLabels}>
          <span className={styles.cancelledLabel}>Đơn hàng đã bị hủy</span>
        </div>
      </div>
    );
  }

  const currentStatusIndex = getCurrentStepIndex(order.orderStatus);

  return (
    <div className={styles.timelineWrapper}>
      <div className={styles.timelineContainer}>
        {timelineSteps.map((item, index) => {
          let segmentClass = styles.future; // Mặc định xám

          if (index < currentStatusIndex) {
            segmentClass = styles.completed; // Đã qua (Xanh lá)
          } else if (index === currentStatusIndex) {
            // Trạng thái hiện tại
            if (order.orderStatus === "PICKING" && index === 1) {
              segmentClass = styles.picking; // Màu vàng/cam cho picking
            } else if (order.orderStatus === "SHIPPING" && index === 2) {
              segmentClass = styles.shipping; // Màu xanh dương
            } else if (order.orderStatus === "COMPLETED") {
              segmentClass = styles.completed;
            } else {
              segmentClass = styles.completed; // Các trạng thái tĩnh (PLACED, CONFIRMED) coi như complete step đó
            }
          }

          return (
            <div
              key={index}
              className={`${styles.timelineSegment} ${segmentClass}`}
            ></div>
          );
        })}
      </div>
      <div className={styles.timelineLabels}>
        {timelineSteps.map((item, index) => (
          <span
            key={index}
            className={styles.timelineLabel}
            style={{
              fontWeight: index === currentStatusIndex ? "bold" : "normal",
            }}
          >
            {item.label}
          </span>
        ))}
      </div>

      {/* Hiển thị thêm text trạng thái chi tiết nếu là PICKING */}
      {order.orderStatus === "PICKING" && (
        <div
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#e67e22",
            marginTop: "5px",
            fontStyle: "italic",
          }}
        >
          (Drone đang đến lấy hàng tại quán)
        </div>
      )}
    </div>
  );
};

const OrderDetailModal = ({ order, onClose }) => {
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  if (!order) return null;

  const totalItems = order.orderItems.reduce((sum, p) => sum + p.quantity, 0);
  const deliveryInfo = order.deliveryInfo || {
    name: "Khách hàng",
    phone: "---",
    address: order.customerAddress || "---",
  };

  // Các phần hiển thị còn lại giữ nguyên...
  // (Tôi rút gọn phần dưới để tập trung vào TimelineTracker ở trên)

  return (
    <>
      <div className={styles.modalView}>
        <div className={styles.modalHeader}>
          <button onClick={onClose} className={styles.backBtn}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h3>Thông tin đơn hàng #{order.id}</h3>
        </div>

        <div className={styles.modalContent}>
          {/* TRẠNG THÁI */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>Trạng thái đơn hàng</div>
            <div className={styles.cardBody}>
              <TimelineTracker order={order} />
            </div>
          </div>

          {/* VẬN CHUYỂN */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>Thông tin vận chuyển</div>
            <div className={styles.cardBody}>
              <div className={styles.infoRow}>
                <span>Hình thức:</span>
                <strong>Giao hàng bằng Drone 🚁</strong>
              </div>
              {order.trackingCode ? (
                <>
                  <div className={styles.infoRow}>
                    <span>Mã vận đơn:</span>
                    <strong style={{ color: "#b5292f" }}>
                      {order.trackingCode}
                    </strong>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <button
                      onClick={() => setIsTrackingOpen(true)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#e3f2fd",
                        color: "#005eb8",
                        border: "1px dashed #005eb8",
                        borderRadius: "6px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <i className="fa-solid fa-map-location-dot"></i> Xem chi
                      tiết vận chuyển
                    </button>
                  </div>
                </>
              ) : (
                <div className={styles.infoRow}>
                  <span>Mã vận đơn:</span>
                  <span style={{ color: "#999", fontStyle: "italic" }}>
                    (Đang cập nhật...)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ĐỊA CHỈ */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>Địa chỉ nhận hàng</div>
            <div className={`${styles.cardBody} ${styles.addressBody}`}>
              <i className="fa-solid fa-location-dot"></i>
              <div>
                <p className={styles.addressNamePhone}>
                  <strong>{deliveryInfo.name}</strong> | {deliveryInfo.phone}
                </p>
                <p className={styles.addressText}>{deliveryInfo.address}</p>
              </div>
            </div>
          </div>

          {/* SẢN PHẨM */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              Danh sách sản phẩm ({totalItems} món)
            </div>
            <div className={styles.productList}>
              {order.orderItems.map((p) => (
                <div key={p.id || Math.random()} className={styles.productRow}>
                  <ImageWithFallback
                    src={p.imgUrl}
                    alt={p.productName}
                    className={styles.productImage}
                  />
                  <div className={styles.productInfo}>
                    <p className={styles.productName}>
                      <span className={styles.productQuantity}>
                        {p.quantity}x
                      </span>{" "}
                      {p.productName}
                    </p>
                    {p.optionValuesDTO?.length > 0 && (
                      <p className={styles.productOptions}>
                        {p.optionValuesDTO.map((opt) => opt.value).join(", ")}
                      </p>
                    )}
                  </div>
                  <div className={styles.productPrice}>
                    {vnd((p.price || 0) * p.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.orderSummary}>
              <div className={styles.priceRow}>
                <span>Tổng tiền hàng</span>
                <span>{vnd(order.totalPrice - 15000)}</span>
              </div>
              <div className={styles.priceRow}>
                <span>Phí giao hàng (Drone)</span>
                <span>{vnd(15000)}</span>
              </div>
              <div className={`${styles.priceRow} ${styles.finalTotal}`}>
                <span>Thành tiền</span>
                <span>{vnd(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* THANH TOÁN */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>Chi tiết thanh toán</div>
            <div className={styles.cardBody}>
              <div className={styles.infoRow}>
                <span>Mã đơn hàng:</span>
                <strong>#{order.id}</strong>
              </div>
              <div className={styles.infoRow}>
                <span>Phương thức:</span>
                <strong
                  style={{
                    color:
                      order.paymentMethod === "VNPAY" ? "#005eb8" : "#27ae60",
                  }}
                >
                  {order.paymentMethod || "Tiền mặt"}
                </strong>
              </div>
              <div className={styles.infoRow}>
                <span>Thời gian đặt:</span>
                <strong>{order.orderTime}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        order={order}
      />
    </>
  );
};

export default OrderDetailModal;
