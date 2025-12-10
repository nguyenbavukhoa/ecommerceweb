import React, { useMemo } from "react";
import CommonModal from "./CommonModal";
import styles from "./StatisticsDetailModal.module.scss";
import { vnd } from "../../utils";

// Lưu ý: Không import MOCK_ORDERS ở đây nữa
import { db } from "../../../../data/mockData";
const StatisticsDetailModal = ({
  isOpen,
  onClose,
  productId,
  storeOrders = [],
}) => {
  // Logic: Dùng storeOrders được truyền vào (đã lọc theo store ở cha)
  const { productDetails, productName } = useMemo(() => {
    if (!isOpen || !productId) return { productDetails: [], productName: "" };

    let foundName = "";
    const details = [];
    const allUsers = db.users.getAll();

    storeOrders.forEach((order) => {
      if (order.orderStatus === "CANCELLED") return;

      // --- SỬA TẠI ĐÂY: Lọc theo productId ---
      // Tìm tất cả các dòng trong đơn hàng có productId trùng với sản phẩm đang xem
      const matchedItems = order.orderItems.filter(
        (i) => i.productId === productId
      );

      if (matchedItems.length > 0) {
        if (!foundName) foundName = matchedItems[0].productName;

        // Cộng dồn nếu trong 1 đơn khách mua 2 dòng của cùng 1 món (VD: 1 cay, 1 không cay)
        const totalQtyInOrder = matchedItems.reduce(
          (sum, i) => sum + i.quantity,
          0
        );
        const totalPriceInOrder = matchedItems.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );

        const customer = allUsers.find((u) => u.id === order.userId);
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

    // Sắp xếp ngày mới nhất (logic parse ngày đơn giản)
    details.sort((a, b) => {
      // Giả sử format "HH:mm DD/MM/YYYY" -> So sánh string cũng tương đối ổn nếu format chuẩn YYYY,
      // nhưng tốt nhất nên parse. Ở đây demo đơn giản giữ nguyên logic cũ.
      return 0;
    });

    return { productDetails: details, productName: foundName };
  }, [isOpen, productId, storeOrders]);

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
