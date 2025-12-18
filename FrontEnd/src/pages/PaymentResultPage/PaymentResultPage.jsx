import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./PaymentResultPage.module.css";

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing"); // processing | success | failed

  useEffect(() => {
    // 1. Lấy mã phản hồi từ VNPAY (vnp_ResponseCode=00 là thành công)
    const vnpResponseCode = searchParams.get("vnp_ResponseCode");

    // 2. Hoặc lấy status từ Backend nếu Backend redirect kèm param custom
    const backendStatus = searchParams.get("status");

    if (backendStatus === "success" || vnpResponseCode === "00") {
      setStatus("success");
    } else if (
      backendStatus === "failed" ||
      (vnpResponseCode && vnpResponseCode !== "00")
    ) {
      setStatus("failed");
    } else {
      // Mặc định nếu không rõ ràng thì coi như thất bại để an toàn
      setStatus("failed");
    }
  }, [searchParams]);

  return (
    <div className={styles.container}>
      {status === "success" ? (
        <div className={styles.resultContent}>
          <div className={styles.iconWrapper}>
            <i className={`fa-solid fa-circle-check ${styles.iconSuccess}`}></i>
          </div>
          <h2 className={styles.title}>Thanh toán thành công!</h2>
          <p className={styles.message}>
            Cảm ơn bạn đã mua hàng. <br />
            Đơn hàng của bạn đã được hệ thống ghi nhận và đang xử lý.
          </p>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => navigate("/order-history")}
          >
            Xem lịch sử đơn hàng
          </button>
        </div>
      ) : (
        <div className={styles.resultContent}>
          <div className={styles.iconWrapper}>
            <i className={`fa-solid fa-circle-xmark ${styles.iconFailed}`}></i>
          </div>
          <h2 className={styles.title}>Thanh toán thất bại</h2>
          <p className={styles.message}>
            Giao dịch bị hủy hoặc có lỗi xảy ra trong quá trình thanh toán.
            <br />
            Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
          </p>
          <div className={styles.btnGroup}>
            <button
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => navigate("/")}
            >
              Về trang chủ
            </button>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => navigate("/cart")} // Quay lại giỏ hàng hoặc trang checkout
            >
              Thử lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentResultPage;
