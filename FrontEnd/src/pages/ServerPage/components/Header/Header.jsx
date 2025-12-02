import styles from "./Header.module.scss";

const Header = ({ onMenuToggle }) => {
  return (
    <header className={styles.header}>
      {/* Nút này chỉ hiển thị trên mobile */}
      <button
        className={styles.menuIconBtn}
        onClick={(e) => {
          e.stopPropagation(); // Ngăn sự kiện click lan ra 'main'
          onMenuToggle();
        }}
      >
        <div className={styles.menuIcon}>
          <i className="fa-regular fa-bars"></i>
        </div>
      </button>
      {/* Thêm phần search và user (nếu cần) */}
    </header>
  );
};

export default Header;
