// src/pages/ServerPage/components/Modals/ReviewRestaurantModal.jsx
import React, { useState } from "react";
import CommonModal from "../../../AdminPage/components/Modals/CommonModal";
import styles from "./ReviewRestaurantModal.module.scss";
import { vnd } from "../../utils"; // Đảm bảo import đúng file utils

const ReviewRestaurantModal = ({
  isOpen,
  onClose,
  restaurant,
  onApprove,
  onReject,
  onRequestMore,
}) => {
  const [docPreview, setDocPreview] = useState(null);

  if (!restaurant) return null;

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title="KIỂM DUYỆT HỒ SƠ ĐỐI TÁC"
      customWidth="800px"
    >
      <div className={styles.reviewContainer}>
        {/* --- CỘT TRÁI: THÔNG TIN --- */}
        <div className={styles.infoColumn}>
          <div className={styles.group}>
            <label>Tên cửa hàng:</label>
            <p className={styles.valueHighlight}>{restaurant.name}</p>
          </div>
          <div className={styles.group}>
            <label>Chủ sở hữu:</label>
            <p>{restaurant.owner}</p>
          </div>
          <div className={styles.group}>
            <label>Liên hệ:</label>
            <p>
              {restaurant.phone} - {restaurant.email}
            </p>
          </div>
          <div className={styles.group}>
            <label>Địa chỉ:</label>
            <p>{restaurant.address}</p>
          </div>
          {/* Các field khác nếu có trong db.json */}
        </div>

        {/* --- CỘT PHẢI: TÀI LIỆU --- */}
        <div className={styles.docColumn}>
          <div className={styles.sectionTitle}>Menu Mẫu</div>
          <ul className={styles.menuList}>
            {/* Render menu mẫu nếu có data, hoặc placeholder */}
            {restaurant.menuSample ? (
              restaurant.menuSample.map((i, idx) => (
                <li key={idx}>
                  <span>{i.name}</span> <strong>{vnd(i.price)}</strong>
                </li>
              ))
            ) : (
              <p style={{ fontStyle: "italic", color: "#999" }}>
                Chưa cập nhật menu mẫu
              </p>
            )}
          </ul>

          <div className={styles.sectionTitle} style={{ marginTop: "20px" }}>
            Hồ sơ đính kèm
          </div>
          <div className={styles.docList}>
            <button
              className={styles.btnDoc}
              onClick={() => setDocPreview("GPKD")}
            >
              <i className="fa-regular fa-file-pdf"></i> Giấy phép KD
            </button>
            <button
              className={styles.btnDoc}
              onClick={() => setDocPreview("CCCD")}
            >
              <i className="fa-regular fa-id-card"></i> CCCD Chủ quán
            </button>
          </div>

          {docPreview && (
            <div className={styles.docPreviewBox}>
              <p>
                Đang xem: <strong>{docPreview}</strong>
              </p>
              <div className={styles.fakeImg}>
                (Hình ảnh tài liệu {docPreview})
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.modalFooter}>
        <button
          className={styles.btnRequest}
          onClick={() => onRequestMore(restaurant.id)}
        >
          <i className="fa-regular fa-paper-plane"></i> Yêu cầu bổ sung
        </button>
        <div className={styles.mainActions}>
          <button
            className={styles.btnReject}
            onClick={() => onReject(restaurant.id)}
          >
            <i className="fa-regular fa-xmark"></i> Từ chối
          </button>
          <button
            className={styles.btnApprove}
            onClick={() => onApprove(restaurant.id)}
          >
            <i className="fa-regular fa-check"></i> Duyệt hồ sơ
          </button>
        </div>
      </div>
    </CommonModal>
  );
};

export default ReviewRestaurantModal;
