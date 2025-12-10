import React from "react";
import styles from "./OrderDetailModal.module.css";
import ImageWithFallback from "../ImageWithFallbackComponent/ImageWithFallback";

// Helper định dạng
const vnd = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

// Component Timeline (Cập nhật logic trạng thái mới)
const TimelineTracker = ({ order }) => {
  // Định nghĩa các bước trạng thái (Mới)
  const timelineSteps = [
    { key: "PLACED", label: "Đã đặt hàng" },
    { key: "CONFIRMED", label: "Đã xác nhận" },
    { key: "SHIPPING", label: "Đang giao" },
    { key: "COMPLETED", label: "Hoàn thành" },
  ];

  // Nếu đơn bị hủy, hiển thị timeline đặc biệt
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

  // Tìm vị trí trạng thái hiện tại
  const currentStatusIndex = timelineSteps.findIndex(
    (step) => step.key === order.orderStatus
  );

  return (
    <div className={styles.timelineWrapper}>
      <div className={styles.timelineContainer}>
        {timelineSteps.map((item, index) => {
          let segmentClass;
          if (index <= currentStatusIndex) {
            // Đã qua hoặc đang ở: màu xanh
            // Map class style cũ (delivered ~ completed)
            segmentClass = styles.completed;
            if (index === currentStatusIndex && item.key === "SHIPPING")
              segmentClass = styles.shipping;
          } else {
            segmentClass = styles.future; // Chưa tới
          }
          return (
            <div
              key={item.key}
              className={`${styles.timelineSegment} ${segmentClass}`}
            ></div>
          );
        })}
      </div>
      <div className={styles.timelineLabels}>
        {timelineSteps.map((item) => (
          <span key={item.key} className={styles.timelineLabel}>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};

const OrderDetailModal = ({ order, onClose }) => {
  // Nếu không có order (hoặc đang load), return null hoặc loading
  if (!order) return null;

  // Tính tổng số lượng
  const totalItems = order.orderItems.reduce((sum, p) => sum + p.quantity, 0);

  // Lấy thông tin giao hàng từ snapshot (nếu có)
  const deliveryInfo = order.deliveryInfo || {
    name: "Khách hàng",
    phone: "---",
    address: order.customerAddress || "---",
  };

  return (
    <div className={styles.modalView}>
      <div className={styles.modalHeader}>
        <button onClick={onClose} className={styles.backBtn}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h3>Thông tin đơn hàng #{order.id}</h3>
      </div>

      <div className={styles.modalContent}>
        {/* 1. TRẠNG THÁI */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>Trạng thái đơn hàng</div>
          <div className={styles.cardBody}>
            <TimelineTracker order={order} />
          </div>
        </div>

        {/* 2. VẬN CHUYỂN */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>Thông tin vận chuyển</div>
          <div className={styles.cardBody}>
            <div className={styles.infoRow}>
              <span>Hình thức:</span>
              <strong>Giao hàng bằng Drone 🚁</strong>
            </div>
            {order.droneId && (
              <div className={styles.infoRow}>
                <span>Drone ID:</span>
                <strong>{order.droneId}</strong>
              </div>
            )}
          </div>
        </div>

        {/* 3. ĐỊA CHỈ NHẬN HÀNG */}
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

        {/* 4. DANH SÁCH SẢN PHẨM */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            Danh sách sản phẩm ({totalItems} món)
          </div>
          <div className={styles.productList}>
            {order.orderItems.map((p) => (
              <div key={p.id} className={styles.productRow}>
                <ImageWithFallback
                  src={p.imgUrl} // Map imgUrl
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
                  {p.optionValuesDTO && p.optionValuesDTO.length > 0 && (
                    <p className={styles.productOptions}>
                      {p.optionValuesDTO.map((opt) => opt.value).join(", ")}
                    </p>
                  )}
                </div>
                <div className={styles.productPrice}>
                  {vnd(p.price * p.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* TỔNG TIỀN */}
          <div className={styles.orderSummary}>
            {/* Giả lập tính tạm tính (vì mockData chỉ lưu totalPrice tổng) */}
            <div className={styles.priceRow}>
              <span>Tổng tiền hàng</span>
              {/* Tạm tính = Tổng - Ship (15k) */}
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

        {/* 5. CHI TIẾT THANH TOÁN */}
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
  );
};

export default OrderDetailModal;
