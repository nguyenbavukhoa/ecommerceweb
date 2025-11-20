import React, { useState, useEffect } from "react";
import { useToast } from "../../../../context/ToastContext";
import CommonModal from "./CommonModal";
import styles from "./OrderDetailModal.module.scss";
import { vnd, formatDate } from "../../utils";

// Helper
const getOrderDetails = (madon) => {
  const orderDetails = localStorage.getItem("orderDetails")
    ? JSON.parse(localStorage.getItem("orderDetails"))
    : [];
  const products = localStorage.getItem("products")
    ? JSON.parse(localStorage.getItem("products"))
    : [];

  const ctDon = orderDetails.filter((item) => item.madon === madon);

  // Gắn thông tin sản phẩm vào
  return ctDon.map((detail) => {
    const productInfo = products.find((p) => p.id === detail.id) || {
      title: "Sản phẩm đã xóa",
      img: "/assets/img/blank-image.png",
    };
    return {
      ...detail,
      title: productInfo.title,
      img: productInfo.img,
    };
  });
};

const OrderDetailModal = ({ isOpen, onClose, orderId, onStatusChange }) => {
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    if (isOpen && orderId) {
      const orders = localStorage.getItem("order")
        ? JSON.parse(localStorage.getItem("order"))
        : [];
      const foundOrder = orders.find((item) => item.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
        setDetails(getOrderDetails(orderId));
      }
    }
  }, [isOpen, orderId]);

  const handleChangeStatus = () => {
    if (!order) return;

    const newStatus = order.trangthai === 0 ? 1 : 0; // Đảo ngược

    try {
      let orders = localStorage.getItem("order")
        ? JSON.parse(localStorage.getItem("order"))
        : [];
      const index = orders.findIndex((item) => item.id === orderId);
      if (index > -1) {
        orders[index].trangthai = newStatus;
        localStorage.setItem("order", JSON.stringify(orders));

        // Cập nhật state nội bộ
        setOrder((prev) => ({ ...prev, trangthai: newStatus }));
        onStatusChange(); // Báo cho cha tải lại

        const msg =
          newStatus === 1
            ? "Đã chuyển sang Đã xử lý"
            : "Đã chuyển sang Chưa xử lý";
        showToast({ title: "Thành công", message: msg, type: "success" });
      }
    } catch (e) {
      showToast({
        title: "Lỗi",
        message: "Không thể cập nhật trạng thái",
        type: "error",
      });
    }
  };

  if (!isOpen || !order) return null;

  const classDetailBtn =
    order.trangthai === 0 ? styles.btnChuaxuly : styles.btnDaxuly;
  const textDetailBtn = order.trangthai === 0 ? "Chưa xử lý" : "Đã xử lý";

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title="CHI TIẾT ĐƠN HÀNG"
      customWidth="800px"
    >
      <div className={styles.modalDetailOrder}>
        {/* Cột trái - Chi tiết sản phẩm */}
        <div className={styles.modalDetailLeft}>
          {details.map((item, index) => (
            <div className={styles.orderProduct} key={index}>
              <div className={styles.orderProductLeft}>
                <img
                  src={item.img}
                  alt={item.title}
                  onError={(e) =>
                    (e.target.src = "/assets/img/blank-image.png")
                  }
                />
                <div className={styles.orderProductInfo}>
                  <h4>{item.title}</h4>
                  <p className={styles.orderProductNote}>
                    <i className="fa-light fa-pen"></i>{" "}
                    {item.note || "(Không có ghi chú)"}
                  </p>
                  <p className={styles.orderProductQuantity}>
                    SL: {item.soluong}
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

        {/* Cột phải - Thông tin đơn hàng */}
        <div className={styles.modalDetailRight}>
          <ul className={styles.detailOrderGroup}>
            <li className={styles.detailOrderItem}>
              <span className={styles.detailOrderItemLeft}>
                <i className="fa-light fa-calendar-days"></i> Ngày đặt hàng
              </span>
              <span className={styles.detailOrderItemRight}>
                {formatDate(order.thoigiandat)}
              </span>
            </li>
            <li className={styles.detailOrderItem}>
              <span className={styles.detailOrderItemLeft}>
                <i className="fa-light fa-truck"></i> Hình thức giao
              </span>
              <span className={styles.detailOrderItemRight}>
                {order.hinhthucgiao}
              </span>
            </li>
            <li className={styles.detailOrderItem}>
              <span className={styles.detailOrderItemLeft}>
                <i className="fa-thin fa-person"></i> Người nhận
              </span>
              <span className={styles.detailOrderItemRight}>
                {order.tenguoinhan}
              </span>
            </li>
            <li className={styles.detailOrderItem}>
              <span className={styles.detailOrderItemLeft}>
                <i className="fa-light fa-phone"></i> Số điện thoại
              </span>
              <span className={styles.detailOrderItemRight}>
                {order.sdtnhan}
              </span>
            </li>
            <li className={`${styles.detailOrderItem} ${styles.tb}`}>
              <span className={styles.detailOrderItemLeft}>
                <i className="fa-light fa-clock"></i> Thời gian giao
              </span>
              <p className={styles.detailOrderItemB}>
                {(order.thoigiangiao ? `${order.thoigiangiao} - ` : "") +
                  formatDate(order.ngaygiaohang)}
              </p>
            </li>
            <li className={`${styles.detailOrderItem} ${styles.tb}`}>
              <span className={styles.detailOrderItemLeft}>
                <i className="fa-light fa-location-dot"></i> Địa chỉ nhận
              </span>
              <p className={styles.detailOrderItemB}>{order.diachinhan}</p>
            </li>
            <li className={`${styles.detailOrderItem} ${styles.tb}`}>
              <span className={styles.detailOrderItemLeft}>
                <i className="fa-light fa-note-sticky"></i> Ghi chú
              </span>
              <p className={styles.detailOrderItemB}>
                {order.ghichu || "(Không có ghi chú)"}
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* Chân modal */}
      <div className={styles.modalDetailBottom}>
        <div className={styles.modalDetailBottomLeft}>
          <div className={styles.priceTotal}>
            <span className={styles.thanhtien}>Thành tiền</span>
            <span className={styles.price}>{vnd(order.tongtien)}</span>
          </div>
        </div>
        <div className={styles.modalDetailBottomRight}>
          <button
            className={`${styles.modalDetailBtn} ${classDetailBtn}`}
            onClick={handleChangeStatus}
          >
            {textDetailBtn}
          </button>
        </div>
      </div>
    </CommonModal>
  );
};

export default OrderDetailModal;
