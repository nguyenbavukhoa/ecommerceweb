import logo from "../../../assets/images/logo/logo_v1.jpeg";
import styles from "../styles/HeaderComponent.module.scss";

import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  useFilters,
  useCategories,
  useStores,
} from "../../../context/FilterProvider";
import { useCart } from "../../../context/CartProvider";
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "../hooks/useDebounce";
import AdvancedSearch from "./AdvancedSearch";
import { useNotification } from "../../../context/NotificationContext"; // Import mới

// --- COMPONENT CON: NOTIFICATION BELL ---
const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = (id) => {
    markAsRead(id);
    // Có thể navigate tới chi tiết đơn hàng nếu muốn
  };

  // Format thời gian
  const formatTime = (date) => {
    const d = new Date(date);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(
      2,
      "0"
    )} ${d.getDate()}/${d.getMonth() + 1}`;
  };

  return (
    <div className={styles.item} ref={dropdownRef}>
      <div
        className={styles.notifIconWrapper}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`fa-light fa-bell ${isOpen ? styles.active : ""}`}></i>
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
      </div>

      <div className={`${styles.notifDropdown} ${isOpen ? styles.active : ""}`}>
        <div className={styles.notifHeader}>
          <h4>Thông báo</h4>
          {unreadCount > 0 && (
            <button className={styles.markAllBtn} onClick={markAllAsRead}>
              Đánh dấu đã đọc
            </button>
          )}
        </div>
        <ul className={styles.notifList}>
          {notifications.length === 0 ? (
            <li className={styles.empty}>Bạn chưa có thông báo nào.</li>
          ) : (
            notifications.map((notif) => (
              <li
                key={notif.id}
                className={`${styles.notifItem} ${
                  !notif.isRead ? styles.unread : ""
                }`}
                onClick={() => handleItemClick(notif.id)}
              >
                <div className={`${styles.iconBox} ${styles[notif.type]}`}>
                  <i
                    className={`fa-solid ${
                      notif.type === "success"
                        ? "fa-check"
                        : notif.type === "warning"
                        ? "fa-exclamation"
                        : "fa-info"
                    }`}
                  ></i>
                </div>
                <div className={styles.content}>
                  <span className={styles.title}>{notif.title}</span>
                  <span className={styles.desc}>{notif.message}</span>
                  <span className={styles.time}>{formatTime(notif.time)}</span>
                </div>
                {!notif.isRead && <div className={styles.dot}></div>}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

const scrollToProducts = () => {
  document
    .getElementById("home-service")
    ?.scrollIntoView({ behavior: "smooth" });
};

export default function HeaderComponent() {
  const { openCart, getAmountCart } = useCart();
  const { auth, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const { filters, setFilters } = useFilters();
  const { data: stores = [] } = useStores();

  const [searchTerm, setSearchTerm] = useState(filters.name);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // --- LOGIC SEARCH & FILTER ---
  useEffect(() => {
    if (!showMobileSearch) {
      setIsFilterOpen(false);
    }
  }, [showMobileSearch]);

  useEffect(() => {
    const isSearching = searchTerm !== filters.name;
    setFilters({ name: debouncedSearchTerm });
    if (isSearching) setTimeout(scrollToProducts, 0);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    setSearchTerm(filters.name);
  }, [filters.name]);

  const handleStoreChange = (e) => {
    const newStoreId = e.target.value;
    setFilters({ storeId: newStoreId, page: 1 });
    setTimeout(scrollToProducts, 0);
  };

  const handleToggleFilterClick = (e) => {
    e.preventDefault();
    setIsFilterOpen((prev) => !prev);
    setTimeout(scrollToProducts, 0);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsFilterOpen((prev) => !prev);
      setTimeout(scrollToProducts, 0);
    }
  };

  const totalAmount = getAmountCart() ?? 0;
  const location = useLocation();
  const hideHeaderBottomOnPaths = ["/order-history", "/checkout"];
  const isHeaderBottomVisible = !hideHeaderBottomOnPaths.includes(
    location.pathname
  );

  useEffect(() => {
    setShowMobileSearch(false);
  }, [location.pathname]);

  return (
    <>
      <header>
        <div className={styles.headerMiddle}>
          <div className={styles.container}>
            {/* GROUP 1: LOGO & STORE SELECTOR */}
            <div className={styles.headerLeftGroup}>
              {/* LOGO */}
              <div className={styles.headerLogo}>
                <a href="/">
                  <img src={logo} alt="" className={styles.headerLogoImg} />
                </a>
              </div>

              {/* STORE SELECTOR (Nằm cạnh Logo) */}
              <div className={styles.storeSelectorWrapper}>
                <i className="fa-solid fa-location-dot location-icon"></i>
                <select
                  value={filters.storeId}
                  onChange={handleStoreChange}
                  className={styles.storeSelect}
                >
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name.replace("KHK Food ", "")}{" "}
                      {/* Rút gọn tên hiển thị */}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* GROUP 2: SEARCH BAR (DESKTOP) */}
            <div className={styles.headerMiddleCenter}>
              <form
                className={styles.formSearch}
                onSubmit={(e) => e.preventDefault()}
              >
                <button className={styles.searchBtn}>
                  <i className="fa-light fa-magnifying-glass"></i>
                </button>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Tìm kiếm món ăn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                />
                <button
                  type="button"
                  className={styles.filterBtn}
                  onClick={handleToggleFilterClick}
                >
                  <i className="fa-light fa-filter-list"></i>
                  <span>Lọc</span>
                </button>
              </form>
            </div>

            {/* GROUP 3: RIGHT MENU */}
            <div className={styles.headerRight}>
              <ul className={styles.list}>
                {/* ICON SEARCH MOBILE */}
                <li
                  className={styles.searchIconMobile}
                  onClick={() => setShowMobileSearch(!showMobileSearch)}
                >
                  <i
                    className={`fa-light ${
                      showMobileSearch ? "fa-xmark" : "fa-magnifying-glass"
                    }`}
                  ></i>
                </li>

                {/* --- [MỚI] NOTIFICATION BELL --- */}
                {/* Đặt trước hoặc sau User icon tùy ý */}
                <NotificationBell />

                {/* USER */}
                <li className={styles.item}>
                  <i className="fa-light fa-user"></i>
                  <div className={styles.authContainer}>
                    {!isLoggedIn ? (
                      <>
                        <span className={styles.textDndk}>
                          Đăng nhập / Đăng ký
                        </span>
                        <span className={styles.textTk}>
                          Tài khoản{" "}
                          <i className="fa-sharp fa-solid fa-caret-down"></i>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className={styles.textDndk}>Tài khoản</span>
                        <span className={styles.textTk}>
                          {auth.accountName}{" "}
                          <i className="fa-sharp fa-solid fa-caret-down"></i>
                        </span>
                      </>
                    )}
                  </div>

                  <ul className={styles.dropdownMenu}>
                    {!isLoggedIn ? (
                      <>
                        <li>
                          <Link to="/auth?action=login">
                            <i className="fa-light fa-right-to-bracket"></i>{" "}
                            Đăng nhập
                          </Link>
                        </li>
                        <li>
                          <Link to="/auth?action=register">
                            <i className="fa-light fa-user-plus"></i> Đăng ký
                          </Link>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <a href="/user-info">
                            <i className="fa-light fa-circle-user"></i> Tài
                            khoản của tôi
                          </a>
                        </li>
                        <li>
                          <a href="/order-history">
                            <i className="fa-regular fa-bags-shopping"></i> Đơn
                            hàng
                          </a>
                        </li>
                        <li className={styles.border}>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              logout();
                              navigate("/");
                            }}
                          >
                            <i className="fa-light fa-right-from-bracket"></i>{" "}
                            Thoát tài khoản
                          </a>
                        </li>
                      </>
                    )}
                  </ul>
                </li>

                {/* CART */}
                <li className={styles.item} onClick={openCart}>
                  <div className={styles.cartIconMenu}>
                    <i className="fa-light fa-basket-shopping"></i>
                    <span className={styles.count}>{totalAmount}</span>
                  </div>
                  <span>Giỏ hàng</span>
                </li>
              </ul>
            </div>

            {/* MOBILE SEARCH SLIDEDOWN */}
            <div
              className={`${styles.mobileSearchContainer} ${
                showMobileSearch ? styles.open : ""
              }`}
            >
              <form
                className={styles.mobileForm}
                onSubmit={(e) => e.preventDefault()}
              >
                <i
                  className={`fa-light fa-magnifying-glass ${styles.mobileSearchIconDeco}`}
                ></i>
                <input
                  type="text"
                  placeholder="Tìm món ăn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                />
                <button
                  type="button"
                  className={styles.mobileFilterBtn}
                  onClick={handleToggleFilterClick}
                >
                  <i className="fa-light fa-filter-list"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <AdvancedSearch
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        isMobileSearchOpen={showMobileSearch}
      />

      {isHeaderBottomVisible && <HeaderBottom />}
    </>
  );
}

function HeaderBottom() {
  const { filters, setFilters } = useFilters();
  const { data: categories = [] } = useCategories();
  const location = useLocation();
  const navigate = useNavigate();

  const handleCategoryChange = (e, catId) => {
    e.preventDefault();
    setFilters({ category: catId });
    if (location.pathname === "/") setTimeout(scrollToProducts, 0);
    else navigate(`/`);
  };

  return (
    <nav className={styles.headerBottom}>
      <div className="container">
        <ul className={styles.menuList}>
          <li>
            <a
              href="#"
              className={`${styles.menuLink} ${
                filters.category === "all" ? styles.active : ""
              }`}
              onClick={(e) => handleCategoryChange(e, "all")}
            >
              Trang chủ
            </a>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <a
                href="#"
                className={`${styles.menuLink} ${
                  filters.category === cat.id ? styles.active : ""
                }`}
                onClick={(e) => handleCategoryChange(e, cat.id)}
              >
                {cat.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
