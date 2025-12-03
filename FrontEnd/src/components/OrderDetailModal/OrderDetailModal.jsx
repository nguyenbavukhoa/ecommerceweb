import React, { useMemo } from "react";
import styles from "./OrderDetailModal.module.css";
import ImageWithFallback from "../ImageWithFallbackComponent/ImageWithFallback";
import CommonModal from "../common/Modal"; // Import Modal wrapper

// Helper định dạng
const vnd = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

// Component Timeline (Giữ nguyên logic UI cũ, cập nhật key status)
const TimelineTracker = ({ order }) => {
  const timelineSteps = [
    { key: "PLACED", label: "Đã đặt hàng" },
    { key: "CONFIRMED", label: "Đã xác nhận" },
    { key: "SHIPPING", label: "Đang giao" },
    // Map status mới vào các mốc cũ tương đương
    { key: "COMPLETED", label: "Hoàn thành" },
  ];

  // Map status API sang status Timeline cũ
  let currentStatusKey = order.orderStatus;

  // Logic mapping
  if (currentStatusKey === "IN_PROGRESS") currentStatusKey = "CONFIRMED";
  if (currentStatusKey === "READY_FOR_DELIVERY") currentStatusKey = "CONFIRMED";
  if (currentStatusKey === "OUT_FOR_DELIVERY") currentStatusKey = "SHIPPING";
  if (currentStatusKey === "DELIVERED") currentStatusKey = "COMPLETED";

  // Nếu đơn bị hủy
  if (["CANCELLED", "REJECTED", "FAILED"].includes(order.orderStatus)) {
    return (
      <div className={styles.timelineWrapper}>
        <div className={styles.timelineContainer}>
          <div
            className={`${styles.timelineSegment} ${styles.cancelled}`}
            style={{ width: "100%" }}
          ></div>
        </div>
        <div className={styles.timelineLabels}>
          <span className={styles.cancelledLabel}>
            Đơn hàng đã bị hủy / thất bại
          </span>
        </div>
      </div>
    );
  }

  const currentStatusIndex = timelineSteps.findIndex(
    (step) => step.key === currentStatusKey
  );

  return (
    <div className={styles.timelineWrapper}>
      <div className={styles.timelineContainer}>
        {timelineSteps.map((item, index) => {
          let segmentClass;
          if (index <= currentStatusIndex) {
            segmentClass = styles.completed;
            if (index === currentStatusIndex && item.key === "SHIPPING")
              segmentClass = styles.shipping;
          } else {
            segmentClass = styles.future;
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

const OrderDetailModal = ({ order, isOpen, onClose }) => {
  // [LOGIC MỚI] Lấy thông tin giao hàng chuẩn từ API
  const deliveryInfo = useMemo(() => {
    if (order?.userInfo) {
      return {
        name: order.userInfo.fullName || order.userInfo.accountName,
        phone: order.userInfo.phoneNumber,
        address: order.userInfo.address,
      };
    }
    if (order?.deliveryInfo) {
      return {
        name: order.deliveryInfo.name || order.deliveryInfo.fullName,
        phone: order.deliveryInfo.phone || order.deliveryInfo.phoneNumber,
        address: order.deliveryInfo.address,
      };
    }
    return { name: "Khách hàng", phone: "---", address: "---" };
  }, [order]);

  // Nếu dùng CommonModal bọc ngoài thì ko cần check null ở đây, nhưng cứ để cho chắc
  if (!order || !isOpen) return null;

  const totalItems =
    order.orderItems?.reduce((sum, p) => sum + p.quantity, 0) || 0;

  // Nội dung Modal (Giữ nguyên cấu trúc HTML/CSS cũ của bạn)
  const modalContent = (
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
              <strong>Giao hàng tận nơi 🛵</strong>
            </div>
            {/* Hiển thị Drone ID nếu có (API mới) */}
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
            {order.orderItems?.map((p) => (
              <div key={p.id} className={styles.productRow}>
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
                  {/* Hiển thị Option nếu có (API mới trả optionValuesDTO) */}
                  {(p.optionValues || p.optionValuesDTO) && (
                    <p
                      className={styles.productOptions}
                      style={{ fontSize: "13px", color: "#666" }}
                    >
                      {(p.optionValues || p.optionValuesDTO)
                        .map((o) => o.value)
                        .join(", ")}
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
            <div className={styles.priceRow}>
              <span>Tổng tiền hàng</span>
              {/* Tính ngược tạm tính: Tổng - Ship (giả định 15k) */}
              <span>{vnd(order.totalPrice - 15000)}</span>
            </div>
            <div className={styles.priceRow}>
              <span>Phí giao hàng</span>
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

  // Bọc trong CommonModal để tận dụng hiệu ứng overlay/animation của bạn
  return (
    <CommonModal isOpen={isOpen} onClose={onClose}>
      {modalContent}
    </CommonModal>
  );
};

export default OrderDetailModal;
