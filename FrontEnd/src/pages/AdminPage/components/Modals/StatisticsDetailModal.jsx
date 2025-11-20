import React, { useMemo } from "react";
import CommonModal from "./CommonModal";
import styles from "./StatisticsDetailModal.module.scss";
import { vnd, formatDate } from "../../utils";

const StatisticsDetailModal = ({ isOpen, onClose, productId, allDetails }) => {
  const productDetails = useMemo(() => {
    if (!isOpen || !productId) return [];
    // Lọc tất cả chi tiết đơn hàng cho sản phẩm này
    return allDetails.filter((item) => item.id === productId);
  }, [isOpen, productId, allDetails]);

  const title =
    productDetails.length > 0
      ? `CHI TIẾT: ${productDetails[0].title}`
      : "CHI TIẾT SẢN PHẨM";

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      customWidth="600px"
    >
      <div className={styles.table}>
        <table width="100%">
          <thead>
            <tr>
              <td>Mã đơn</td>
              <td>Số lượng</td>
              <td>Đơn giá</td>
              <td>Ngày đặt</td>
            </tr>
          </thead>
          <tbody>
            {productDetails.length > 0 ? (
              productDetails.map((item, index) => (
                <tr key={`${item.madon}-${index}`}>
                  <td>{item.madon}</td>
                  <td>{item.quantity}</td>
                  <td>{vnd(item.price)}</td>
                  <td>{formatDate(item.time)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CommonModal>
  );
};

export default StatisticsDetailModal;
