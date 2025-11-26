import React, { useMemo } from "react";
import CommonModal from "./CommonModal";
import styles from "./OrderDetailModal.module.scss";
import { vnd } from "../../utils";
import { db } from "../../../../data/mockData";

const getStatusLabel = (status) => {
  const map = {
    PLACED: "Đã đặt",
    CONFIRMED: "Đã xác nhận",
    SHIPPING: "Đang giao",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy",
  };
  const cls = status?.toLowerCase() || "";
  return (
    <span className={`${styles.statusBadge} ${styles[cls]}`}>
      {map[status] || status}
    </span>
  );
};

const OrderDetailModal = ({ isOpen, onClose, order }) => {
  const customerInfo = useMemo(() => {
    if (!order) return null;

    if (order.deliveryInfo) {
      return {
        fullName: order.deliveryInfo.name,
        phoneNumber: order.deliveryInfo.phone,
        address: order.deliveryInfo.address,
        type: order.deliveryInfo.type,
      };
    }

    if (order.userId) {
      const user = db.users.getOne(order.userId);
      return (
        user || {
          fullName: "Khách vãng lai",
          phoneNumber: "---",
          address: "---",
        }
      );
    }

    return {
      fullName: "Khách vãng lai",
      phoneNumber: "---",
      address: "---",
    };
  }, [order]);

  if (!isOpen || !order) return null;

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={`CHI TIẾT ĐƠN HÀNG #${order.id}`}
      customWidth="900px"
    >
      <div className={styles.modalDetailOrder}>
        <div className={styles.modalDetailLeft}>
          <h4
            style={{
              marginBottom: "15px",
              color: "#555",
              borderBottom: "1px solid #eee",
              paddingBottom: "10px",
            }}
          >
            Danh sách món ăn ({order.orderItems?.length || 0})
          </h4>

          {order.orderItems &&
            order.orderItems.map((item) => (
              <div className={styles.orderProduct} key={item.id}>
                <div className={styles.orderProductLeft}>
                  <img
                    src={item.imgUrl}
                    alt={item.productName}
                    onError={(e) =>
                      (e.target.src = "/assets/img/blank-image.png")
                    }
                  />
                  <div className={styles.orderProductInfo}>
                    <h4>{item.productName}</h4>
                    {item.note && (
                      <p className={styles.orderProductNote}>
                        <i className="fa-light fa-pen"></i> {item.note}
                      </p>
                    )}
                    <p className={styles.orderProductQuantity}>
                      SL: <strong>{item.quantity}</strong>
                    </p>
                  </div>
                </div>
                <div className={styles.orderProductRight}>
                  <div className={styles.orderProductPrice}>
                    <span className={styles.orderProductCurrentPrice}>
                      {vnd(item.price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className={styles.modalDetailRight}>
          <div className={styles.detailOrderGroup}>
            <h4 style={{ marginBottom: "10px", color: "#b5292f" }}>
              Thông tin người nhận
            </h4>
            {customerInfo ? (
              <ul className={styles.customerInfoList}>
                <li className={styles.detailOrderItem}>
                  <span className={styles.detailOrderItemLeft}>
                    <i className="fa-regular fa-user"></i> Người nhận
                  </span>
                  <span className={styles.detailOrderItemRight}>
                    <strong>{customerInfo.fullName}</strong>
                    {customerInfo.type && (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#888",
                          marginLeft: "5px",
                          border: "1px solid #ddd",
                          padding: "1px 4px",
                          borderRadius: "4px",
                        }}
                      >
                        {customerInfo.type}
                      </span>
                    )}
                  </span>
                </li>
                <li className={styles.detailOrderItem}>
                  <span className={styles.detailOrderItemLeft}>
                    <i className="fa-regular fa-phone"></i> SĐT
                  </span>
                  <span className={styles.detailOrderItemRight}>
                    {customerInfo.phoneNumber}
                  </span>
                </li>
                <li className={`${styles.detailOrderItem} ${styles.tb}`}>
                  <span className={styles.detailOrderItemLeft}>
                    <i className="fa-regular fa-location-dot"></i> Địa chỉ
                  </span>
                  <p className={styles.detailOrderItemB}>
                    {customerInfo.address}
                  </p>
                </li>
              </ul>
            ) : (
              <p>Không có thông tin khách hàng.</p>
            )}
          </div>

          <div
            className={styles.detailOrderGroup}
            style={{
              marginTop: "20px",
              paddingTop: "15px",
              borderTop: "1px dashed #eee",
            }}
          >
            <h4 style={{ marginBottom: "10px", color: "#555" }}>
              Thông tin đơn hàng
            </h4>
            <ul>
              <li className={styles.detailOrderItem}>
                <span className={styles.detailOrderItemLeft}>
                  <i className="fa-light fa-shop"></i> Nhà hàng ID
                </span>
                <span className={styles.detailOrderItemRight}>
                  {order.restaurantId || "---"}
                </span>
              </li>
              <li className={styles.detailOrderItem}>
                <span className={styles.detailOrderItemLeft}>
                  <i className="fa-light fa-calendar-days"></i> Thời gian
                </span>
                <span className={styles.detailOrderItemRight}>
                  {order.orderTime}
                </span>
              </li>
              <li className={styles.detailOrderItem}>
                <span className={styles.detailOrderItemLeft}>
                  <i className="fa-light fa-credit-card"></i> Thanh toán
                </span>
                <span className={styles.detailOrderItemRight}>
                  <strong
                    style={{
                      color:
                        order.paymentMethod === "VNPAY" ? "#005eb8" : "#27ae60",
                    }}
                  >
                    {order.paymentMethod === "VNPAY" ? "VNPAY" : "Tiền mặt"}
                  </strong>
                </span>
              </li>
              <li className={styles.detailOrderItem}>
                <span className={styles.detailOrderItemLeft}>
                  <i className="fa-light fa-info-circle"></i> Trạng thái
                </span>
                <span className={styles.detailOrderItemRight}>
                  {getStatusLabel(order.orderStatus)}
                </span>
              </li>
              <li className={`${styles.detailOrderItem} ${styles.tb}`}>
                <span className={styles.detailOrderItemLeft}>
                  <i className="fa-light fa-note-sticky"></i> Ghi chú
                </span>
                <p className={styles.detailOrderItemB}>
                  {order.note || "(Không có)"}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.modalDetailBottom}>
        <div className={styles.priceTotal}>
          <span className={styles.thanhtien}>Tổng tiền</span>
          <span className={styles.price} style={{ fontSize: "20px" }}>
            {vnd(order.totalPrice)}
          </span>
        </div>
        <div className={styles.modalDetailBottomRight}>
          <button
            className={styles.modalDetailBtn}
            style={{ backgroundColor: "#888" }}
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </CommonModal>
  );
};

export default OrderDetailModal;
