import React, { useState } from "react";
import CommonModal from "../../../AdminPage/components/Modals/CommonModal";
import styles from "./ReviewRestaurantModal.module.scss";
import { vnd } from "../../utils";

const ReviewRestaurantModal = ({
  isOpen,
  onClose,
  restaurant,
  onApprove, // Hàm xử lý duyệt (Gọi update status = active)
  onReject, // Hàm xử lý từ chối (Xóa hoặc status = inactive)
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
        {/* --- CỘT TRÁI: THÔNG TIN CƠ BẢN --- */}
        <div className={styles.infoColumn}>
          <div className={styles.group}>
            <label>Tên cửa hàng:</label>
            <p className={styles.valueHighlight}>{restaurant.name}</p>
          </div>
          <div className={styles.group}>
            <label>Mã cửa hàng:</label>
            <p>{restaurant.code || "---"}</p>
          </div>
          <div className={styles.group}>
            <label>Liên hệ:</label>
            <p>{restaurant.phone}</p>
          </div>
          <div className={styles.group}>
            <label>Địa chỉ:</label>
            <p>{restaurant.address}</p>
          </div>
          <div className={styles.group}>
            <label>Giờ hoạt động:</label>
            <p>
              {restaurant.openTime} - {restaurant.closeTime}
            </p>
          </div>
          <div className={styles.group}>
            <label>Mô tả:</label>
            <p>{restaurant.description}</p>
          </div>
        </div>

        {/* --- CỘT PHẢI: TÀI LIỆU & MENU (API chưa có, để placeholder) --- */}
        <div className={styles.docColumn}>
          <div className={styles.sectionTitle}>Hồ sơ đính kèm</div>
          <div className={styles.docList}>
            {/* Vì API chưa trả về link ảnh GPKD, ta ẩn hoặc hiện thông báo */}
            <p style={{ color: "#999", fontSize: "13px", fontStyle: "italic" }}>
              Hiện chưa có tài liệu đính kèm từ API.
            </p>
          </div>
        </div>
      </div>

      {/* --- FOOTER ACTIONS --- */}
      <div className={styles.modalFooter}>
        <div className={styles.mainActions}>
          <button
            className={styles.btnReject}
            onClick={() => onReject(restaurant)}
          >
            <i className="fa-regular fa-xmark"></i> Từ chối / Xóa
          </button>

          {/* Chỉ hiện nút Duyệt nếu status chưa active (ví dụ đang pending) */}
          {!restaurant.active && (
            <button
              className={styles.btnApprove}
              onClick={() => onApprove(restaurant)}
            >
              <i className="fa-regular fa-check"></i> Duyệt hồ sơ (Kích hoạt)
            </button>
          )}
        </div>
      </div>
    </CommonModal>
  );
};

export default ReviewRestaurantModal;
