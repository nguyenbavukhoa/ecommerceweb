import React, { useEffect, useState, useMemo } from "react";
import CommonModal from "./CommonModal";
import styles from "./StatisticsDetailModal.module.scss";
import { vnd } from "../../utils";
import { db } from "../../../../services/dbService"; // [FIX]
const StatisticsDetailModal = ({
  isOpen,
  onClose,
  productId,
  storeOrders = [],
}) => {
  const [users, setUsers] = useState([]);

  // Fetch users 1 lần khi mở modal để map tên khách hàng
  useEffect(() => {
    if (isOpen) {
      db.users.getAll().then(setUsers);
    }
  }, [isOpen]);

  const { productDetails, productName } = useMemo(() => {
    if (!isOpen || !productId) return { productDetails: [], productName: "" };

    let foundName = "";
    const details = [];

    storeOrders.forEach((order) => {
      if (order.orderStatus === "CANCELLED") return;

      const matchedItems = order.orderItems.filter(
        (i) => i.productId === productId
      );

      if (matchedItems.length > 0) {
        if (!foundName) foundName = matchedItems[0].productName;

        const totalQtyInOrder = matchedItems.reduce(
          (sum, i) => sum + i.quantity,
          0
        );
        const totalPriceInOrder = matchedItems.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );

        const customer = users.find((u) => u.id === order.userId);
        const customerName = customer ? customer.fullName : "Khách vãng lai";

        details.push({
          orderId: order.id,
          orderTime: order.orderTime,
          customerName: customerName,
          quantity: totalQtyInOrder,
          price: matchedItems[0].price,
          total: totalPriceInOrder,
        });
      }
    });

    return { productDetails: details, productName: foundName };
  }, [isOpen, productId, storeOrders, users]); // Thêm users vào dependency

  if (!isOpen) return null;

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={productName ? `CHI TIẾT: ${productName}` : "CHI TIẾT SẢN PHẨM"}
      customWidth="800px"
    >
      <div className={styles.modalContainer}>
        <div className={styles.summaryHeader}>
          <div className={styles.summaryItem}>
            <span>Tổng số đơn:</span>
            <strong>{productDetails.length}</strong>
          </div>
          <div className={styles.summaryItem}>
            <span>Tổng lượng bán:</span>
            <strong>
              {productDetails.reduce((sum, item) => sum + item.quantity, 0)}
            </strong>
          </div>
          <div className={styles.summaryItem}>
            {/* Thêm tổng tiền cho xịn */}
            <span>Tổng thu:</span>
            <strong style={{ color: "#27ae60" }}>
              {vnd(productDetails.reduce((sum, item) => sum + item.total, 0))}
            </strong>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th className="text-right">Số lượng</th>
                <th className="text-right">Đơn giá</th>
                <th className="text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {productDetails.length > 0 ? (
                productDetails.map((item, index) => (
                  <tr key={index}>
                    <td data-label="Mã đơn">
                      <span className={styles.orderId}>#{item.orderId}</span>
                    </td>
                    <td data-label="Ngày đặt">{item.orderTime}</td>
                    <td data-label="Số lượng" className="text-right">
                      <b>{item.quantity}</b>
                    </td>
                    <td data-label="Đơn giá" className="text-right">
                      {vnd(item.price)}
                    </td>
                    <td data-label="Thành tiền" className="text-right">
                      <span className={styles.totalPrice}>
                        {vnd(item.total)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.btnClose}>
            Đóng
          </button>
        </div>
      </div>
    </CommonModal>
  );
};

export default StatisticsDetailModal;
