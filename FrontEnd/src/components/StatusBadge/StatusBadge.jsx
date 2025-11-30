// FrontEnd/src/pages/AdminPage/sections/StoreWallet/StatusBadge.jsx
import styles from "./StatusBadge.module.scss"; // Import file CSS chung

const StatusBadge = ({ status }) => {
  switch (status) {
    case "pending":
      return (
        <span className={`${styles.badge} ${styles.pending}`}>
          {/* Icon loading xoay */}
          <i className="fa-solid fa-circle-notch fa-spin"></i> Chờ xử lý
        </span>
      );
    case "approved":
      return (
        <span className={`${styles.badge} ${styles.approved}`}>
          <i className="fa-solid fa-circle-check"></i> Thành công
        </span>
      );
    case "rejected":
      return (
        <span className={`${styles.badge} ${styles.rejected}`}>
          <i className="fa-solid fa-circle-xmark"></i> Từ chối
        </span>
      );
    default:
      return <span className={styles.badge}>{status}</span>;
  }
};

export default StatusBadge;
