import logo from "../../../assets/images/logo/logo_v1.jpeg";
import styles from "../styles/HeaderComponent.module.css";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useFilters, useCategories } from "../../../context/FilterProvider";
import { useCart } from "../../../context/CartProvider";
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import AdvancedSearch from "./AdvancedSearch";

// --- BƯỚC 1: Tạo hàm cuộn ---
const scrollToProducts = () => {
  // ID "home-service" được lấy từ file HTML gốc của bạn
  document
    .getElementById("home-service")
    ?.scrollIntoView({ behavior: "smooth" });
};

export default function HeaderComponent() {
  // 1. LẤY HÀM `getAmountCart` TỪ CONTEXT
  const { openCart, getAmountCart } = useCart();
  const { auth, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Lấy filter và hàm setFilters từ hook useFilters
  const { filters, setFilters } = useFilters();

  // Tạo local state cho ô search (để gõ mượt)
  const [searchTerm, setSearchTerm] = useState(filters.name);

  // Lấy giá trị đã được "trì hoãn"
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

  // Hàm cuộn khi search (debounced) ---
  useEffect(() => {
    // Chỉ cuộn nếu người dùng thực sự gõ gì đó
    const isSearching = searchTerm !== filters.name;
    // Cập nhật state trong Context
    setFilters({ name: debouncedSearchTerm });
    if (isSearching) {
      setTimeout(scrollToProducts, 0);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    setSearchTerm(filters.name);
  }, [filters.name]);

  // Effect này sẽ chạy khi giá trị "trì hoãn" thay đổi
  useEffect(() => {
    // Cập nhật URL, hook useProducts sẽ tự động chạy lại
    setFilters({ name: debouncedSearchTerm });
  }, [debouncedSearchTerm]); // Chỉ chạy khi debouncedSearchTerm thay đổi

  // Cập nhật lại ô search nếu người dùng bấm back/forward
  useEffect(() => {
    setSearchTerm(filters.name);
  }, [filters.name]);

  // -------- State để quản lý việc mở/đóng filter -----
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Hàm xử lý nút "Lọc" (click)
  const handleToggleFilterClick = (e) => {
    e.preventDefault();
    setIsFilterOpen((prev) => !prev);
    setTimeout(scrollToProducts, 0);
  };

  // Hàm xử lý "Enter" trong ô input
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsFilterOpen((prev) => !prev);
      setTimeout(scrollToProducts, 0);
    }
  };
  // ----------------------------------------------------

  // Gọi hàm để lấy tổng số lượng, nếu kết quả là null/undefined thì mặc định là 0
  const totalAmount = getAmountCart() ?? 0;

  // Lấy thông tin về trang hiện tại
  const location = useLocation();

  // Thêm các đường dẫn bạn muốn ẩn HeaderBottom vào mảng này
  const hideHeaderBottomOnPaths = ["/order-history", "/checkout"];
  const isHeaderBottomVisible = !hideHeaderBottomOnPaths.includes(
    location.pathname
  );
  return (
    <>
      <header>
        {/* Header top */}
        <div className="header-top">
          <div className="container">
            <div className="header-top-left">
              <ul className="header-top-list">
                <li>
                  <a href="">
                    <i className="fa-regular fa-phone"></i> 0123 456 789 (miễn
                    phí)
                  </a>
                </li>
                <li>
                  <a href="">
                    <i className="fa-light fa-location-dot"></i> Xem vị trí cửa
                    hàng
                  </a>
                </li>
              </ul>
            </div>
            <div className="header-top-right">
              <ul className="header-top-list">
                <li>
                  <a href="">Giới thiệu</a>
                </li>
                <li>
                  <a href="">Cửa hàng</a>
                </li>
                <li>
                  <a href="">Chính sách</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Header middle */}
        <div className="header-middle">
          <div className="container">
            {/* Logo */}
            <div className="header-middle-left">
              <div className={styles.headerLogo}>
                <a href="/">
                  <img src={logo} alt="" className={styles.headerLogoImg} />
                </a>
              </div>
            </div>

            {/* Search */}
            <div className="header-middle-center">
              <form
                action=""
                className="form-search"
                onSubmit={(e) => e.preventDefault()}
              >
                <span className="search-btn">
                  <i className="fa-light fa-magnifying-glass"></i>
                </span>
                <input
                  type="text"
                  className="form-search-input"
                  placeholder="Tìm kiếm món ăn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                />
                <button
                  type="button"
                  className="filter-btn"
                  onClick={handleToggleFilterClick}
                >
                  <i className="fa-light fa-filter-list"></i>
                  <span>Lọc</span>
                </button>
              </form>
            </div>

            {/* Right menu */}
            <div className="header-middle-right">
              <ul className="header-middle-right-list">
                {/* User */}
                <li className="header-middle-right-item dropdown open">
                  <i className="fa-light fa-user"></i>
                  <div className="auth-container">
                    {!isLoggedIn ? (
                      <>
                        <span className="text-dndk">Đăng nhập / Đăng ký</span>
                        <span className="text-tk">
                          Tài khoản{" "}
                          <i className="fa-sharp fa-solid fa-caret-down"></i>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-dndk">Tài khoản</span>
                        <span className="text-tk">
                          {auth.accountName}{" "}
                          <i className="fa-sharp fa-solid fa-caret-down"></i>
                        </span>
                      </>
                    )}
                  </div>
                  <ul className="header-middle-right-menu">
                    {!isLoggedIn ? (
                      <>
                        <li>
                          <Link id="login" to="/auth?action=login">
                            <i className="fa-light fa-right-to-bracket"></i>{" "}
                            Đăng nhập
                          </Link>
                        </li>
                        <li>
                          <Link id="signup" to="/auth?action=register">
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
                            hàng đã mua
                          </a>
                        </li>
                        <li className="border">
                          <a
                            id="logout"
                            href="javascript:;"
                            onClick={(e) => {
                              e.preventDefault(); // chặn reload
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

                {/* Cart */}
                <li
                  className="header-middle-right-item open"
                  onClick={openCart}
                >
                  <div className="cart-icon-menu">
                    <i className="fa-light fa-basket-shopping"></i>
                    {/* Hiển thị số lượng một cách an toàn */}
                    <span className="count-product-cart">{totalAmount}</span>
                  </div>
                  <span>Giỏ hàng</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <AdvancedSearch
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      {isHeaderBottomVisible && <HeaderBottom />}
    </>
  );
}

function HeaderBottom() {
  // Hook useFilters giờ cũng cung cấp category
  const { filters, setFilters } = useFilters();
  const { data: categories = [] } = useCategories(); // mặc định mảng rỗng
  const location = useLocation();
  const navigate = useNavigate();

  const handleCategoryChange = (e, catId) => {
    e.preventDefault();
    setFilters({ category: catId }); // Gọi setFilters của context

    if (location.pathname === "/") {
      // Gọi hàm cuộn khi đổi category ---
      setTimeout(scrollToProducts, 0);
    } else {
      navigate(`/`);
      // Trang sẽ tự cuộn khi điều hướng
    }
  };

  return (
    <nav className="header-bottom">
      <div className="container">
        <ul className="menu-list">
          <li className="menu-list-item">
            <a
              href="#"
              className={`menu-link ${
                filters.category === "all" ? "active" : ""
              }`}
              onClick={(e) => handleCategoryChange(e, "all")}
            >
              Trang chủ
            </a>
          </li>

          {categories.map((cat) => (
            <li key={cat.id} className="menu-list-item">
              <a
                href="#"
                className={`menu-link ${
                  filters.category === cat.id ? "active" : ""
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
