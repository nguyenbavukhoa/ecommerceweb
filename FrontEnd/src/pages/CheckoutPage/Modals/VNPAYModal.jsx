// src/components/Modals/VNPAYModal.jsx
import React from "react";
import styles from "./VNPAYModal.module.css";
// Bạn có thể dùng ảnh QR thật hoặc placeholder
// import QrCodeImg from "../../assets/images/qr-placeholder.png";

const VNPAYModal = ({ isOpen, onClose, onConfirm, totalAmount }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Thanh toán qua VNPAY</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.instruction}>
            Vui lòng quét mã QR bên dưới để thanh toán
          </p>

          <div className={styles.qrContainer}>
            {/* Dùng link tạo QR online để demo cho đẹp */}
            <img
              src={`https://img.vietqr.io/image/MB-0000000000-compact2.jpg?amount=${totalAmount}&addInfo=Thanh toan don hang KHK Food&accountName=KHK FOOD`}
              alt="QR Code"
              className={styles.qrImage}
            />
          </div>

          <div className={styles.paymentInfo}>
            <div className={styles.infoRow}>
              <span>Số tiền:</span>
              <span className={styles.amount}>
                {Number(totalAmount).toLocaleString("vi-VN")} đ
              </span>
            </div>
            <div className={styles.infoRow}>
              <span>Nội dung:</span>
              <span>Thanh toan don hang KHK Food</span>
            </div>
          </div>

          <div className={styles.warning}>
            <i className="fa-solid fa-circle-exclamation"></i>
            <p>
              Sau khi chuyển khoản thành công, vui lòng bấm nút "Xác nhận" bên
              dưới.
            </p>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Hủy bỏ
          </button>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            Xác nhận đã chuyển khoản
          </button>
        </div>
      </div>
    </div>
  );
};

export default VNPAYModal;
