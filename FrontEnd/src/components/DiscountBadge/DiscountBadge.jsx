// 1. Import CSS module
import styles from "./DiscountBadge.module.css";

/**
 * Component hiển thị nhãn giảm giá sử dụng CSS Modules.
 * @param {object} props
 * @param {string} props.text - Nội dung hiển thị (ví dụ: "-20%", "SALE").
 */
const DiscountBadge = ({ text }) => {
  if (!text) return null;

  return (
    // 2. Dùng class name từ object styles
    <div className={styles.discountBadge}>{text}</div>
  );
};

export default DiscountBadge;
