import React from "react";
import styles from "./OrderDetailModal.module.css";
import { useOrderDetail } from "../../hooks/useOrderDetail";
import ImageWithFallback from "../ImageWithFallbackComponent/ImageWithFallback";

// Helper để định dạng tiền và thời gian
const vnd = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );
const formatDateTime = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// === COMPONENT STATUS TRACKER ĐÃ ĐƯỢC VIẾT LẠI ===
const TimelineTracker = ({ order }) => {
  // --- TRƯỜNG HỢP 2: QUY TRÌNH HỦY ĐƠN 3 BƯỚC ---
  if (order.status === "cancelled" && order.cancellationProcess) {
    const { currentStep, steps } = order.cancellationProcess;
    return (
      <div className={styles.timelineWrapper}>
        <div className={styles.timelineContainer}>
          {steps.map((_, index) => {
            let segmentClass;
            if (index < currentStep) {
              segmentClass = styles.completed; // Đã qua: màu xanh
            } else if (index === currentStep) {
              segmentClass = styles.cancelled; // Hiện tại: màu đỏ
            } else {
              segmentClass = styles.future; // Chưa tới: màu xám
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
          {steps.map((label, index) => (
            <span key={index} className={styles.timelineLabel}>
              {label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // --- TRƯỜNG HỢP 1: QUY TRÌNH ĐƠN HÀNG 5 BƯỚC ---
  const timelineSteps = [
    { key: "pending", label: "Chờ xác nhận" },
    { key: "picking", label: "Lấy hàng" },
    { key: "shipping", label: "Vận chuyển" },
    { key: "delivered", label: "Đã giao" },
    { key: "returned", label: "Hoàn trả" },
  ];

  const currentStatusIndex = timelineSteps.findIndex(
    (step) => step.key === order.status
  );

  return (
    <div className={styles.timelineWrapper}>
      <div className={styles.timelineContainer}>
        {timelineSteps.map((item, index) => {
          let segmentClass;
          if (index < currentStatusIndex) {
            segmentClass = styles.completed;
          } else if (index === currentStatusIndex) {
            segmentClass = styles[item.key];
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

const OrderDetailModal = ({ orderId, onClose }) => {
  const { order, loading, error } = useOrderDetail(orderId);

  if (loading) {
    return (
      <div className={styles.modalView}>
        <div className={styles.modalHeader}>
          <h3>Đang tải...</h3>
        </div>
        <div className={styles.loadingState}>Đang tải chi tiết đơn hàng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.modalView}>
        <div className={styles.modalHeader}>
          <h3>Lỗi</h3>
        </div>
        <div className={styles.errorState}>{error}</div>
      </div>
    );
  }

  if (!order) return null;

  const totalItems = order.products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className={styles.modalView}>
      <div className={styles.modalHeader}>
        <button onClick={onClose} className={styles.backBtn}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h3>Thông tin đơn hàng</h3>
      </div>

      <div className={styles.modalContent}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>Trạng thái đơn hàng</div>
          <div className={styles.cardBody}>
            <TimelineTracker order={order} />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>Thông tin vận chuyển</div>
          <div className={styles.cardBody}>
            <div className={styles.infoRow}>
              <span>Đối tác vận chuyển:</span>
              <strong>GrabFood</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Mã vận đơn:</span>
              <strong>{order.shippingInfo.trackingCode}</strong>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>Địa chỉ nhận hàng</div>
          <div className={`${styles.cardBody} ${styles.addressBody}`}>
            <i className="fa-solid fa-location-dot"></i>
            <div>
              <p className={styles.addressNamePhone}>
                <strong>{order.deliveryAddress.name}</strong> |{" "}
                {order.deliveryAddress.phone}
              </p>
              <p className={styles.addressText}>
                {order.deliveryAddress.address}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            Danh sách sản phẩm ({totalItems} sản phẩm)
          </div>
          <div className={styles.productList}>
            {order.products.map((p) => (
              <div key={p.id} className={styles.productRow}>
                <ImageWithFallback
                  src={p.image}
                  alt={p.name}
                  className={styles.productImage}
                />
                <div className={styles.productInfo}>
                  <p className={styles.productName}>
                    <span className={styles.productQuantity}>
                      {p.quantity}x
                    </span>{" "}
                    {p.name}
                  </p>
                  {p.options && (
                    <p className={styles.productOptions}>{p.options}</p>
                  )}
                </div>
                <div className={styles.productPrice}>
                  {vnd(p.price * p.quantity)}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.orderSummary}>
            <div className={styles.priceRow}>
              <span>Tạm tính</span>
              <span>{vnd(order.subTotal)}</span>
            </div>
            <div className={styles.priceRow}>
              <span>Phí giao hàng</span>
              <span>{vnd(order.shippingFee)}</span>
            </div>
            <div className={`${styles.priceRow} ${styles.finalTotal}`}>
              <span>Thành tiền</span>
              <span>{vnd(order.finalTotal)}</span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>Chi tiết thanh toán</div>
          <div className={styles.cardBody}>
            <div className={styles.infoRow}>
              <span>Mã đơn hàng:</span>
              <strong>#{order.id}</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Phương thức:</span>
              <strong>{order.paymentMethod}</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Đặt hàng:</span>
              <strong>{formatDateTime(order.timestamps.orderedAt)}</strong>
            </div>
            {order.timestamps.paidAt && (
              <div className={styles.infoRow}>
                <span>Thanh toán:</span>
                <strong>{formatDateTime(order.timestamps.paidAt)}</strong>
              </div>
            )}
            {order.timestamps.pickedUpAt && (
              <div className={styles.infoRow}>
                <span>DVVC tiếp nhận:</span>
                <strong>{formatDateTime(order.timestamps.pickedUpAt)}</strong>
              </div>
            )}
            {order.timestamps.completedAt && (
              <div className={styles.infoRow}>
                <span>Hoàn thành:</span>
                <strong>{formatDateTime(order.timestamps.completedAt)}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
